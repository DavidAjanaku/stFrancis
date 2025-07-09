import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Helper to get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return '';
    
    // For server images, use as-is (server returns full URLs)
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

  // Add image error handling
  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-red-600 mb-2">Error Loading Gallery</p>
          <p className="text-gray-700 mb-4">{error}</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Photo Gallery</h2>
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>No images to display</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div key={image.id} className="cursor-pointer group relative">
                <div className="relative overflow-hidden rounded-lg shadow-lg h-48">
                  <img
                    src={getFullImageUrl(image.url)}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={() => setSelectedImage(image)}
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center px-4">
                      <h3 className="font-bold">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm mt-1 hidden md:block">{image.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                {image.category && (
                  <span className="absolute top-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs text-gray-800 capitalize">
                    {image.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={getFullImageUrl(selectedImage.url)}
              alt={selectedImage.title}
              className="w-full max-h-[70vh] object-contain"
              onError={handleImageError}
            />
            <div className="p-4">
              {selectedImage.description && (
                <p className="text-gray-700">{selectedImage.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                <span className="capitalize">{selectedImage.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;