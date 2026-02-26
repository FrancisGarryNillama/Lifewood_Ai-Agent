import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles } from 'lucide-react';
import DemoUploader from './DemoUploader';

function DemoModal({ isOpen, onClose, onProcess }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsExpanded(true), 10);
            document.body.style.overflow = 'hidden';
        } else {
            setIsExpanded(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isVisible) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
        ${isExpanded ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'}
      `}
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin bg-white rounded-3xl shadow-2xl transition-all duration-300 transform
          ${isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200"
                    aria-label="Close demo"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-lifewood-castletonGreen via-lifewood-saffaron to-lifewood-earthYellow px-6 py-8 sm:px-8 sm:py-10">
                    {/* Animated background orbs */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="relative text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm font-medium">Internal System Access</span>
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                            Experience Lifewood
                        </h2>
                        <p className="text-lifewood-paper text-lg">
                            Upload Receipt Images images and see our AI in action
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    <DemoUploader onProcess={onProcess} />
                </div>
            </div>
        </div>,
        document.body
    );
}

export default DemoModal;


