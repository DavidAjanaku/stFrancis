import React from 'react';

const PhotoGallery = ({ images = [], onImageClick }) => {
  // Early return if no images are provided
  if (!images || images.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 fade-in opacity-0 transition-opacity duration-1000">
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
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">Photo Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="cursor-pointer group">
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105"
                onClick={() => onImageClick && onImageClick(image)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;