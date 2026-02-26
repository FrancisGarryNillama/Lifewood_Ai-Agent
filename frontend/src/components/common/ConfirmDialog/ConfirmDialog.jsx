import React from 'react';
import { Modal, ModalContent, ModalFooter } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary',
  loading = false,
}) {
  // Icon and color based on type
  const getIconAndColors = () => {
    switch (type) {
      case 'danger':
        return {
          Icon: AlertCircle,
          bgGradient: 'from-red-50 to-rose-50',
          iconBg: 'from-red-600 to-rose-600',
          borderColor: 'border-red-200',
        };
      case 'warning':
        return {
          Icon: AlertTriangle,
          bgGradient: 'from-yellow-50 to-amber-50',
          iconBg: 'from-yellow-600 to-amber-600',
          borderColor: 'border-yellow-200',
        };
      case 'success':
        return {
          Icon: CheckCircle2,
          bgGradient: 'from-green-50 to-emerald-50',
          iconBg: 'from-green-600 to-emerald-600',
          borderColor: 'border-green-200',
        };
      default:
        return {
          Icon: Info,
          bgGradient: 'from-lifewood-paper to-lifewood-seaSalt',
          iconBg: 'from-lifewood-castletonGreen to-lifewood-darkSerpent',
          borderColor: 'border-lifewood-castletonGreen/20',
        };
    }
  };

  const { Icon, bgGradient, iconBg, borderColor } = getIconAndColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
      <ModalContent>
        {/* Enhanced content with icon */}
        <div className={`p-6 bg-gradient-to-br ${bgGradient} rounded-xl border ${borderColor}`}>
          <div className="flex items-start gap-4">
            {/* Animated icon */}
            <div className="flex-shrink-0">
              <div className={`p-3 bg-gradient-to-br ${iconBg} rounded-full shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Message */}
            <div className="flex-1 pt-1">
              <p className="text-gray-800 text-base leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        {cancelText && (
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="px-6"
          >
            {cancelText}
          </Button>
        )}
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`group relative px-8 py-3 bg-gradient-to-r ${type === 'danger'
              ? 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
              : type === 'warning'
                ? 'from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700'
                : type === 'success'
                  ? 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'from-lifewood-castletonGreen to-lifewood-darkSerpent hover:from-lifewood-darkSerpent hover:to-lifewood-darkSerpent'
            } text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          <span>{loading ? 'Processing...' : confirmText}</span>
        </button>
      </ModalFooter>
    </Modal>
  );
}

