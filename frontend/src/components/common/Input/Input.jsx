import React from 'react';

export function Input({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-lifewood-castletonGreen/20 focus:border-lifewood-castletonGreen transition-all bg-lifewood-seaSalt/50 hover:bg-lifewood-white text-lifewood-darkSerpent ${Icon ? 'pl-12' : ''
            } ${error ? 'border-red-500 bg-red-50' : 'border-lifewood-castletonGreen/10'} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

