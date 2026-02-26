import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Header, BackgroundLayout } from '../components/layout';
import Sidebar from '../components/layout/Sidebar/Sidebar';

// Upload features
import {
    MultiImageUploader,
    ImagePreviewPanel,
    ImageEditorWrapper,
    ExtractedPanel,
    useTorUpload,
} from '../features/transcript';
import { ProfilePanel, useProfile } from '../features/profile';
import { useModal, useNotification, useDebounce } from '../hooks';
import { useAuthContext } from '../context';
import { Upload, Sparkles, Search, Download, Pencil, Trash2, X, ZoomIn, ZoomOut, ImageOff, Image as ImageIcon, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Modal, ModalContent, ModalFooter, ConfirmDialog, Button, Input } from '../components/common';

// Faculty / Department features
import { useDepartment } from '../features/department/hooks/useDepartment';
import { formatDate, parseExpenseReceiptsFromOcr } from '../utils';

const EXPENSE_RECEIPTS_KEY = 'expenseReceipts';
const STATIC_EXPENSE_RECEIPTS = [
    {
        rowId: 'seed-rcp-1001',
        receiptNo: 'RCP-1001',
        date: '2026-02-20',
        amount: 150.5,
        amountLabel: 'PHP 150.50',
        expenseType: 'Meals',
        name: 'Juan Dela Cruz',
        status: 'Parsed',
        sourceText: 'Lunch receipt',
    },
    {
        rowId: 'seed-rcp-1002',
        receiptNo: 'RCP-1002',
        date: '2026-02-21',
        amount: 3500,
        amountLabel: 'PHP 3500.00',
        expenseType: 'Travel',
        name: 'Maria Santos',
        status: 'Parsed',
        sourceText: 'Flight booking',
    },
    {
        rowId: 'seed-rcp-1003',
        receiptNo: 'RCP-1003',
        date: '2026-02-22',
        amount: 980,
        amountLabel: 'PHP 980.00',
        expenseType: 'Office Supplies',
        name: 'Carlo Reyes',
        status: 'Parsed',
        sourceText: 'Printer ink and paper',
    },
    {
        rowId: 'seed-rcp-1004',
        receiptNo: 'RCP-1004',
        date: '2026-02-23',
        amount: 2200,
        amountLabel: 'PHP 2200.00',
        expenseType: 'Utilities',
        name: 'Ana Gomez',
        status: 'Parsed',
        sourceText: 'Internet subscription',
    },
    {
        rowId: 'seed-rcp-1005',
        receiptNo: 'RCP-1005',
        date: '2026-02-24',
        amount: 1800,
        amountLabel: 'PHP 1800.00',
        expenseType: 'Accommodation',
        name: 'Luis Mendoza',
        status: 'Parsed',
        sourceText: 'Hotel stay',
    },
];

/* ─── Receipt Image Lightbox ─────────────────────────────────────────────── */
function ReceiptImageModal({ row, onClose }) {
    const [zoom, setZoom] = useState(1);
    const [dragging, setDragging] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [base, setBase] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);

    // Reset zoom/pan when row changes
    useEffect(() => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setBase({ x: 0, y: 0 });
    }, [row]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const clampZoom = (v) => Math.min(5, Math.max(1, v));

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        setZoom((z) => clampZoom(z + delta));
    };

    const handleMouseDown = (e) => {
        if (zoom <= 1) return;
        setDragging(true);
        setOrigin({ x: e.clientX, y: e.clientY });
        setBase({ ...offset });
    };
    const handleMouseMove = (e) => {
        if (!dragging) return;
        setOffset({ x: base.x + (e.clientX - origin.x), y: base.y + (e.clientY - origin.y) });
    };
    const handleMouseUp = () => setDragging(false);

    const handleDownload = () => {
        if (!row?.imageData) return;
        const link = document.createElement('a');
        link.href = row.imageData;
        const mimeMatch = row.imageData.match(/^data:(image\/[a-z+]+);/);
        const ext = mimeMatch ? mimeMatch[1].replace('image/', '').replace('jpeg', 'jpg') : 'png';
        link.download = row.imageName || `${row.receiptNo || row.idLabel || 'receipt'}.${ext}`;
        link.click();
    };

    if (!row) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Modal card */}
            <div
                className="relative flex flex-col bg-lifewood-darkSerpent rounded-2xl shadow-lifewood-lg overflow-hidden
                           w-full max-w-3xl max-h-[95vh] border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-lifewood-saffaron/15 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-4 h-4 text-lifewood-saffaron" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate">
                                {row.receiptNo || row.idLabel}
                            </p>
                            <p className="text-white/40 text-xs truncate">
                                {row.name} &middot; {row.amountLabel}
                            </p>
                        </div>
                    </div>

                    {/* Zoom controls + download + close */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {row.imageData && (
                            <>
                                <button
                                    onClick={() => setZoom((z) => clampZoom(z - 0.25))}
                                    disabled={zoom <= 1}
                                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                                    title="Zoom out"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-white/50 text-xs w-10 text-center tabular-nums">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <button
                                    onClick={() => setZoom((z) => clampZoom(z + 0.25))}
                                    disabled={zoom >= 5}
                                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                                    title="Zoom in"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>

                                {/* Thin divider */}
                                <div className="w-px h-5 bg-white/15 mx-1" />

                                <button
                                    onClick={handleDownload}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                               bg-lifewood-saffaron/15 text-lifewood-saffaron hover:bg-lifewood-saffaron/25
                                               text-xs font-semibold transition-colors"
                                    title="Download image"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </button>

                                <div className="w-px h-5 bg-white/15 mx-1" />
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            title="Close (Esc)"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Image viewport ── */}
                <div
                    className="flex-1 overflow-hidden bg-[#0a1a0f] flex items-center justify-center"
                    style={{ minHeight: 320, cursor: row.imageData ? (zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in') : 'default' }}
                    onWheel={row.imageData ? handleWheel : undefined}
                    onMouseDown={row.imageData ? handleMouseDown : undefined}
                    onMouseMove={row.imageData ? handleMouseMove : undefined}
                    onMouseUp={row.imageData ? handleMouseUp : undefined}
                    onMouseLeave={row.imageData ? handleMouseUp : undefined}
                >
                    {row.imageData ? (
                        <img
                            ref={imgRef}
                            src={row.imageData}
                            alt={`Receipt ${row.receiptNo || row.idLabel}`}
                            draggable={false}
                            className="max-w-full max-h-[60vh] object-contain select-none transition-transform duration-150"
                            style={{
                                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                                transformOrigin: 'center',
                            }}
                            onClick={() => {
                                if (zoom < 5) setZoom((z) => clampZoom(z + 0.5));
                                else { setZoom(1); setOffset({ x: 0, y: 0 }); }
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-white/30 py-16">
                            <ImageOff className="w-14 h-14" />
                            <p className="text-sm font-medium">No image attached to this receipt</p>
                            <p className="text-xs text-white/20">Only OCR-uploaded receipts have images</p>
                        </div>
                    )}
                </div>

                {/* ── Footer metadata strip ── */}
                <div className="px-5 py-3 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/40">
                    {[
                        { label: 'Date',         value: row.date },
                        { label: 'Expense Type', value: row.category || row.expenseType },
                        { label: 'Amount',       value: row.amountLabel },
                        { label: 'Status',       value: row.status },
                    ].map(({ label, value }) => (
                        <span key={label}>
                            <span className="text-white/25">{label}:{' '}</span>
                            <span className="text-white/60 font-semibold">{value || '—'}</span>
                        </span>
                    ))}
                    {zoom > 1 && (
                        <button
                            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
                            className="ml-auto text-lifewood-saffaron/70 hover:text-lifewood-saffaron transition-colors"
                        >
                            Reset view
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Upload state
    const [uploadedImages, setUploadedImages] = useState([]);
    const [editingImage, setEditingImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showProcessingModal, setShowProcessingModal] = useState(false);

    // Receipt image preview
    const [viewingImage, setViewingImage] = useState(null);

    // Auth context
    const { user } = useAuthContext();
    const userName = user?.username || '';

    // Modals
    const profileModal = useModal();
    const previewModal = useModal();
    const editorModal = useModal();
    const resultsModal = useModal();

    const { uploadOcr, loading: uploadLoading, ocrResults } = useTorUpload();

    // Profile check
    const { profileExists, loading: profileLoading, checkExists, checkComplete } = useProfile(userName, user?.role);
    const { showError, showSuccess } = useNotification();

    // Auto-open profile for new users
    useEffect(() => {
        if (checkComplete && !profileExists && !profileLoading) {
            profileModal.open();
        }
    }, [checkComplete, profileExists, profileLoading, profileModal]);

    // Department Table State
    const [activeTab, setActiveTab] = useState('requests');
    const {
        requests,
        applications,
        accepted,
        loading: tableLoading,
        fetchAllData,
    } = useDepartment();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [expenseReceipts, setExpenseReceipts] = useState([]);
    const [editingReceipt, setEditingReceipt] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filterExpenseType, setFilterExpenseType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [filterMinAmount, setFilterMinAmount] = useState('');
    const [filterMaxAmount, setFilterMaxAmount] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editForm, setEditForm] = useState({
        date: '',
        receiptNo: '',
        name: '',
        expenseType: '',
        amount: '',
        status: '',
        sourceText: '',
    });
    const debouncedSearch = useDebounce(searchQuery, 300);
    const staticGreetingName = 'Juan';

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(EXPENSE_RECEIPTS_KEY) || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
            setExpenseReceipts(stored);
            return;
        }
        localStorage.setItem(EXPENSE_RECEIPTS_KEY, JSON.stringify(STATIC_EXPENSE_RECEIPTS));
        setExpenseReceipts(STATIC_EXPENSE_RECEIPTS);
    }, []);

    // Upload Functions
    const handleContinueUpload = (images) => {
        setUploadedImages(images);
        setShowUploadModal(false);
        previewModal.open();
    };

    const handleEditImage = (image) => {
        setEditingImage(image);
        editorModal.open();
    };

    const handleSaveEdit = (updatedImage) => {
        const newImages = uploadedImages.map((img) =>
            img.id === updatedImage.id ? updatedImage : img
        );
        setUploadedImages(newImages);
    };

    const handleProcess = async () => {
        previewModal.close();
        setShowProcessingModal(true);

        try {
            const result = await uploadOcr(uploadedImages, userName);
            setShowProcessingModal(false);

            if (result && result.ocr_results && result.school_tor) {
                const parsedReceipts = parseExpenseReceiptsFromOcr(result, userName, { images: uploadedImages });
                if (parsedReceipts.length > 0) {
                    setExpenseReceipts((prev) => {
                        const merged = [...parsedReceipts, ...prev];
                        const uniqueRows = [];
                        const seen = new Set();

                        merged.forEach((row) => {
                            const key = `${row.receiptNo}-${row.amountLabel}-${row.date}`;
                            if (seen.has(key)) return;
                            seen.add(key);
                            uniqueRows.push(row);
                        });

                        localStorage.setItem(EXPENSE_RECEIPTS_KEY, JSON.stringify(uniqueRows));
                        return uniqueRows;
                    });
                }

                setTimeout(() => {
                    resultsModal.open();
                }, 100);
            } else {
                showError('Invalid OCR response format');
            }
        } catch (error) {
            setShowProcessingModal(false);
            showError(error.message || 'OCR processing failed');
        }
    };

    const handleCloseResults = () => {
        resultsModal.close();
        setUploadedImages([]);
        fetchAllData(); // Refresh table after upload
    };

    // Table Functions
    const filterData = (data, idField) => {
        if (!debouncedSearch.trim()) return data;

        return data.filter((item) => {
            const query = debouncedSearch.toLowerCase();

            return (
                item.applicant_name?.toLowerCase().includes(query) ||
                item[idField]?.toString().toLowerCase().includes(query) ||
                item.status?.toLowerCase().includes(query)
            );
        });
    };

    const filteredRequests = filterData(requests || [], 'accountID');
    const filteredApplications = filterData(applications || [], 'applicant_id');
    const filteredAccepted = filterData(accepted || [], 'accountID');
    const hasReceiptData = expenseReceipts.length > 0;

    const filteredReceiptRows = expenseReceipts.filter((item) => {
        // text search
        if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            const matchesText = (
                item.receiptNo?.toLowerCase().includes(q) ||
                item.expenseType?.toLowerCase().includes(q) ||
                item.name?.toLowerCase().includes(q) ||
                item.amountLabel?.toLowerCase().includes(q) ||
                item.date?.toLowerCase().includes(q)
            );
            if (!matchesText) return false;
        }

        // expense type filter
        if (filterExpenseType && item.expenseType !== filterExpenseType) return false;

        // status filter
        if (filterStatus && item.status !== filterStatus) return false;

        // date range filter
        if (filterDateFrom) {
            const from = new Date(filterDateFrom);
            const d = new Date(item.date);
            if (isFinite(from.getTime()) && isFinite(d.getTime()) && d < from) return false;
        }
        if (filterDateTo) {
            const to = new Date(filterDateTo);
            const d = new Date(item.date);
            if (isFinite(to.getTime()) && isFinite(d.getTime()) && d > to) return false;
        }

        // amount range filter
        const amt = Number((item.amount ?? String(item.amountLabel || '')).toString().replace(/[^0-9.]/g, '')) || 0;
        if (filterMinAmount && !Number.isNaN(Number(filterMinAmount)) && amt < Number(filterMinAmount)) return false;
        if (filterMaxAmount && !Number.isNaN(Number(filterMaxAmount)) && amt > Number(filterMaxAmount)) return false;

        return true;
    });

    const handleOpenUpload = () => {
        if (!profileExists) {
            showError('Please fill out your profile first');
            profileModal.open();
            return;
        }
        setShowUploadModal(true);
    };

    const ledgerRows = (() => {
        if (hasReceiptData) {
            if (activeTab === 'applications') {
                return filteredReceiptRows
                    .filter((row) => ['Meals', 'Travel', 'Fuel', 'Accommodation'].includes(row.expenseType))
                    .map((row) => ({
                        ...row,
                        idLabel: row.receiptNo,
                        category: row.expenseType,
                        route: null,
                    }));
            }

            if (activeTab === 'accepted') {
                return filteredReceiptRows
                    .filter((row) => ['Office Supplies', 'Utilities', 'Other'].includes(row.expenseType))
                    .map((row) => ({
                        ...row,
                        idLabel: row.receiptNo,
                        category: row.expenseType,
                        route: null,
                    }));
            }

            return filteredReceiptRows.map((row) => ({
                ...row,
                idLabel: row.receiptNo,
                category: row.expenseType,
                route: null,
            }));
        }

        if (activeTab === 'requests') {
            return filteredRequests.map((item) => ({
                rowId: `request-${item.accountID}`,
                date: item.request_date,
                idLabel: item.accountID,
                name: item.applicant_name,
                category: 'Intake',
                status: item.status || 'Pending',
                amountLabel: 'Awaiting OCR',
                route: `/request/${item.accountID}`,
            }));
        }

        if (activeTab === 'applications') {
            return filteredApplications.map((item) => ({
                rowId: `application-${item.applicant_id}`,
                date: item.request_date,
                idLabel: item.applicant_id,
                name: item.applicant_name,
                category: 'OCR',
                status: item.status || 'In Progress',
                amountLabel: 'Extracting Fields',
                route: `/document/${item.applicant_id}`,
            }));
        }

        return filteredAccepted.map((item) => ({
            rowId: `accepted-${item.accountID}`,
            date: item.accepted_date || item.request_date,
            idLabel: item.accountID,
            name: item.applicant_name,
            category: 'Review',
            status: item.status || 'Accepted',
            amountLabel: 'Validated',
            route: `/finalDocument/${item.accountID}`,
        }));
    })();

    const sortedLedgerRows = (() => {
        const arr = [...ledgerRows];
        const dir = sortDir === 'asc' ? 1 : -1;

        const numericValue = (r) => Number((r.amount ?? String(r.amountLabel || '')).toString().replace(/[^0-9.]/g, '')) || 0;

        arr.sort((a, b) => {
            if (sortBy === 'date') {
                const da = new Date(a.date || 0).getTime();
                const db = new Date(b.date || 0).getTime();
                return (da - db) * dir;
            }
            if (sortBy === 'receiptNo') {
                return (String(a.receiptNo || a.idLabel || '').localeCompare(String(b.receiptNo || b.idLabel || ''))) * dir;
            }
            if (sortBy === 'name') {
                return (String(a.name || '').localeCompare(String(b.name || '')) ) * dir;
            }
            if (sortBy === 'category') {
                return (String(a.category || a.expenseType || '').localeCompare(String(b.category || b.expenseType || ''))) * dir;
            }
            if (sortBy === 'amount') {
                return (numericValue(a) - numericValue(b)) * dir;
            }
            if (sortBy === 'status') {
                return (String(a.status || '').localeCompare(String(b.status || ''))) * dir;
            }
            // fallback: date desc
            return (new Date(b.date) - new Date(a.date));
        });
        return arr;
    })();
    const selectedInView = selectedRows.filter((id) => sortedLedgerRows.some((row) => row.rowId === id));
    const allSelected = sortedLedgerRows.length > 0 && selectedInView.length === sortedLedgerRows.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedRows((prev) => prev.filter((id) => !sortedLedgerRows.some((row) => row.rowId === id)));
            return;
        }

        setSelectedRows((prev) => {
            const rowIds = sortedLedgerRows.map((row) => row.rowId);
            const merged = new Set([...prev, ...rowIds]);
            return Array.from(merged);
        });
    };

    const toggleRowSelection = (rowId) => {
        setSelectedRows((prev) => (
            prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
        ));
    };

    const handleExportSelected = () => {
        const exportRows = sortedLedgerRows.filter((row) => selectedRows.includes(row.rowId));
        if (exportRows.length === 0) return;

        const blob = new Blob([JSON.stringify(exportRows, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lifewood-expense-receipts-${activeTab}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadRow = (row) => {
        // Prefer downloading the actual receipt image when available
        if (row.imageData) {
            const link = document.createElement('a');
            link.href = row.imageData;
            // Determine extension from data-url mime type
            const mimeMatch = row.imageData.match(/^data:(image\/[a-z+]+);/);
            const ext = mimeMatch ? mimeMatch[1].replace('image/', '').replace('jpeg', 'jpg') : 'png';
            link.download = (row.imageName || `${row.receiptNo || row.idLabel || 'receipt'}.${ext}`);
            link.click();
            return;
        }
        // Fallback: download metadata as JSON
        const { imageData: _img, imageName: _imgName, ...exportRow } = row;
        const blob = new Blob([JSON.stringify(exportRow, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${row.receiptNo || row.idLabel || 'receipt'}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleEditRow = (row) => {
        if (!hasReceiptData) {
            showError('Edit is available for parsed receipt entries only.');
            return;
        }
        const parsedAmountFromLabel = Number((row.amountLabel || '').replace(/[^0-9.]/g, ''));
        const amountSeed = row.amount ?? (Number.isNaN(parsedAmountFromLabel) ? 0 : parsedAmountFromLabel);

        setEditingReceipt(row);
        setEditForm({
            date: row.date || '',
            receiptNo: row.receiptNo || row.idLabel || '',
            name: row.name || '',
            expenseType: row.expenseType || row.category || 'Other',
            amount: amountSeed === 0 ? '' : String(amountSeed),
            status: row.status || 'Parsed',
            sourceText: row.sourceText || '',
        });
    };

    const handleDeleteRow = (row) => {
        if (!hasReceiptData) {
            showError('Delete is available for parsed receipt entries only.');
            return;
        }
        setDeleteTarget(row);
    };

    const handleSaveEditedReceipt = () => {
        if (!editingReceipt) return;
        const nextAmount = Number(String(editForm.amount).replace(/[^0-9.]/g, ''));

        if (!editForm.date || !editForm.receiptNo || !editForm.name || !editForm.expenseType || Number.isNaN(nextAmount)) {
            showError('Please complete all required fields with valid values.');
            return;
        }

        setExpenseReceipts((prev) => {
            const updated = prev.map((item) => (
                item.rowId === editingReceipt.rowId
                    ? {
                        ...item,
                        date: editForm.date,
                        receiptNo: editForm.receiptNo,
                        idLabel: editForm.receiptNo,
                        name: editForm.name,
                        expenseType: editForm.expenseType,
                        category: editForm.expenseType,
                        amount: nextAmount,
                        amountLabel: `PHP ${nextAmount.toFixed(2)}`,
                        status: editForm.status || 'Parsed',
                        sourceText: editForm.sourceText || item.sourceText,
                    }
                    : item
            ));
            localStorage.setItem(EXPENSE_RECEIPTS_KEY, JSON.stringify(updated));
            return updated;
        });

        setEditingReceipt(null);
        showSuccess('Receipt updated.');
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;

        setExpenseReceipts((prev) => {
            const updated = prev.filter((item) => item.rowId !== deleteTarget.rowId);
            localStorage.setItem(EXPENSE_RECEIPTS_KEY, JSON.stringify(updated));
            return updated;
        });
        setSelectedRows((prev) => prev.filter((id) => id !== deleteTarget.rowId));
        setDeleteTarget(null);
        showSuccess('Receipt deleted.');
    };

    const getStatusDotClass = (status) => {
        const normalized = status?.toLowerCase();
        if (normalized?.includes('accepted') || normalized?.includes('approved') || normalized?.includes('final')) {
            return 'bg-lifewood-castletonGreen';
        }
        if (normalized?.includes('deny') || normalized?.includes('reject')) {
            return 'bg-red-500';
        }
        return 'bg-amber-500';
    };

    return (
        <BackgroundLayout>
            {/* Page shell */}
            <div className="min-h-screen bg-lifewood-paper/60">
                <div className="relative z-10">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userName={userName} />
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        onOpenProfile={profileModal.open}
                    />

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                        {/* ── Greeting banner ──────────────────────────────────────── */}
                        <div className="relative overflow-hidden rounded-2xl bg-lifewood-darkSerpent text-white px-6 py-7 mb-6 shadow-lifewood-lg">
                            {/* decorative shimmer stripe */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-lifewood-goldenBrown via-lifewood-saffaron to-lifewood-earthYellow" />
                            {/* background pattern */}
                            <div className="absolute right-0 top-0 bottom-0 w-48 opacity-5 pointer-events-none"
                                style={{ background: 'radial-gradient(circle at 120% 50%, #FFB347 0%, transparent 70%)' }} />
                            <div className="relative z-10">
                                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
                                    Good Day,{' '}
                                    <span className="text-lifewood-saffaron">{staticGreetingName}</span>!
                                </h2>
                                <p className="text-white/55 text-sm">
                                    AI Agent OCR — upload expense receipts for instant extraction.
                                </p>
                            </div>
                        </div>

                        {/* ── OCR Workspace card ───────────────────────────────────── */}
                        <div className="bg-white rounded-2xl shadow-lifewood border border-lifewood-platinum/50 overflow-hidden mb-8">

                            {/* Card header */}
                            <div className="px-5 sm:px-6 py-5 border-b border-lifewood-platinum/60 bg-lifewood-paper/40">

                                {/* ── Row 1: Title  |  Upload + Export ── */}
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-7 rounded-full bg-gradient-to-b from-lifewood-saffaron to-lifewood-goldenBrown" />
                                        <h3 className="text-lg font-bold text-lifewood-darkSerpent">
                                            Expense OCR Workspace
                                        </h3>
                                        {selectedInView.length > 0 && (
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full
                                                             bg-lifewood-saffaron/20 text-lifewood-goldenBrown border border-lifewood-saffaron/30">
                                                {selectedInView.length} selected
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={handleOpenUpload}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                                                       bg-lifewood-castletonGreen hover:bg-lifewood-darkSerpent text-white
                                                       font-semibold text-sm shadow-green hover:shadow-lifewood-lg
                                                       transition-all duration-200 focus:outline-none focus:ring-2
                                                       focus:ring-lifewood-castletonGreen/40"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Upload Receipt
                                            <Upload className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={handleExportSelected}
                                            disabled={selectedInView.length === 0}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                                                       bg-lifewood-paper border border-lifewood-castletonGreen/30
                                                       text-lifewood-castletonGreen font-semibold text-sm
                                                       hover:bg-lifewood-castletonGreen hover:text-white
                                                       transition-all duration-200
                                                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-lifewood-paper disabled:hover:text-lifewood-castletonGreen"
                                        >
                                            <Download className="w-4 h-4" />
                                            Export
                                        </button>
                                    </div>
                                </div>

                                {/* ── Row 2: Search  |  Status  |  Category — always visible ── */}
                                <div className="flex flex-col sm:flex-row gap-3 items-end">
                                    {/* Search */}
                                    <div className="relative flex-1 min-w-0">
                                        <Search className="w-4 h-4 text-lifewood-asphalt/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by receipt no, employee, or description…"
                                            className="w-full h-[42px] pl-10 pr-4 rounded-xl
                                                       border border-lifewood-platinum bg-white text-sm
                                                       text-lifewood-darkSerpent placeholder-lifewood-asphalt/50
                                                       focus:outline-none focus:ring-2 focus:ring-lifewood-castletonGreen/20
                                                       focus:border-lifewood-castletonGreen transition-all"
                                        />
                                    </div>

                                    {/* Status dropdown */}
                                    <div className="flex flex-col shrink-0 w-full sm:w-[160px]">
                                        <label className="text-[10px] font-semibold text-lifewood-charcoal/60 uppercase tracking-wider mb-1 ml-1">Status</label>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="h-[42px] px-3 pr-8 rounded-xl border border-lifewood-platinum bg-white text-sm
                                                       text-lifewood-darkSerpent cursor-pointer
                                                       focus:outline-none focus:ring-2 focus:ring-lifewood-castletonGreen/20
                                                       focus:border-lifewood-castletonGreen transition-all appearance-none
                                                       bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                                                       bg-no-repeat bg-[right_0.75rem_center]"
                                        >
                                            <option value="">All Statuses</option>
                                            {Array.from(new Set(expenseReceipts.map(r => r.status).filter(Boolean))).map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Category dropdown */}
                                    <div className="flex flex-col shrink-0 w-full sm:w-[160px]">
                                        <label className="text-[10px] font-semibold text-lifewood-charcoal/60 uppercase tracking-wider mb-1 ml-1">Category</label>
                                        <select
                                            value={filterExpenseType}
                                            onChange={(e) => setFilterExpenseType(e.target.value)}
                                            className="h-[42px] px-3 pr-8 rounded-xl border border-lifewood-platinum bg-white text-sm
                                                       text-lifewood-darkSerpent cursor-pointer
                                                       focus:outline-none focus:ring-2 focus:ring-lifewood-castletonGreen/20
                                                       focus:border-lifewood-castletonGreen transition-all appearance-none
                                                       bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                                                       bg-no-repeat bg-[right_0.75rem_center]"
                                        >
                                            <option value="">All</option>
                                            {Array.from(new Set(expenseReceipts.map(r => r.expenseType).filter(Boolean))).map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* ── Row 3 (collapsible): Advanced filters ── */}
                                <div className="mt-3">
                                    <button
                                        onClick={() => setShowFilters((s) => !s)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-lifewood-charcoal/70
                                                   hover:text-lifewood-darkSerpent transition-colors"
                                    >
                                        <SlidersHorizontal className="w-3.5 h-3.5" />
                                        Advanced Filters
                                        {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>

                                    {showFilters && (
                                        <div className="mt-2.5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end
                                                        p-3.5 rounded-xl bg-lifewood-seaSalt/60 border border-lifewood-platinum/50">
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-semibold text-lifewood-charcoal/60 uppercase tracking-wider mb-1 ml-0.5">From</label>
                                                <input
                                                    type="date"
                                                    value={filterDateFrom}
                                                    onChange={(e) => setFilterDateFrom(e.target.value)}
                                                    className="px-3 py-2 rounded-lg border border-lifewood-platinum bg-white text-sm
                                                               text-lifewood-darkSerpent focus:outline-none focus:ring-2
                                                               focus:ring-lifewood-castletonGreen/20 focus:border-lifewood-castletonGreen transition-all"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-semibold text-lifewood-charcoal/60 uppercase tracking-wider mb-1 ml-0.5">To</label>
                                                <input
                                                    type="date"
                                                    value={filterDateTo}
                                                    onChange={(e) => setFilterDateTo(e.target.value)}
                                                    className="px-3 py-2 rounded-lg border border-lifewood-platinum bg-white text-sm
                                                               text-lifewood-darkSerpent focus:outline-none focus:ring-2
                                                               focus:ring-lifewood-castletonGreen/20 focus:border-lifewood-castletonGreen transition-all"
                                                />
                                            </div>

                                            <div className="w-px h-8 bg-lifewood-platinum/60 hidden sm:block self-center" />

                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-semibold text-lifewood-charcoal/60 uppercase tracking-wider mb-1 ml-0.5">Min Amount</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={filterMinAmount}
                                                    onChange={(e) => setFilterMinAmount(e.target.value)}
                                                    className="w-28 px-3 py-2 rounded-lg border border-lifewood-platinum bg-white text-sm
                                                               text-lifewood-darkSerpent focus:outline-none focus:ring-2
                                                               focus:ring-lifewood-castletonGreen/20 focus:border-lifewood-castletonGreen transition-all"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-semibold text-lifewood-charcoal/60 uppercase tracking-wider mb-1 ml-0.5">Max Amount</label>
                                                <input
                                                    type="number"
                                                    placeholder="∞"
                                                    value={filterMaxAmount}
                                                    onChange={(e) => setFilterMaxAmount(e.target.value)}
                                                    className="w-28 px-3 py-2 rounded-lg border border-lifewood-platinum bg-white text-sm
                                                               text-lifewood-darkSerpent focus:outline-none focus:ring-2
                                                               focus:ring-lifewood-castletonGreen/20 focus:border-lifewood-castletonGreen transition-all"
                                                />
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setFilterExpenseType('');
                                                    setFilterStatus('');
                                                    setFilterDateFrom('');
                                                    setFilterDateTo('');
                                                    setFilterMinAmount('');
                                                    setFilterMaxAmount('');
                                                    setSearchQuery('');
                                                }}
                                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg
                                                           border border-lifewood-platinum bg-white text-sm font-medium
                                                           text-lifewood-charcoal hover:bg-lifewood-paper hover:text-lifewood-darkSerpent
                                                           transition-all self-end"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Reset All
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* ── Row 4: Results count + Tabs ── */}
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="inline-flex rounded-xl bg-lifewood-paper p-1 border border-lifewood-platinum/60 w-full sm:w-auto">
                                        {[
                                            { key: 'requests',    label: 'All Types',       count: hasReceiptData ? filteredReceiptRows.length : filteredRequests.length },
                                            { key: 'applications',label: 'Travel & Meals',  count: hasReceiptData ? filteredReceiptRows.filter(r => ['Meals','Travel','Fuel','Accommodation'].includes(r.expenseType)).length : filteredApplications.length },
                                            { key: 'accepted',    label: 'Office & Other',  count: hasReceiptData ? filteredReceiptRows.filter(r => ['Office Supplies','Utilities','Other'].includes(r.expenseType)).length : filteredAccepted.length },
                                        ].map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                                                    activeTab === tab.key
                                                        ? 'bg-lifewood-castletonGreen text-white shadow-sm'
                                                        : 'text-lifewood-charcoal hover:text-lifewood-darkSerpent'
                                                }`}
                                            >
                                                {tab.label}
                                                <span className={`text-[10px] px-1.5 py-px rounded-full font-bold ${
                                                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-lifewood-platinum text-lifewood-charcoal'
                                                }`}>{tab.count}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <p className="text-xs text-lifewood-charcoal/60 font-medium">
                                        {sortedLedgerRows.length} {sortedLedgerRows.length === 1 ? 'receipt' : 'receipts'} found
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="bg-lifewood-darkSerpent text-left text-[11px] font-bold uppercase tracking-widest text-white/60">
                                            <th className="px-4 py-3 w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={allSelected}
                                                    onChange={toggleSelectAll}
                                                    className="rounded border-lifewood-fernGreen text-lifewood-saffaron
                                                               focus:ring-lifewood-saffaron/40 cursor-pointer"
                                                />
                                            </th>
                                            {[
                                                { key: 'date',      label: 'Date',         defaultDir: 'desc' },
                                                { key: 'receiptNo', label: 'Receipt No',   defaultDir: 'asc'  },
                                                { key: 'name',      label: 'Employee',     defaultDir: 'asc'  },
                                                { key: 'category',  label: 'Expense Type', defaultDir: 'asc'  },
                                                { key: 'amount',    label: 'Amount',       defaultDir: 'desc' },
                                                { key: 'status',    label: 'Status',       defaultDir: 'asc'  },
                                            ].map(col => (
                                                <th key={col.key} className="px-4 py-3">
                                                    <button
                                                        onClick={() => {
                                                            if (sortBy === col.key) setSortDir(s => s === 'asc' ? 'desc' : 'asc');
                                                            else { setSortBy(col.key); setSortDir(col.defaultDir); }
                                                        }}
                                                        className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
                                                    >
                                                        {col.label}
                                                        {sortBy === col.key ? (
                                                            <span className="text-lifewood-saffaron text-[10px]">{sortDir === 'asc' ? '▲' : '▼'}</span>
                                                        ) : (
                                                            <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                                                        )}
                                                    </button>
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {tableLoading && !hasReceiptData && (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-14 text-center">
                                                    <div className="flex flex-col items-center gap-3 text-lifewood-asphalt">
                                                        <div className="w-6 h-6 border-2 border-lifewood-castletonGreen border-t-transparent rounded-full animate-spin" />
                                                        <span className="text-sm">Loading receipts…</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {!tableLoading && sortedLedgerRows.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-14 text-center text-lifewood-asphalt text-sm">
                                                    {searchQuery ? 'No matching receipts found.' : 'No receipts found. Upload your first receipt to get started.'}
                                                </td>
                                            </tr>
                                        )}

                                        {!tableLoading && sortedLedgerRows.length > 0 && (() => {
                                            let lastMonthLabel = '';

                                            return sortedLedgerRows.map((row) => {
                                                const monthLabel = new Date(row.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric',
                                                }).toUpperCase();
                                                const showMonthLabel = monthLabel !== lastMonthLabel;
                                                lastMonthLabel = monthLabel;
                                                const isSelected = selectedRows.includes(row.rowId);

                                                return (
                                                    <React.Fragment key={row.rowId}>
                                                        {showMonthLabel && (
                                                            <tr className="bg-lifewood-paper/50">
                                                                <td colSpan={8} className="px-4 py-2 text-[10px] font-bold tracking-widest text-lifewood-fernGreen uppercase">
                                                                    {monthLabel}
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr className={`border-b border-lifewood-platinum/40 transition-colors ${
                                                            isSelected
                                                                ? 'bg-lifewood-saffaron/8'
                                                                : 'hover:bg-lifewood-paper/60'
                                                        }`}>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleRowSelection(row.rowId)}
                                                                    className="rounded border-lifewood-platinum text-lifewood-saffaron
                                                                               focus:ring-lifewood-saffaron/40 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-lifewood-charcoal text-sm">{formatDate(row.date)}</td>
                                                            <td className="px-4 py-3">
                                                                <button
                                                                    onClick={() => setViewingImage(row)}
                                                                    className="group inline-flex items-center gap-1.5 font-semibold text-lifewood-castletonGreen
                                                                               hover:text-lifewood-darkSerpent text-sm transition-colors
                                                                               focus:outline-none focus:underline"
                                                                    title={row.imageData ? 'Click to view receipt image' : 'No image attached'}
                                                                >
                                                                    {row.imageData
                                                                        ? <ImageIcon className="w-3.5 h-3.5 text-lifewood-saffaron shrink-0 group-hover:scale-110 transition-transform" />
                                                                        : <ImageOff className="w-3.5 h-3.5 text-lifewood-silver shrink-0" />
                                                                    }
                                                                    <span className="underline underline-offset-2 decoration-dotted group-hover:decoration-solid">
                                                                        {row.idLabel}
                                                                    </span>
                                                                </button>
                                                            </td>
                                                            <td className="px-4 py-3 text-lifewood-charcoal text-sm">{row.name}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold
                                                                                 bg-lifewood-castletonGreen/10 text-lifewood-castletonGreen
                                                                                 border border-lifewood-castletonGreen/15">
                                                                    {row.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-lifewood-darkSerpent text-sm">{row.amountLabel}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex items-center gap-1.5 text-sm">
                                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusDotClass(row.status)}`} />
                                                                    <span className="text-lifewood-charcoal">{row.status}</span>
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex justify-end items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleDownloadRow(row)}
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                                                                   text-lifewood-charcoal hover:text-lifewood-castletonGreen
                                                                                   hover:bg-lifewood-castletonGreen/10 border border-transparent
                                                                                   hover:border-lifewood-castletonGreen/20 transition-all"
                                                                        title="Download"
                                                                    >
                                                                        <Download className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEditRow(row)}
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                                                                   text-lifewood-charcoal hover:text-lifewood-goldenBrown
                                                                                   hover:bg-lifewood-saffaron/15 border border-transparent
                                                                                   hover:border-lifewood-saffaron/25 transition-all"
                                                                        title="Edit"
                                                                    >
                                                                        <Pencil className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteRow(row)}
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                                                                   text-lifewood-charcoal hover:text-red-500
                                                                                   hover:bg-red-50 border border-transparent
                                                                                   hover:border-red-200 transition-all"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </main>
                </div>

                {/* ── Upload Modal ─────────────────────────────────────────────── */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-lifewood-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin
                                        border border-lifewood-platinum/50">
                            {/* Modal header */}
                            <div className="sticky top-0 bg-lifewood-darkSerpent px-6 py-5 rounded-t-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-lifewood-saffaron/20 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-lifewood-saffaron" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white leading-tight">Upload Receipt</h2>
                                        <p className="text-xs text-white/45">AI-powered expense extraction</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
                                >
                                    <span className="w-5 h-5 flex justify-center items-center font-bold text-lg leading-none">×</span>
                                </button>
                            </div>
                            {/* Gold accent strip */}
                            <div className="h-[2px] bg-gradient-to-r from-lifewood-goldenBrown via-lifewood-saffaron to-transparent" />
                            <div className="p-6">
                                <MultiImageUploader onContinue={handleContinueUpload} />
                            </div>
                        </div>
                    </div>
                )}

                <ImagePreviewPanel
                    isOpen={previewModal.isOpen}
                    images={uploadedImages}
                    onClose={previewModal.close}
                    onProcess={handleProcess}
                    onEditImage={handleEditImage}
                    loading={uploadLoading}
                />

                <ImageEditorWrapper
                    image={editingImage}
                    isOpen={editorModal.isOpen}
                    onClose={editorModal.close}
                    onSave={handleSaveEdit}
                />

                <ExtractedPanel
                    data={ocrResults}
                    accountId={userName}
                    isOpen={resultsModal.isOpen}
                    onClose={handleCloseResults}
                />

                <ProfilePanel
                    userId={userName}
                    userRole={user?.role}
                    isOpen={profileModal.isOpen}
                    onClose={profileModal.close}
                    onSaveSuccess={checkExists}
                />

                <Modal
                    isOpen={Boolean(editingReceipt)}
                    onClose={() => setEditingReceipt(null)}
                    title="Edit Receipt"
                    size="md"
                >
                    <ModalContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Date"
                                type="date"
                                value={editForm.date}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                            />
                            <Input
                                label="Receipt No"
                                type="text"
                                value={editForm.receiptNo}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, receiptNo: e.target.value }))}
                            />
                            <Input
                                label="Employee"
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <Input
                                label="Expense Type"
                                type="text"
                                value={editForm.expenseType}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, expenseType: e.target.value }))}
                            />
                            <Input
                                label="Amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.amount}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                            />
                            <Input
                                label="Status"
                                type="text"
                                value={editForm.status}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Source Text
                            </label>
                            <textarea
                                value={editForm.sourceText}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, sourceText: e.target.value }))}
                                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-lifewood-castletonGreen/20 focus:border-lifewood-castletonGreen transition-all bg-lifewood-seaSalt/50 border-lifewood-castletonGreen/10 text-lifewood-darkSerpent min-h-[110px]"
                            />
                        </div>
                    </ModalContent>

                    <ModalFooter>
                        <Button variant="outline" onClick={() => setEditingReceipt(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEditedReceipt}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </Modal>

                <ConfirmDialog
                    isOpen={Boolean(deleteTarget)}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Receipt"
                    message={`Are you sure you want to delete ${deleteTarget?.receiptNo || deleteTarget?.idLabel || 'this receipt'}?`}
                    confirmText="Yes, Delete"
                    type="danger"
                />

                {showProcessingModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-lifewood-darkSerpent rounded-2xl shadow-lifewood-lg px-10 py-12
                                        flex flex-col items-center gap-5 border border-white/10 min-w-[220px]">
                            {/* Gold spinning ring */}
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                                <div className="absolute inset-0 rounded-full border-4 border-t-lifewood-saffaron border-l-lifewood-goldenBrown border-r-transparent border-b-transparent animate-spin" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-white">Processing…</h3>
                                <p className="text-white/45 text-xs mt-1">AI is extracting receipt data</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Receipt Image Lightbox ── */}
                {viewingImage && (
                    <ReceiptImageModal
                        row={viewingImage}
                        onClose={() => setViewingImage(null)}
                    />
                )}
            </div>
        </BackgroundLayout>
    );
}
