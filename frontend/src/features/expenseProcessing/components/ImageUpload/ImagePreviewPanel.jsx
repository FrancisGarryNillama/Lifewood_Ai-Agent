import React from 'react';
import { Modal, ModalContent, ModalFooter, Button } from '../../../../components/common';
import { Edit3, Eye, Download, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function ImagePreviewPanel({
  isOpen,
  images,
  onClose,
  onProcess,
  onEditImage,
  loading,
}) {
  const getTransformStyle = (img) => {
    if (!img.transform) return {};
    const { vertical, horizontal, rotation, zoom } = img.transform;
    return {
      transform: `
        perspective(1000px)
        rotateX(${vertical}deg)
        rotateY(${horizontal}deg)
        rotate(${rotation}deg)
        scale(${zoom})
      `,
    };
  };

  const handleViewImage = (img) => {
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head><title>View Image</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#000;">
          <img src="${img.src}" style="max-width:100%; max-height:100%; ${img.transform ? `transform:${getTransformStyle(img).transform};` : ''
      }" />
        </body>
      </html>
    `);
  };

  const handleDownload = (img) => {
    const link = document.createElement('a');
    link.href = img.src;
    link.download = img.name || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Image Preview and Edit" size="xl">
      <ModalContent>
        {loading ? (
          <div className="relative py-16 px-6">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-lifewood-paper via-lifewood-seaSalt to-lifewood-seaSalt opacity-50"></div>

            {/* Content */}
            <div className="relative">
              {/* Animated loader card */}
              <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-lifewood-castletonGreen/20 p-8">
                {/* Pulsing icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    {/* Spinning ring */}
                    <div className="absolute inset-0 border-4 border-lifewood-castletonGreen/20 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>

                {/* Text */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Processing OCR...</h3>
                  <p className="text-gray-600 mb-6">Extracting text from your images</p>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 bg-lifewood-castletonGreen rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-lifewood-darkSerpent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-lifewood-earthYellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>

              {/* Info text */}
              <p className="text-center text-sm text-gray-500 mt-6">
                This may take a few moments depending on image quality
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-lifewood-paper to-lifewood-seaSalt rounded-xl border border-lifewood-castletonGreen/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent rounded-lg">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    {images.length} Image{images.length > 1 ? 's' : ''} Ready
                  </h3>
                  <p className="text-sm text-gray-600">
                    Edit transformations or proceed to process
                  </p>
                </div>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-lifewood-saffaron transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg"
                >
                  {/* Image Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-lifewood-castletonGreen text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                    #{index + 1}
                  </div>

                  {/* Image Container */}
                  <div className="relative h-48 sm:h-56 bg-gray-50 overflow-hidden">
                    <img
                      src={img.src}
                      alt={`img-${index}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={getTransformStyle(img)}
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 sm:p-4 bg-white">
                    <div className="grid grid-cols-3 gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => onEditImage(img)}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gradient-to-br from-lifewood-paper to-lifewood-seaSalt hover:from-lifewood-paper hover:to-lifewood-seaSalt border border-lifewood-castletonGreen/20 hover:border-lifewood-saffaron transition-all duration-200 group/btn"
                        title="Edit image"
                      >
                        <Edit3 className="w-4 h-4 text-lifewood-castletonGreen group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-xs font-medium text-lifewood-darkSerpent">Edit</span>
                      </button>

                      {/* View Button */}
                      <button
                        onClick={() => handleViewImage(img)}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-400 transition-all duration-200 group/btn"
                        title="View full size"
                      >
                        <Eye className="w-4 h-4 text-lifewood-castletonGreen group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-xs font-medium text-lifewood-darkSerpent">View</span>
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(img)}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 hover:border-purple-400 transition-all duration-200 group/btn"
                        title="Download image"
                      >
                        <Download className="w-4 h-4 text-lifewood-saffaron group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-xs font-medium text-lifewood-darkSerpent">Save</span>
                      </button>
                    </div>

                    {/* Image Name */}
                    {img.name && (
                      <div className="mt-2 text-xs text-gray-500 truncate text-center" title={img.name}>
                        {img.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </ModalContent>

      {!loading && (
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={onProcess}
            className="bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent hover:from-lifewood-darkSerpent hover:to-lifewood-darkSerpent"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Process Images
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}

