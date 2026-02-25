import React, { useRef, useState } from 'react';
import { ArrowRight, X, Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { generateId } from '../../../../utils';
import { Button } from '../../../../components/common';

export default function MultiImageUploader({ onContinue }) {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragIndex = useRef(null);
  const fileInputRef = useRef(null);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const valid = files.filter((f) =>
      ['image/png', 'image/jpeg'].includes(f.type)
    );
    if (!valid.length) return;

    Promise.all(
      valid.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve({
                id: generateId(),
                src: e.target.result,
                name: file.name,
                file,
              });
            reader.readAsDataURL(file);
          })
      )
    ).then((items) => setImages((prev) => [...prev, ...items]));
  };

  const onInputChange = (e) => addFiles(e.target.files);

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onDragStart = (idx) => (dragIndex.current = idx);
  const onDragEnter = (idx) => {
    const from = dragIndex.current;
    if (from === null || from === idx) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    dragIndex.current = idx;
  };
  const onDragEnd = () => (dragIndex.current = null);

  const onDropFiles = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleContinue = () => {
    if (onContinue && typeof onContinue === 'function') {
      onContinue(images);
    }
  };

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-lifewood-castletonGreen/10 to-lifewood-darkSerpent/10 rounded-2xl sm:rounded-3xl blur-2xl"></div>

      {/* Main Card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                Upload Transcript Images
              </h2>
              <p className="text-lifewood-paper text-xs sm:text-sm mt-0.5">
                {images.length > 0
                  ? `${images.length} image${images.length > 1 ? 's' : ''} selected`
                  : 'Drag & drop or click to browse'}
              </p>
            </div>
            {images.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span className="text-white font-medium text-sm">Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Area - Compact */}
        <div className="p-4 sm:p-6">
          <div
            className={`relative border-2 border-dashed rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer
              ${isDragging
                ? 'border-lifewood-saffaron bg-lifewood-seaSalt/50 scale-[0.98]'
                : images.length > 0
                  ? 'border-green-300 bg-green-50/30 hover:border-green-400 hover:bg-green-50/50'
                  : 'border-gray-300 bg-gray-50/50 hover:border-lifewood-saffaron hover:bg-lifewood-seaSalt/30'
              }
            `}
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDropFiles}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={onInputChange}
            />

            {/* Upload Icon and Text - Compact */}
            <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4">
              <div className={`mb-3 sm:mb-4 transition-all duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent p-3 sm:p-4 rounded-full shadow-md">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                {isDragging ? 'Drop images here' : 'Upload Your Transcript'}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 text-center max-w-md">
                <span className="font-semibold">Click to browse</span> or drag and drop your files
              </p>

              <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 bg-white rounded border border-gray-200 font-mono">.png</span>
                <span className="px-2 py-0.5 bg-white rounded border border-gray-200 font-mono">.jpg</span>
                <span className="px-2 py-0.5 bg-white rounded border border-gray-200 font-mono">.jpeg</span>
              </div>
            </div>
          </div>

          {/* Thumbnails Grid - Scrollable with Fixed Max Height */}
          {images.length > 0 && (
            <div className="mt-4 sm:mt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lifewood-castletonGreen" />
                  Selected Images ({images.length})
                </h3>
                <button
                  onClick={() => setImages([])}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Scrollable Container with Max Height */}
              <div className="max-h-48 sm:max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => onDragStart(idx)}
                      onDragEnter={() => onDragEnter(idx)}
                      onDragEnd={onDragEnd}
                      className="group relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-move bg-white border border-gray-200 hover:border-lifewood-saffaron"
                      title={img.name}
                    >
                      {/* Image */}
                      <img
                        src={img.src}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center 
                          opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform hover:scale-110"
                        title="Remove image"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>

                      {/* Image number badge */}
                      <div className="absolute top-1 left-1 bg-lifewood-castletonGreen/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll hint if many images */}
              {images.length > 6 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  ↕️ Scroll to view all images
                </p>
              )}
            </div>
          )}

          {/* Continue Button - Compact */}
          {images.length >= 1 && (
            <div className="mt-4 sm:mt-5 flex justify-center">
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent hover:from-lifewood-darkSerpent hover:to-lifewood-darkSerpent 
                  text-white font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg 
                  inline-flex items-center gap-2 text-sm sm:text-base transform hover:scale-105 transition-all duration-300"
              >
                <span>Continue to Process</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
