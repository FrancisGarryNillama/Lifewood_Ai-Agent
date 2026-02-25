import React from 'react';
import { Search, X } from 'lucide-react';

export function AdvancedSearchBar({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange,
  filterOptions,
  onClear 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, ID, or status..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lifewood-saffaron focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={onClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {filterOptions && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Filter by:</span>
            <select
              value={filters?.field || 'all'}
              onChange={(e) => onFilterChange?.({ ...filters, field: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lifewood-saffaron text-sm"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {searchQuery && (
        <div className="mt-3 text-sm text-gray-600">
          Showing results for: <span className="font-semibold">"{searchQuery}"</span>
        </div>
      )}
    </div>
  );
}