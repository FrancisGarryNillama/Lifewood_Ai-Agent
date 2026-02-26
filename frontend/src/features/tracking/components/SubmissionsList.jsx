import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Clock, ChevronRight } from 'lucide-react';
import { useAllSubmissions } from '../hooks/useAllSubmissions';
import { Loader } from '../../../components/common';
import EmptySubmissionState from './EmptySubmissionState';

export default function SubmissionsList({ userName }) {
    const navigate = useNavigate();
    const { submissions, loading } = useAllSubmissions(userName);
    const [expandedId, setExpandedId] = useState(null);

    if (loading) {
        return (
            <div className="mt-6 sm:mt-8 flex justify-center py-8">
                <Loader size="sm" />
            </div>
        );
    }

    if (submissions.length === 0) {
        return <EmptySubmissionState />;
    }

    const getStatusIcon = (progress) => {
        switch (progress) {
            case 3:
                return CheckCircle;
            case 2:
                return Clock;
            default:
                return Circle;
        }
    };

    const getStatusColor = (progress) => {
        switch (progress) {
            case 3:
                return {
                    bg: 'from-green-500 to-emerald-600',
                    text: 'text-lifewood-castletonGreen',
                    badge: 'from-green-100 to-emerald-100 border-green-300 text-lifewood-darkSerpent',
                };
            case 2:
                return {
                    bg: 'from-lifewood-castletonGreen to-lifewood-earthYellow',
                    text: 'text-lifewood-darkSerpent',
                    badge: 'from-lifewood-seaSalt to-lifewood-paper border-lifewood-castletonGreen/50 text-lifewood-darkSerpent',
                };
            default:
                return {
                    bg: 'from-lifewood-castletonGreen to-lifewood-darkSerpent',
                    text: 'text-lifewood-castletonGreen',
                    badge: 'from-lifewood-paper to-lifewood-seaSalt border-lifewood-saffaron text-lifewood-darkSerpent',
                };
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const steps = ['Request', 'Pending', 'Finalized'];

    return (
        <div className="mt-6 sm:mt-8 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-lifewood-darkSerpent to-lifewood-earthYellow bg-clip-text text-transparent">
                    Your Expense Submissions
                </h2>
                <span className="text-sm text-gray-500">
                    Most recent
                </span>
            </div>

            {submissions.map((submission) => {
                const StatusIcon = getStatusIcon(submission.progress);
                const colors = getStatusColor(submission.progress);
                const isExpanded = expandedId === submission.id;

                return (
                    <div
                        key={submission.id}
                        className="relative transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-lifewood-castletonGreen/10 to-lifewood-saffaron/10 rounded-xl blur-xl"></div>

                        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                                className="w-full p-4 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 sm:p-3.5 rounded-full bg-gradient-to-br ${colors.bg} ${submission.progress === 2 ? 'animate-pulse' : ''}`}>
                                            <StatusIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        </div>

                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-base sm:text-lg font-bold text-gray-900">
                                                    Submission
                                                </span>
                                                <div className={`px-2 py-0.5 bg-gradient-to-r ${colors.badge} border rounded-full`}>
                                                    <span className="text-xs font-semibold">
                                                        {formatDate(submission.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                                                <span>Status:</span>
                                                <span className={`font-bold ${colors.text}`}>
                                                    {submission.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="hidden sm:flex items-center gap-1">
                                            {steps.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-all ${index < submission.progress
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-3'
                                                        : 'bg-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <ChevronRight
                                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''
                                                }`}
                                        />
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="px-4 pb-4 border-t border-gray-200">
                                    <div className="pt-4">
                                        <div className="relative mb-4">
                                            <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 rounded-full mx-4"></div>
                                            <div
                                                className="absolute top-3 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-4 transition-all duration-500"
                                                style={{
                                                    width: `calc(${((submission.progress - 1) / 2) * 100}% - 32px)`,
                                                }}
                                            ></div>

                                            <div className="relative flex items-center justify-between px-2">
                                                {steps.map((step, index) => {
                                                    const isCompleted = index < submission.progress;
                                                    const isCurrent = index === submission.progress - 1;

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col items-center flex-1"
                                                        >
                                                            <div
                                                                className={`
                                  relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all
                                  ${isCompleted
                                                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-md'
                                                                        : isCurrent
                                                                            ? 'bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-earthYellow shadow-md animate-pulse'
                                                                            : 'bg-gray-200'
                                                                    }
                                `}
                                                            >
                                                                {isCompleted && (
                                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                                )}
                                                                {isCurrent && (
                                                                    <Clock className="w-3 h-3 text-white" />
                                                                )}
                                                            </div>

                                                            <span className={`mt-1 text-xs font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                                            <div>
                                                <span className="font-medium">Submitted:</span>
                                                <p className="text-gray-900">{formatDate(submission.createdAt)}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Last Updated:</span>
                                                <p className="text-gray-900">{formatDate(submission.updatedAt)}</p>
                                            </div>
                                        </div>

                                        {/* Show View Uploaded Receipt (Request Stage Only) */}
                                        {submission.status === 'Request' && submission.torUrl && (
                                            <div className="mt-4 flex justify-end">
                                                <a
                                                    href={`http://localhost:8000${submission.torUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-4 py-2 bg-lifewood-darkSerpent text-white text-sm font-medium rounded-lg hover:bg-lifewood-darkSerpent transition-colors flex items-center gap-2"
                                                >
                                                    <span className="w-4 h-4">📄</span>
                                                    View Uploaded Receipt
                                                </a>
                                            </div>
                                        )}

                                    </div>

                                    {/* Show View TOR Logic only if Finalized */}
                                    {(submission.status === 'Finalized' || submission.progress === 3) && (
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent collapsing the card
                                                    navigate(`/employee/finalDocument/${userName}`);
                                                }}
                                                className="px-4 py-2 bg-lifewood-castletonGreen text-white text-sm font-medium rounded hover:bg-lifewood-darkSerpent transition-colors"
                                            >
                                                View Final Expense Report
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div >
    );
}



