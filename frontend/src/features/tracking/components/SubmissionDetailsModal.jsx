import React, { useEffect, useState } from 'react';
import { X, AlertCircle, Sparkles } from 'lucide-react';
import { expenseApi } from '../../../api';
import { Loader } from '../../../components/common';

export default function SubmissionDetailsModal({ isOpen, onClose, accountId }) {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && accountId) {
            fetchDetails();
        }
    }, [isOpen, accountId]);

    const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching details for accountId:', accountId);
            const response = await expenseApi.getCompareResultTor(accountId);
            console.log('Raw API response:', response);

            // Handle different response formats
            let extractedData = [];

            if (Array.isArray(response)) {
                extractedData = response;
            } else if (response?.data) {
                // APIResponse.success wraps data in a 'data' property
                extractedData = Array.isArray(response.data) ? response.data : [];
            }

            console.log('Extracted data:', extractedData);
            setDetails(extractedData);
        } catch (err) {
            console.error('Failed to fetch details:', err);
            // Don't show error if it's just 404 (no details yet)
            if (!err.message?.includes('404') && err.response?.status !== 404) {
                setError('Failed to load submission details');
            }
            setDetails([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-lifewood-darkSerpent to-lifewood-earthYellow flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                        <h2 className="text-xl font-bold text-white">Employee Expense Records</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Matching Admin Request Page */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader text="Loading details..." />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl border border-red-100">
                            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p>{error}</p>
                        </div>
                    ) : details.length === 0 ? (
                        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                            <p className="text-lg font-medium">No subject details available</p>
                            <p className="text-sm">Details will appear here once your transcript is processed.</p>
                        </div>
                    ) : (
                        <div className="bg-white shadow border rounded-lg">
                            <div className="overflow-y-auto max-h-[500px]">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-100 border-b sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 font-medium text-gray-700">Subject Code</th>
                                            <th className="px-4 py-3 font-medium text-gray-700">Description</th>
                                            <th className="px-4 py-3 font-medium text-gray-700">Units</th>
                                            <th className="px-4 py-3 font-medium text-gray-700">Final Grade</th>
                                            <th className="px-4 py-3 font-medium text-gray-700">Evaluation</th>
                                            <th className="px-4 py-3 font-medium text-gray-700">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.map((entry, index) => {
                                            // Color coding for evaluation status - matching admin page
                                            let statusColor = 'bg-gray-100 text-gray-700';
                                            if (entry.credit_evaluation === 'Accepted') {
                                                statusColor = 'bg-lifewood-earthYellow/20 text-lifewood-darkSerpent border border-green-200';
                                            } else if (entry.credit_evaluation === 'Denied') {
                                                statusColor = 'bg-red-100 text-red-700 border border-red-200';
                                            } else if (entry.credit_evaluation === 'Void') {
                                                statusColor = 'bg-orange-100 text-orange-700 border border-orange-200';
                                            } else if (entry.credit_evaluation === 'Investigate') {
                                                statusColor = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
                                            }

                                            return (
                                                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                        {entry.subject_code}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700">
                                                        {entry.subject_description}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700">
                                                        {entry.total_academic_units}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700">
                                                        {entry.final_grade}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                                            {entry.credit_evaluation || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700">
                                                        {entry.remarks || '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


