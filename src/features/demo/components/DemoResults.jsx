import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Modal, ModalContent, Button, Loader } from '../../../components/common';

export default function DemoResults({ 
  isOpen, 
  onClose, 
  results, 
  loading, 
  error, 
  onRetry 
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lifewood Results" size="xl">
      <ModalContent>
        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-medium text-center p-3 rounded-lg mb-4">
          The image you uploaded will be processed using OCR (Optical Character
          Recognition) to extract its contents. Please note: no information will be
          stored, saved, or used in any way. This is only a demonstration to show how
          the OCR process works.
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-8">
            <Loader text="Processing images..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="mb-2">
              <strong>OCR Error:</strong> {error}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <div className="space-y-6">
            {results.map((img, idx) => (
              <div key={img.id || idx} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={img.src}
                    alt={img.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div>
                    <div className="font-semibold">
                      {img.name || img.file?.name || `Image ${idx + 1}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      Extracted{' '}
                      {Array.isArray(img.result?.entries)
                        ? img.result.entries.length
                        : 0}{' '}
                      entries
                    </div>
                  </div>
                </div>

                {img.result?.student_name || img.result?.school_name ? (
                  <div className="mb-3 text-sm text-gray-700">
                    <div>
                      <strong>Student:</strong> {img.result.student_name || 'N/A'}
                    </div>
                    <div>
                      <strong>School:</strong> {img.result.school_name || 'N/A'}
                    </div>
                  </div>
                ) : null}

                {img.result?.entries && img.result.entries.length > 0 ? (
                  <div className="space-y-3">
                    {img.result.entries.map((entry, i) => (
                      <div
                        key={i}
                        className="p-3 border rounded bg-white shadow-sm text-sm"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <strong>Subject Code:</strong>{' '}
                            <span className="ml-1">{entry.subject_code || '—'}</span>
                          </div>
                          <div>
                            <strong>Total Units:</strong>{' '}
                            <span className="ml-1">
                              {entry.total_academic_units ?? 0}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <strong>Description:</strong>{' '}
                            <span className="ml-1">
                              {entry.subject_description || '—'}
                            </span>
                          </div>
                          <div>
                            <strong>Final Grade:</strong>{' '}
                            <span className="ml-1">{entry.final_grade ?? '—'}</span>
                          </div>
                          <div>
                            <strong>Remarks:</strong>{' '}
                            <span className="ml-1">{entry.remarks || '—'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic text-sm">
                    No subject entries extracted.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}