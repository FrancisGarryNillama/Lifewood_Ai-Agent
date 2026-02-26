import React, { useState, useEffect } from 'react';
import { useTracking } from '../hooks/useTracking';
import { Button, Loader } from '../../../components/common';
import TrackerModal from './TrackerModal';
import { CheckCircle, Circle, Clock, ChevronRight } from 'lucide-react';

export default function ProgressTracker({ userName }) {
  const { progress, loading } = useTracking(userName);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    { label: 'Request', icon: Circle },
    { label: 'Pending', icon: Clock },
    { label: 'Finalized', icon: CheckCircle },
  ];

  useEffect(() => {
    if (progress > 0) {
      setIsVisible(true);
    }
  }, [progress]);

  if (progress === 0) return null;

  const currentStep = steps[progress - 1];
  const CurrentIcon = currentStep?.icon || Circle;

  return (
    <>
      <div
        className={`relative mt-6 sm:mt-8 transition-all duration-1000
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-lifewood-castletonGreen/10 to-lifewood-saffaron/10 rounded-2xl blur-2xl"></div>

        {!isExpanded ? (
          /* Compact Card */
          <button
            onClick={() => setIsExpanded(true)}
            className="relative w-full bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left: Icon and Info */}
              <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className={`p-3 rounded-full ${progress === 3
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : progress === 2
                    ? 'bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-earthYellow animate-pulse'
                    : 'bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent'
                  }`}>
                  <CurrentIcon className="w-6 h-6 text-white" />
                </div>

                {/* Text Info */}
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      expense processing Status
                    </h3>
                    {/* Submission Badge */}
                    <div className="px-2 py-0.5 bg-gradient-to-r from-lifewood-paper to-lifewood-seaSalt border border-lifewood-saffaron rounded-full">
                      <span className="text-xs font-semibold text-lifewood-darkSerpent">
                        #{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Current Status:</span>
                    <span className={`font-bold ${progress === 3 ? 'text-lifewood-castletonGreen' :
                      progress === 2 ? 'text-lifewood-darkSerpent' :
                        'text-lifewood-castletonGreen'
                      }`}>
                      {currentStep?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Progress Indicator and Arrow */}
              <div className="flex items-center gap-3">
                {/* Mini Progress */}
                <div className="hidden sm:flex items-center gap-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${index < progress
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-3'
                        : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>

                {/* Arrow */}
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-lifewood-darkSerpent group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        ) : (
          /* Expanded Card */
          <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-lifewood-darkSerpent to-lifewood-earthYellow bg-clip-text text-transparent">
                  Tracking Progress
                </h2>
                {/* Submission Badge */}
                <div className="px-3 py-1 bg-gradient-to-r from-lifewood-paper to-lifewood-seaSalt border border-lifewood-saffaron rounded-full">
                  <span className="text-xs font-semibold text-lifewood-darkSerpent">
                    Submission #{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5">Monitor your expense processing status</p>

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader size="sm" />
              </div>
            ) : (
              <>
                {/* Modern Step Indicators - Compact */}
                <div className="relative mb-5 sm:mb-6">
                  {/* Progress Line Background */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 rounded-full mx-6"></div>

                  {/* Active Progress Line */}
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-6 transition-all duration-1000"
                    style={{
                      width: `calc(${((progress - 1) / (steps.length - 1)) * 100}% - 48px)`,
                    }}
                  ></div>

                  {/* Steps */}
                  <div className="relative flex items-center justify-between px-3">
                    {steps.map((step, index) => {
                      const isCompleted = index < progress;
                      const isCurrent = index === progress - 1;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1 relative"
                          style={{
                            transitionDelay: `${index * 150}ms`,
                          }}
                        >
                          {/* Circle Indicator - Smaller */}
                          <div
                            className={`
                              relative z-10 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full 
                              transition-all duration-500 transform
                              ${isCompleted
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-md shadow-green-500/40 scale-105'
                                : isCurrent
                                  ? 'bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-earthYellow shadow-md shadow-lifewood-castletonGreen/40 scale-100 animate-pulse'
                                  : 'bg-gray-200 shadow-sm'
                              }
                            `}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                            ) : isCurrent ? (
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
                            ) : (
                              <Circle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400" />
                            )}
                          </div>

                          {/* Label - Smaller */}
                          <span
                            className={`
                              mt-2 text-xs sm:text-sm font-medium text-center transition-all duration-500
                              ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}
                            `}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* View Details Button - Compact */}
                <div className="flex justify-center mt-4 sm:mt-5">
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(true)}
                    className="text-xs sm:text-sm px-4 sm:px-6 py-2"
                  >
                    View Details
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tracker Modal */}
      <TrackerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userName={userName}
      />
    </>
  );
}

