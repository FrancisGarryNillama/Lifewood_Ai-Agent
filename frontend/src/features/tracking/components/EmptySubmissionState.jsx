import React from 'react';
import { FileText, Upload, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/common';

export default function EmptySubmissionState({ onStartSubmission }) {
    return (
        <div className="relative mt-6 sm:mt-8">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-lifewood-castletonGreen/10 to-lifewood-darkSerpent/10 rounded-2xl blur-2xl"></div>

            {/* Main card */}
            <div className="relative bg-white/90 backdrop-blur-sm p-8 sm:p-10 md:p-12 rounded-2xl shadow-xl border border-gray-200/50">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Animated rings */}
                        <div className="absolute inset-0 bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent rounded-full blur-xl opacity-30 animate-pulse"></div>

                        {/* Icon container */}
                        <div className="relative bg-gradient-to-br from-lifewood-paper to-lifewood-seaSalt p-6 rounded-full border-2 border-lifewood-castletonGreen/20">
                            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-lifewood-castletonGreen" />
                        </div>
                    </div>
                </div>

                {/* Text content */}
                <div className="text-center max-w-md mx-auto">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        No Submissions Yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                        You haven't submitted any TOR (Expense Receipts) for expense processing yet.
                        Start your expense processing journey by uploading your transcript.
                    </p>

                    {/* Action button */}
                    {onStartSubmission && (
                        <Button
                            onClick={onStartSubmission}
                            className="bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent hover:from-lifewood-darkSerpent hover:to-lifewood-darkSerpent text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Start Submission</span>
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-lifewood-saffaron/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-lifewood-castletonGreen/10 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
}


