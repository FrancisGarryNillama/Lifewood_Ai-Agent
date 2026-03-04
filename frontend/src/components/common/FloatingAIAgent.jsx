import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Minus,
  Send,
  Sparkles,
  Activity,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import { useAuthContext } from '../../context';

const PANEL_MAX_WIDTH = 500;
const PANEL_MAX_HEIGHT = 650;
const TOGGLE_SIZE = 64;
const EDGE_GAP = 12;
const CORNER_OFFSET = 24;
const POSITION_STORAGE_KEY = 'lifewood_floating_ai_position';

const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth < 640;

const getPanelSize = () => {
  if (typeof window === 'undefined') return { w: PANEL_MAX_WIDTH, h: PANEL_MAX_HEIGHT };
  const w = Math.min(PANEL_MAX_WIDTH, window.innerWidth - EDGE_GAP * 2);
  const h = Math.min(PANEL_MAX_HEIGHT, window.innerHeight - EDGE_GAP * 2);
  return { w, h };
};

const clampToViewport = (x, y, isOpen) => {
  if (typeof window === 'undefined') return { x, y };

  const { w, h } = getPanelSize();
  const width = isOpen ? w : TOGGLE_SIZE;
  const height = isOpen ? h : TOGGLE_SIZE;
  const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
  const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);

  return {
    x: Math.min(Math.max(EDGE_GAP, x), maxX),
    y: Math.min(Math.max(EDGE_GAP, y), maxY),
  };
};

const getDefaultPosition = (isOpen = true) => {
  if (typeof window === 'undefined') return { x: EDGE_GAP, y: EDGE_GAP };
  const { w, h } = getPanelSize();
  const width = isOpen ? w : TOGGLE_SIZE;
  const height = isOpen ? h : TOGGLE_SIZE;
  return clampToViewport(
    window.innerWidth - width - CORNER_OFFSET,
    window.innerHeight - height - CORNER_OFFSET,
    isOpen
  );
};

const getSavedPosition = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(POSITION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (typeof parsed?.x !== 'number' || typeof parsed?.y !== 'number') return null;
    return parsed;
  } catch (_error) {
    return null;
  }
};

export default function FloatingAIAgent() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimizedPinned, setIsMinimizedPinned] = useState(true);
  const [dragTarget, setDragTarget] = useState(null);
  const sampleMessages = [
    { id: 1, sender: 'assistant', text: 'Hello! I will summarize OCR outputs and surface totals, vendors, and dates.' },
    { id: 2, sender: 'assistant', text: 'Ask: "Show anomalies in these receipts" or "List expenses by category".' },
    { id: 3, sender: 'assistant', text: 'Future: inline highlights, quick exports, and validation rules.' },
  ];
  const [openPosition, setOpenPosition] = useState(() => {
    const saved = getSavedPosition();
    if (saved) return clampToViewport(saved.x, saved.y, true);
    return getDefaultPosition(true);
  });
  const [minimizedPosition, setMinimizedPosition] = useState(() => getDefaultPosition(false));

  const panelRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const movedWhileDraggingRef = useRef(false);
  const openOriginRef = useRef({
    pinned: true,
    position: getDefaultPosition(false),
  });

  const startDrag = (event, target) => {
    // Support both mouse and touch events
    const isTouch = event.type === 'touchstart';
    if (!isTouch && event.button !== 0) return;

    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const clientX = isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = isTouch ? event.touches[0].clientY : event.clientY;
    dragOffsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    movedWhileDraggingRef.current = false;
    setDragTarget(target);
    // Avoid passive event warning on some mobile browsers
    if (event.cancelable) event.preventDefault();
  };

  const handlePanelDragStart = (event) => startDrag(event, 'open');
  const handleMinimizedDragStart = (event) => startDrag(event, 'minimized');

  useEffect(() => {
    if (!dragTarget) return undefined;

    const handleMove = (event) => {
      const isTouch = event.type === 'touchmove';
      const clientX = isTouch ? event.touches[0].clientX : event.clientX;
      const clientY = isTouch ? event.touches[0].clientY : event.clientY;
      const nextX = clientX - dragOffsetRef.current.x;
      const nextY = clientY - dragOffsetRef.current.y;
      const isDraggingOpen = dragTarget === 'open';
      const clamped = clampToViewport(nextX, nextY, isDraggingOpen);
      movedWhileDraggingRef.current = true;

      if (isDraggingOpen) {
        setOpenPosition((prev) =>
          prev.x === clamped.x && prev.y === clamped.y ? prev : clamped
        );
      } else {
        setIsMinimizedPinned(false);
        setMinimizedPosition((prev) =>
          prev.x === clamped.x && prev.y === clamped.y ? prev : clamped
        );
      }
    };

    const handleEnd = () => {
      const wasDraggingMinimized = dragTarget === 'minimized';
      const moved = movedWhileDraggingRef.current;

      setDragTarget(null);

      if (wasDraggingMinimized && !moved) {
        openOriginRef.current = isMinimizedPinned
          ? { pinned: true, position: getDefaultPosition(false) }
          : { pinned: false, position: { ...minimizedPosition } };

        if (!isMinimizedPinned) {
          setOpenPosition(
            clampToViewport(
              minimizedPosition.x,
              minimizedPosition.y,
              true
            )
          );
        }
        // On mobile, center the open panel
        if (isMobileViewport()) {
          setOpenPosition({ x: EDGE_GAP, y: EDGE_GAP });
        }
        setIsOpen(true);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragTarget, isMinimizedPinned, minimizedPosition]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setOpenPosition((prev) => clampToViewport(prev.x, prev.y, true));
        return;
      }

      if (isMinimizedPinned) {
        setMinimizedPosition(getDefaultPosition(false));
      } else {
        setMinimizedPosition((prev) => clampToViewport(prev.x, prev.y, false));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, isMinimizedPinned]);

  useEffect(() => {
    try {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(openPosition));
    } catch (_error) {
      // Ignore storage write failures.
    }
  }, [openPosition]);

  useEffect(() => {
    if (user) return;

    const defaults = getDefaultPosition(true);
    setOpenPosition(defaults);
    setMinimizedPosition(getDefaultPosition(false));
    setIsMinimizedPinned(true);
    setIsOpen(false);
    openOriginRef.current = {
      pinned: true,
      position: getDefaultPosition(false),
    };

    try {
      localStorage.removeItem(POSITION_STORAGE_KEY);
    } catch (_error) {
      // Ignore storage remove failures.
    }
  }, [user]);

  if (!user) return null;

  if (!isOpen) {
    return (
      <button
        ref={panelRef}
        type="button"
        onMouseDown={handleMinimizedDragStart}
        onTouchStart={handleMinimizedDragStart}
        className="fixed z-[9999] w-16 h-16 rounded-full border border-white/30 bg-lifewood-darkSerpent/70 backdrop-blur-xl shadow-2xl text-white flex items-center justify-center hover:bg-lifewood-darkSerpent/80 transition-colors"
        style={
          isMinimizedPinned
            ? { right: `${CORNER_OFFSET}px`, bottom: `${CORNER_OFFSET}px` }
            : { left: `${minimizedPosition.x}px`, top: `${minimizedPosition.y}px` }
        }
        aria-label="Open Lifewood AI Assistant"
      >
        <Bot className="w-9 h-9 text-lifewood-saffaron" />
      </button>
    );
  }

  return (
    <section
      ref={panelRef}
      className="fixed z-[70] w-[calc(100vw-24px)] sm:w-[500px] h-[calc(100vh-24px)] sm:h-[650px] max-w-[500px] max-h-[650px] rounded-2xl border border-white/20 bg-lifewood-darkSerpent bg-[radial-gradient(circle_at_25%_15%,rgba(255,179,71,0.14),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(3,78,52,0.22),transparent_48%)] backdrop-blur-2xl shadow-[0_28px_80px_rgba(0,0,0,0.32)] overflow-hidden"
      style={{ left: `${openPosition.x}px`, top: `${openPosition.y}px` }}
      aria-label="Lifewood AI Assistant"
    >
      <header
        className={`px-3 sm:px-4 py-3 border-b border-white/20 select-none ${
          dragTarget === 'open' ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handlePanelDragStart}
        onTouchStart={handlePanelDragStart}
      >
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 text-white min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm flex-shrink-0">
              <Bot className="w-5 h-5 text-lifewood-saffaron" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">Lifewood AI Assistant</h3>
              <p className="text-[10px] sm:text-[11px] text-white/70 mt-0.5 truncate">OCR Task Assistant</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-lifewood-darkSerpent bg-lifewood-saffaron/90 shadow-md flex-shrink-0 whitespace-nowrap">
            <Activity className="w-3 h-3" />
            Coming Soon
          </span>
          <button
            type="button"
            onClick={() => {
              const origin = openOriginRef.current;
              if (origin?.pinned) {
                setIsMinimizedPinned(true);
                setMinimizedPosition(getDefaultPosition(false));
              } else {
                setIsMinimizedPinned(false);
                setMinimizedPosition(
                  clampToViewport(origin.position.x, origin.position.y, false)
                );
              }
              setIsOpen(false);
            }}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition-colors"
            aria-label="Minimize Lifewood AI Assistant"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="h-[calc(100%-57px)] flex flex-col">
        <div className="flex-1 px-3 sm:px-4 pb-4 pt-3 overflow-y-auto space-y-3">
          <div className="rounded-2xl border border-white/15 bg-white/6 backdrop-blur-sm shadow-[0_12px_36px_rgba(0,0,0,0.22)] p-3">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Sparkles className="w-4 h-4 text-lifewood-saffaron" />
              <span className="text-xs font-semibold uppercase tracking-wide">Preview</span>
            </div>
            <div className="space-y-3">
              {sampleMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-lg border ${
                      msg.sender === 'assistant'
                        ? 'bg-white/10 text-white border-white/10'
                        : 'bg-lifewood-saffaron text-lifewood-darkSerpent border-lifewood-saffaron/70'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-3">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MessageSquare className="w-4 h-4 text-lifewood-saffaron" />
              <span className="text-xs font-semibold uppercase tracking-wide">Quick prompts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Summarize OCR", "Find totals", "List vendors", "Flag anomalies", "Export summary"]
                .map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white/80 bg-white/8 border border-white/15 hover:border-white/30 hover:text-white transition-all cursor-not-allowed"
                  >
                    {label}
                  </button>
                ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-gradient-to-r from-lifewood-saffaron/18 via-white/6 to-lifewood-castletonGreen/12 p-3 flex items-center gap-3 text-white/85 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-lifewood-saffaron" />
            </div>
            <div className="text-sm leading-relaxed">
              Upcoming: OCR-aware replies, inline highlights, and quick export actions from chat.
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t border-white/15 bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              disabled
              placeholder="Type your message..."
              className="w-full h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl border border-white/20 bg-white/10 text-sm text-white/75 placeholder-white/50 cursor-not-allowed focus:outline-none"
            />
            <button
              type="button"
              disabled
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-lifewood-saffaron/80 text-lifewood-darkSerpent font-bold cursor-not-allowed flex items-center justify-center shadow-lg flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-white/55">
            Chat actions are disabled in preview mode.
          </p>
        </div>
      </div>
    </section>
  );
}
