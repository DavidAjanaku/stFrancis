import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Save, X, Plus, Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import SlideEditor from '../../components/SlideEditor';

const HeroBanner = ({ slides, currentSlide, onSlideChange }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        onSlideChange((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length, onSlideChange]);

  const nextSlide = () => {
    onSlideChange((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    onSlideChange((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    onSlideChange(index);
  };

  return (
    <section className="relative h-96 overflow-hidden rounded-lg shadow-xl">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-r from-amber-900/80 to-yellow-800/60"></div>
              <img
                src={slide.image.startsWith('/uploads') 
                  ? `${backendUrl}${slide.image}` 
                  : slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-amber-900/50"></div>
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-lg md:text-xl text-amber-200 mb-3 font-light">
                    {slide.subtitle}
                  </h2>
                  <p className="text-sm text-gray-200 mb-4 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="bg-amber-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-amber-900 transition-colors">
                      {slide.cta.primary.text}
                    </button>
                    <button className="border border-amber-200 text-amber-100 px-4 py-2 rounded text-sm font-semibold hover:bg-amber-200 hover:text-amber-900 transition-colors">
                      {slide.cta.secondary.text}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-amber-800/60 hover:bg-amber-800/80 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-amber-800/60 hover:bg-amber-800/80 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-amber-200' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

const HomepageAdmin = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editingSlide, setEditingSlide] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/hero-slides/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch slides');
        
        const data = await response.json();
        setSlides(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlides();
  }, []);

  const handleEditSlide = (slide) => {
    setEditingSlide(slide);
  };

  const handleSaveSlide = async (editedSlide, imageFile) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add the image file if it exists
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Add other slide data
      formData.append('title', editedSlide.title);
      formData.append('subtitle', editedSlide.subtitle);
      formData.append('description', editedSlide.description);
      formData.append('cta', JSON.stringify(editedSlide.cta));
      
      const response = await fetch(`${backendUrl}/api/hero-slides/${editedSlide._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Failed to save slide';
        throw new Error(errorMessage);
      }
      
      const updatedSlide = await response.json();
      setSlides(prev => prev.map(slide => 
        slide._id === updatedSlide._id ? updatedSlide : slide
      ));
      setEditingSlide(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (slides.length <= 1) {
      alert('You must have at least one slide');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/hero-slides/${slideId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete slide');
      
      setSlides(prev => prev.filter(slide => slide._id !== slideId));
      if (currentSlide >= slides.length - 1) {
        setCurrentSlide(0);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSlide = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Create a default image blob
      const defaultImage = await fetch('/default-hero.jpg');
      const blob = await defaultImage.blob();
      const defaultImageFile = new File([blob], 'default-hero.jpg', { type: 'image/jpeg' });

      // Add slide data
      formData.append('title', "New Slide Title");
      formData.append('subtitle', "New Slide Subtitle");
      formData.append('description', "Add your slide description here.");
      formData.append('cta', JSON.stringify({
        primary: { text: "Primary Button", link: "/" },
        secondary: { text: "Secondary Button", link: "/" }
      }));
      formData.append('image', defaultImageFile); // Add default image

      const response = await fetch(`${backendUrl}/api/hero-slides`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add slide');
      }
      
      const addedSlide = await response.json();
      setSlides(prev => [...prev, addedSlide]);
      setEditingSlide(addedSlide);
    } catch (err) {
      setError(err.message);
    }
  };

  const moveSlide = async (slideId, direction) => {
    try {
      const currentIndex = slides.findIndex(slide => slide._id === slideId);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= slides.length) return;
      
      // Swap order values
      const updatedSlides = [...slides];
      [updatedSlides[currentIndex], updatedSlides[newIndex]] = 
        [updatedSlides[newIndex], updatedSlides[currentIndex]];
      
      setSlides(updatedSlides);
      
      // Update order in backend
      const token = localStorage.getItem('token');
      await fetch(`${backendUrl}/api/hero-slides/order/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderedIds: updatedSlides.map(slide => slide._id)
        })
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hero slides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Homepage Hero Banner</h1>
              <p className="text-gray-600">Manage your church's hero banner content</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  previewMode 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Eye size={16} />
                {previewMode ? 'Exit Preview' : 'Preview'}
              </button>
              <button
                onClick={handleAddSlide}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Slide
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {previewMode ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h2>
            <HeroBanner 
              slides={slides} 
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {editingSlide ? (
              <SlideEditor
                slide={editingSlide}
                onSave={handleSaveSlide}
                onCancel={() => setEditingSlide(null)}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Hero Banner Slides</h2>
                  <p className="text-sm text-gray-600">{slides.length} slides total</p>
                </div>

                <div className="grid gap-6">
                  {slides.map((slide, index) => (
                    <div key={slide._id} className="bg-white rounded-lg shadow-md border overflow-hidden">
                      <div className="flex">
                        <div className="w-48 h-32 flex-shrink-0">
                          <img 
                            src={slide.image.startsWith('/uploads') 
                              ? `${backendUrl}${slide.image}` 
                              : slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">{slide.title}</h3>
                              <p className="text-amber-600 text-sm font-medium">{slide.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                Slide {index + 1}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => moveSlide(slide._id, 'up')}
                                  disabled={index === 0}
                                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                  title="Move up"
                                >
                                  <ArrowUp size={16} />
                                </button>
                                <button
                                  onClick={() => moveSlide(slide._id, 'down')}
                                  disabled={index === slides.length - 1}
                                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                  title="Move down"
                                >
                                  <ArrowDown size={16} />
                                </button>
                              </div>
                              <button
                                onClick={() => handleEditSlide(slide)}
                                className="text-amber-600 hover:text-amber-800 transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              {slides.length > 1 && (
                                <button
                                  onClick={() => handleDeleteSlide(slide._id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{slide.description}</p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              {slide.cta.primary.text}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {slide.cta.secondary.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomepageAdmin;