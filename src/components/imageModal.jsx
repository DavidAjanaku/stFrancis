import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageModal = ({ isOpen, imageSrc, images, currentIndex, onClose, onNext, onPrevious, onImageSelect }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      style={{ margin: 0, padding: 0 }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-30 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navigation buttons */}
        {images && images.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-30 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Next button */}
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-30 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        {/* Main image container */}
        <div className="flex-1 flex items-center justify-center w-full">
          <img
            src={imageSrc}
            alt="Gallery image"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            draggable={false}
            style={{ 
              maxHeight: 'calc(100vh - 120px)', // Leave space for thumbnails and counter
              maxWidth: 'calc(100vw - 80px)', // Leave space for navigation buttons
              minHeight: '60vh', // Ensure minimum size
              minWidth: '60vw' // Ensure minimum width
            }}
          />
        </div>

        {/* Image counter */}
        {images && images.length > 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-70 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Thumbnail strip */}
        {images && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-center space-x-2 overflow-x-auto px-4 py-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (typeof onImageSelect === 'function') {
                      onImageSelect(index);
                    }
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-white border-opacity-100 opacity-100 scale-105' 
                      : 'border-white border-opacity-30 opacity-60 hover:opacity-90 hover:scale-105'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;