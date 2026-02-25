import React from 'react';

export function Loader({ size = 'md', text, fullScreen = false }) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`${sizes[size]} border-lifewood-castletonGreen border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
}

export function LoadingOverlay({ isLoading, text }) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
      <Loader text={text} />
    </div>
  );
}