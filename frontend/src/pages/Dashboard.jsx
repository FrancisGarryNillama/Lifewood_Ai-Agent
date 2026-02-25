import React, { useState, useEffect } from 'react';
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
import { Upload, Sparkles, Search, Download, Pencil, Trash2 } from 'lucide-react';
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

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Upload state
    const [uploadedImages, setUploadedImages] = useState([]);
    const [editingImage, setEditingImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showProcessingModal, setShowProcessingModal] = useState(false);

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
                const parsedReceipts = parseExpenseReceiptsFromOcr(result, userName);
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
        if (!debouncedSearch.trim()) return true;
        const query = debouncedSearch.toLowerCase();
        return (
            item.receiptNo?.toLowerCase().includes(query) ||
            item.expenseType?.toLowerCase().includes(query) ||
            item.name?.toLowerCase().includes(query) ||
            item.amountLabel?.toLowerCase().includes(query) ||
            item.date?.toLowerCase().includes(query)
        );
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

    const sortedLedgerRows = [...ledgerRows].sort((a, b) => new Date(b.date) - new Date(a.date));
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
        const blob = new Blob([JSON.stringify(row, null, 2)], { type: 'application/json' });
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
            <div className="min-h-screen relative overflow-hidden bg-gray-50/50">
                <div className="relative z-10">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userName={userName} />
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        onOpenProfile={profileModal.open}
                    />

                    <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">

                        {/* Application Management Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Good Day {staticGreetingName}!
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600">
                                AI Agent OCR for expense receipts
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-white via-lifewood-paper/30 to-lifewood-seaSalt/40">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-lifewood-darkSerpent">
                                            Expense OCR Workspace
                                        </h3>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lifewood-earthYellow/30 text-lifewood-darkSerpent">
                                            {selectedInView.length} selected
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                        <button
                                            onClick={handleOpenUpload}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-lifewood-castletonGreen via-lifewood-saffaron to-lifewood-earthYellow text-white font-bold shadow-lg hover:shadow-lifewood-castletonGreen/30 transition-all"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Upload Receipt
                                            <Upload className="w-4 h-4" />
                                        </button>

                                        <div className="relative">
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search receipts..."
                                                className="w-full sm:w-64 pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-lifewood-castletonGreen/30"
                                            />
                                        </div>

                                        <button
                                            onClick={handleExportSelected}
                                            disabled={selectedInView.length === 0}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-lifewood-castletonGreen text-white font-semibold hover:bg-lifewood-darkSerpent transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            <Download className="w-4 h-4" />
                                            Export Selected
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 inline-flex rounded-lg bg-lifewood-paper/60 p-1 border border-lifewood-castletonGreen/15">
                                    <button
                                        onClick={() => setActiveTab('requests')}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'requests'
                                            ? 'bg-white text-lifewood-darkSerpent shadow-sm'
                                            : 'text-gray-600 hover:text-lifewood-darkSerpent'
                                            }`}
                                    >
                                        All Types ({hasReceiptData ? filteredReceiptRows.length : filteredRequests.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('applications')}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'applications'
                                            ? 'bg-white text-lifewood-darkSerpent shadow-sm'
                                            : 'text-gray-600 hover:text-lifewood-darkSerpent'
                                            }`}
                                    >
                                        Travel & Meals ({hasReceiptData
                                            ? filteredReceiptRows.filter((row) => ['Meals', 'Travel', 'Fuel', 'Accommodation'].includes(row.expenseType)).length
                                            : filteredApplications.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('accepted')}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'accepted'
                                            ? 'bg-white text-lifewood-darkSerpent shadow-sm'
                                            : 'text-gray-600 hover:text-lifewood-darkSerpent'
                                            }`}
                                    >
                                        Office & Other ({hasReceiptData
                                            ? filteredReceiptRows.filter((row) => ['Office Supplies', 'Utilities', 'Other'].includes(row.expenseType)).length
                                            : filteredAccepted.length})
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 border-y border-gray-100">
                                        <tr className="text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                            <th className="px-4 py-3 w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={allSelected}
                                                    onChange={toggleSelectAll}
                                                    className="rounded border-gray-300 text-lifewood-castletonGreen focus:ring-lifewood-castletonGreen"
                                                />
                                            </th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Receipt No</th>
                                            <th className="px-4 py-3">Employee</th>
                                            <th className="px-4 py-3">Expense Type</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {tableLoading && !hasReceiptData && (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                                                    Loading receipts...
                                                </td>
                                            </tr>
                                        )}

                                        {!tableLoading && sortedLedgerRows.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                                                    {searchQuery ? 'No matching receipts found.' : 'No receipts found.'}
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

                                                return (
                                                    <React.Fragment key={row.rowId}>
                                                        {showMonthLabel && (
                                                            <tr className="bg-lifewood-paper/60">
                                                                <td colSpan={8} className="px-4 py-2 text-xs font-bold tracking-wide text-lifewood-darkSerpent">
                                                                    {monthLabel}
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr className="border-b border-gray-100 hover:bg-lifewood-seaSalt/30 transition-colors">
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRows.includes(row.rowId)}
                                                                    onChange={() => toggleRowSelection(row.rowId)}
                                                                    className="rounded border-gray-300 text-lifewood-castletonGreen focus:ring-lifewood-castletonGreen"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-700">{formatDate(row.date)}</td>
                                                            <td className="px-4 py-3 font-semibold text-gray-800">{row.idLabel}</td>
                                                            <td className="px-4 py-3 text-gray-700">{row.name}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex px-2 py-1 rounded-md text-xs font-semibold bg-lifewood-seaSalt text-lifewood-darkSerpent">
                                                                    {row.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 font-semibold text-lifewood-darkSerpent">{row.amountLabel}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex items-center gap-2 text-gray-700">
                                                                    <span className={`w-2 h-2 rounded-full ${getStatusDotClass(row.status)}`} />
                                                                    {row.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex justify-end items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleDownloadRow(row)}
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-lifewood-seaSalt transition-colors"
                                                                        title="Download"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEditRow(row)}
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-lifewood-seaSalt transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteRow(row)}
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
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

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
                            <div className="sticky top-0 bg-gradient-to-r from-lifewood-castletonGreen via-lifewood-saffaron to-lifewood-earthYellow p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-8 h-8 text-white" />
                                        <h2 className="text-2xl font-bold text-white">
                                            Upload Receipt
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                    >
                                        <span className="w-6 h-6 flex justify-center items-center font-bold text-xl">x</span>
                                    </button>
                                </div>
                            </div>
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        {/* Processing Spinner UI */}
                        <div className="bg-white p-8 rounded-2xl shadow-2xl items-center flex flex-col justify-center">
                            <div className="w-16 h-16 border-4 border-lifewood-castletonGreen border-t-transparent rounded-full animate-spin"></div>
                            <h3 className="mt-4 text-xl font-bold">Processing...</h3>
                        </div>
                    </div>
                )}
            </div>
        </BackgroundLayout>
    );
}
