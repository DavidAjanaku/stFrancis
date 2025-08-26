import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [showContent, setShowContent] = useState(false);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://distinct-stranger-production.up.railway.app';

  // Memoize image URL getter to prevent recalculations
  const getImageUrl = useCallback((slide) => {
    if (!slide.image) return '/default-hero.jpg';
    
    if (slide.image.startsWith('http')) {
      return slide.image;
    }
    
    if (slide.image.startsWith('/uploads')) {
      return `${backendUrl}${slide.image}`;
    }
    
    return `${backendUrl}/${slide.image}`;
  }, [backendUrl]);

  // Preload images function
  const preloadImages = useCallback((slidesData) => {
    const imagePromises = slidesData.map((slide) => {
      return new Promise((resolve) => {
        const img = new Image();
        const imageUrl = getImageUrl(slide);
        
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, slide._id]));
          resolve({ success: true, slideId: slide._id });
        };
        
        img.onerror = () => {
          setImageErrors(prev => ({ ...prev, [slide._id]: true }));
          resolve({ success: false, slideId: slide._id });
        };
        
        img.src = imageUrl;
      });
    });

    // Show content immediately after first image loads or after 1 second timeout
    Promise.race([
      imagePromises[0] || Promise.resolve(),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]).then(() => {
      setShowContent(true);
    });

    return Promise.allSettled(imagePromises);
  }, [getImageUrl]);

  // Fetch slides with improved error handling and retries
  useEffect(() => {
    const fetchSlides = async (retryCount = 0) => {
      const maxRetries = 3;
      const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff
      
      try {
        setLoading(true);
        
        console.log(`Attempting to fetch slides (attempt ${retryCount + 1}/${maxRetries + 1})`);
        console.log(`Backend URL: ${backendUrl}`);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${backendUrl}/api/hero-slides`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched slides:', data);
        
        if (data && data.length > 0) {
          setSlides(data);
          preloadImages(data);
        } else {
          console.warn('No slides data received or empty array');
          setShowContent(true);
        }
        
      } catch (error) {
        console.error(`Error fetching hero slides (attempt ${retryCount + 1}):`, error);
        
        if (retryCount < maxRetries) {
          console.log(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => fetchSlides(retryCount + 1), retryDelay);
          return; // Don't set loading to false yet
        } else {
          console.error('Max retries reached, showing fallback content');
          // Load fallback content after all retries failed
          loadFallbackContent();
          setShowContent(true);
        }
      } finally {
        if (retryCount >= maxRetries) {
          setLoading(false);
        }
      }
    };
    
    fetchSlides();
  }, [backendUrl, preloadImages]);

  // Auto-advance slides with cleanup
  useEffect(() => {
    if (slides.length > 1 && showContent) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length, showContent]);

  // Optimized navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Load fallback content when API fails
  const loadFallbackContent = useCallback(() => {
    const fallbackSlides = [
      {
        _id: 'fallback-1',
        title: 'Welcome to Our Parish',
        subtitle: 'A Community of Faith and Love',
        description: 'Join us in worship, fellowship, and service as we grow together in faith and build a stronger community.',
        image: null, // Will show gradient background
        cta: {
          primary: { text: 'Join Us Today', link: '/about' },
          secondary: { text: 'Learn More', link: '/contact' }
        }
      },
      {
        _id: 'fallback-2',
        title: 'Sunday Mass',
        subtitle: 'Come and Worship With Us',
        description: 'Experience the joy of community worship. All are welcome to join us for our weekly celebrations.',
        image: null,
        cta: {
          primary: { text: 'Mass Schedule', link: '/schedule' },
          secondary: { text: 'Contact Us', link: '/contact' }
        }
      }
    ];
    
    console.log('Loading fallback content');
    setSlides(fallbackSlides);
  }, []);

  const handleClick = useCallback((link) => {
    console.log(`Navigation to: ${link}`);
  }, []);
  const slideUrls = useMemo(() => {
    return slides.map(slide => ({
      ...slide,
      imageUrl: getImageUrl(slide)
    }));
  }, [slides, getImageUrl]);

  // Show skeleton loader initially
  if (loading && !showContent) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-amber-900 to-yellow-800">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              {/* Skeleton content that matches the real content layout */}
              <div className="animate-pulse">
                <div className="h-16 bg-white/20 rounded-lg mb-4 w-3/4"></div>
                <div className="h-8 bg-white/15 rounded-lg mb-6 w-1/2"></div>
                <div className="h-6 bg-white/10 rounded-lg mb-2 w-full"></div>
                <div className="h-6 bg-white/10 rounded-lg mb-8 w-2/3"></div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="h-14 bg-amber-800/50 rounded-lg w-40"></div>
                  <div className="h-14 bg-white/20 rounded-lg w-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      
      </div>
    );
  }

  if (slides.length === 0 && !loading) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-amber-900 to-yellow-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Hero Slides Found</h2>
          <p className="text-gray-200">Please add some slides in the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slideUrls.map((slide, index) => {
          const hasImageError = imageErrors[slide._id];
          const isActive = index === currentSlide;
          const isNext = index === (currentSlide + 1) % slides.length;
          const isPrev = index === (currentSlide - 1 + slides.length) % slides.length;
          
          return (
            <div
              key={slide._id}
              className={`absolute inset-0 transition-all duration-1000 ${
                isActive 
                  ? 'opacity-100 z-20' 
                  : isNext || isPrev 
                    ? 'opacity-0 z-10' 
                    : 'opacity-0 z-0'
              }`}
              style={{
                // Preload adjacent slides for smoother transitions
                display: isActive || isNext || isPrev ? 'block' : 'none'
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-yellow-800/60 z-10"></div>
                
                {/* Image */}
                {!hasImageError ? (
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading={isActive ? "eager" : "lazy"}
                    style={{
                      // Use transform3d for hardware acceleration
                      transform: 'translate3d(0, 0, 0)',
                      willChange: isActive ? 'transform' : 'auto'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-800 to-yellow-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-xl font-semibold mb-2">Image Not Found</p>
                      <p className="text-sm opacity-75">Path: {slide.imageUrl}</p>
                    </div>
                  </div>
                )}
                
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/30 z-20"></div>
              </div>

              {/* Content */}
              <div className="relative z-30 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl">
                    <h1 
                      className={`text-5xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg transition-all duration-1000 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                    >
                      {slide.title}
                    </h1>
                    <h2 
                      className={`text-2xl md:text-3xl text-amber-200 mb-6 font-light drop-shadow-lg transition-all duration-1000 delay-100 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                    >
                      {slide.subtitle}
                    </h2>
                    <p 
                      className={`text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed drop-shadow-md transition-all duration-1000 delay-200 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                    >
                      {slide.description}
                    </p>
                    <div 
                      className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-300 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                    >
                      <button
                        onClick={() => handleClick(slide.cta.primary.link)}
                        className="bg-amber-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-900 transition-colors inline-flex items-center justify-center shadow-lg transform hover:scale-105"
                      >
                        {slide.cta.primary.text}
                      </button>
                      <button
                        onClick={() => handleClick(slide.cta.secondary.link)}
                        className="border-2 border-amber-200 text-amber-100 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-200 hover:text-amber-900 transition-colors inline-flex items-center justify-center transform hover:scale-105"
                      >
                        {slide.cta.secondary.text}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-amber-800/60 hover:bg-amber-800/80 text-white p-3 rounded-full transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-amber-800/60 hover:bg-amber-800/80 text-white p-3 rounded-full transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all hover:scale-125 ${
                index === currentSlide ? 'bg-amber-200' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;