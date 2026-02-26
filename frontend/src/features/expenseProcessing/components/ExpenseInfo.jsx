import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

export default function ExpenseInfo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`max-w-2xl mx-auto transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Minimal Premium Card */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-md border border-gray-200/50">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-md">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Upload your <span className="text-gray-900 font-bold">Transcript of Records</span> to begin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
