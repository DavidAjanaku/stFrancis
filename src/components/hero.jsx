import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/hero-slides`);
        if (!response.ok) throw new Error('Failed to fetch slides');
        
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleClick = (link) => {
    // In a real app, this would use your routing solution
    console.log(`Navigation to: ${link}`);
  };

  if (loading) {
    return (
      <div className="relative h-screen bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <p>Loading hero banner...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Or a placeholder
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
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

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-2xl md:text-3xl text-amber-200 mb-6 font-light">
                    {slide.subtitle}
                  </h2>
                  <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleClick(slide.cta.primary.link)}
                      className="bg-amber-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-900 transition-colors inline-flex items-center justify-center shadow-lg"
                    >
                      {slide.cta.primary.text}
                    </button>
                    <button
                      onClick={() => handleClick(slide.cta.secondary.link)}
                      className="border-2 border-amber-200 text-amber-100 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-200 hover:text-amber-900 transition-colors inline-flex items-center justify-center"
                    >
                      {slide.cta.secondary.text}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-amber-800/60 hover:bg-amber-800/80 text-white p-3 rounded-full transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-amber-800/60 hover:bg-amber-800/80 text-white p-3 rounded-full transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-amber-200' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;