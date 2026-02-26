import React from 'react';

export function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-lifewood-paper text-lifewood-darkSerpent border-lifewood-castletonGreen/20';
      case 'denied':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'finalized':
        return 'bg-lifewood-earthYellow/20 text-lifewood-darkSerpent border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
}

