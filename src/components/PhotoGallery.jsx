import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Heart, Share2, Download } from 'lucide-react';
import Footer from './footer';

const PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper to get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return '';
    return url;
  };

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/gallery');
        if (!response.ok) throw new Error('Failed to fetch gallery images');
        const data = await response.json();
        // Filter active images
        setImages(data.filter(img => img.isActive));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Get unique categories for filtering
  const categories = ['all', ...new Set(images.map(img => img.category))];

  // Filter images based on selected category
  const filteredImages = filter === 'all' 
    ? images.filter(img => img.isActive)
    : images.filter(img => img.isActive && img.category === filter);

  const openFullscreen = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % filteredImages.length
      : (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFullscreen) {
        if (e.key === 'Escape') closeFullscreen();
        if (e.key === 'ArrowRight') navigateImage('next');
        if (e.key === 'ArrowLeft') navigateImage('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentImageIndex, filteredImages.length]);

  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Loading Gallery...</h2>
            <p className="text-gray-600">Please wait while we fetch your beautiful memories</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-red-50 to-red-100 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Photos Available</h2>
            <p className="text-gray-600 text-lg">Check back soon for beautiful gallery images!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Photo Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Capturing precious moments and memories from our community
            </p>
          </div>

        

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => openFullscreen(image, index)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getFullImageUrl(image.url)}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={handleImageError}
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                    {image.description && (
                      <p className="text-gray-200 text-sm line-clamp-2">{image.description}</p>
                    )}
                  </div>
                  
                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Category Badge */}
                {image.category && (
                  <div className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {image.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      {isFullscreen && selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-6 right-6 z-60 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-60 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-60 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="max-w-full max-h-full flex items-center justify-center">
              <img
                src={getFullImageUrl(selectedImage.url)}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-300 text-lg mb-4">{selectedImage.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {selectedImage.category}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {currentImageIndex + 1} of {filteredImages.length}
                    </span>
                  </div>
                  
              
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
};

export default PhotoGallery;