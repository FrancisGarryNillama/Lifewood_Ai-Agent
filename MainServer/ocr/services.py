"""
Thin wrapper around EasyOCR.
Initialises the reader exactly once (heavy model load) and exposes
a function that returns ordered text lines from an image path or
in-memory file.
"""

import os
import threading
import tempfile

import easyocr
import numpy as np
from django.conf import settings


_reader = None
_lock = threading.Lock()


def _get_reader():
    global _reader
    if _reader is None:
        with _lock:
            if _reader is None:
                storage = getattr(
                    settings,
                    "EASYOCR_MODEL_DIR",
                    None,
                )
                _reader = easyocr.Reader(
                    ["en"],
                    model_storage_directory=storage,
                )
    return _reader


# ── line-ordering logic (from your snippet) ────────────────────────
def _ordered_lines(result, line_tol_factor=0.7):
    def min_x(b):
        return min(p[0] for p in b)

    def min_y(b):
        return min(p[1] for p in b)

    def center_y(b):
        ys = [p[1] for p in b]
        return (min(ys) + max(ys)) / 2

    def height(b):
        ys = [p[1] for p in b]
        return max(ys) - min(ys)

    items = []
    for bbox, text, conf in result:
        items.append(
            {
                "bbox": bbox,
                "text": text,
                "conf": conf,
                "min_x": min_x(bbox),
                "min_y": min_y(bbox),
                "cy": center_y(bbox),
                "h": max(1.0, float(height(bbox))),
            }
        )

    items.sort(key=lambda d: (d["min_y"], d["min_x"]))

    hs = [d["h"] for d in items] or [10.0]
    med_h = float(np.median(hs))
    line_tol = line_tol_factor * med_h

    lines, current, current_cy = [], [], None

    for d in items:
        if current_cy is None:
            current = [d]
            current_cy = d["cy"]
            continue
        if abs(d["cy"] - current_cy) <= line_tol:
            current.append(d)
            current_cy = (
                current_cy * (len(current) - 1) + d["cy"]
            ) / len(current)
        else:
            lines.append(current)
            current = [d]
            current_cy = d["cy"]

    if current:
        lines.append(current)

    out = []
    avg_confs = []
    for line in lines:
        line.sort(key=lambda d: d["min_x"])
        text = " ".join(d["text"] for d in line).strip()
        avg_conf = np.mean([d["conf"] for d in line])
        out.append(text)
        avg_confs.append(float(avg_conf))

    return out, avg_confs


# ── public API ──────────────────────────────────────────────────────
def extract_text(image_source) -> dict:
    """
    Accept a file path **or** an InMemoryUploadedFile / TemporaryUploadedFile
    and return::

        {
            "lines": ["line1", "line2", ...],
            "paragraph": "line1 line2 ...",
            "avg_confidence": 0.87,
            "raw_result": <easyocr result list>
        }
    """
    reader = _get_reader()

    # If it's a Django upload file, write to a temp file first
    if hasattr(image_source, "read"):
        suffix = ".png"
        if hasattr(image_source, "name"):
            _, ext = os.path.splitext(image_source.name)
            if ext:
                suffix = ext
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            for chunk in image_source.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        try:
            raw = reader.readtext(tmp_path)
        finally:
            os.unlink(tmp_path)
    else:
        raw = reader.readtext(image_source)

    lines, confs = _ordered_lines(raw)
    paragraph = " ".join(" ".join(lines).split())
    avg_conf = float(np.mean(confs)) if confs else 0.0

    return {
        "lines": lines,
        "paragraph": paragraph,
        "avg_confidence": round(avg_conf, 4),
        "raw_result": raw,
    }