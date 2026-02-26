import React, { useState, useEffect } from 'react';
import { Loader } from '../';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function DataTable({
  columns,
  data,
  loading,
  emptyMessage = 'No data available',
  onRowClick,
  itemsPerPage = 5, // Default 5 items per page
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (loading) {
    return (
      <div className="py-12">
        <Loader />
      </div>
    );
  }

  // Ensure data is always an array (Rebuild Trigger)
  const safeData = Array.isArray(data) ? data : [];

  // Calculate pagination
  const totalPages = Math.ceil(safeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = safeData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="text-left py-4 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-lifewood-seaSalt transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-4 px-6 text-base text-gray-800">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-gray-500 text-base"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Large, Clear for Older Users - Always Shown */}
      {safeData.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          {/* Info */}
          <div className="text-sm sm:text-base text-gray-700 font-medium">
            Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-gray-900">{Math.min(endIndex, safeData.length)}</span> of{' '}
            <span className="font-bold text-gray-900">{safeData.length}</span> entries
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 hover:border-lifewood-saffaron hover:bg-lifewood-seaSalt disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === currentPage;

                // Show first, last, current, and adjacent pages
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`min-w-[44px] sm:min-w-[52px] h-11 sm:h-13 px-3 sm:px-4 rounded-lg font-bold text-base sm:text-lg transition-all ${isActive
                        ? 'bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent text-white shadow-lg'
                        : 'border-2 border-gray-300 text-gray-700 hover:border-lifewood-saffaron hover:bg-lifewood-seaSalt'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                }

                // Show ellipsis
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span key={pageNum} className="px-2 text-gray-500 font-bold">
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 hover:border-lifewood-saffaron hover:bg-lifewood-seaSalt disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

