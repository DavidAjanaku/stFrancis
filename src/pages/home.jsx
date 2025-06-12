import React, { useState, useEffect } from 'react';
// Import all components
import HeroSection from '../components/hero';
import MassTimes from '../components/massTime';
import AboutSection from '../components/about';
import MinistriesSection from '../components/Ministries';
import EventsSection from '../components/Events';
import LiturgicalCalendar from '../components/liturgicial';
import PhotoGallery from '../components/PhotoGallery';
import ContactPrayer from '../components/contactPrayer';
import NewsletterSignup from '../components/newsletter';
import DonationSection from '../components/donation';
import Footer from '../components/footer';
import DarkModeToggle from '../components/darkmodal';
import ImageModal from '../components/imageModal';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Define the images array here so both PhotoGallery and ImageModal can use it
  const galleryImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpBBrFQEwRmbgjRMNtiA2y4sbEZRjNpcQTOworAUtPi7nL6UMj_c15O4nQVD7fDG-gBEY&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRULENFriKwh5iwkzrl2TlWXYThNMWkTGIp6Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS62vYOPeC7Db3Bn8t2jyKnjzMtjnygaKJ3DDLe5GTEFUeKNr3BWRPvFfMs5cy1GtSg-ko&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfi0XygYiMcgJ79Z-jJnLfYKayzUxD3NC6fsPjYdbg1hQTu9XdeY10W_B2ogFybkXjhPY&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGVJjpaPiZjvqpo9m-8tfDdN_xInHoEsfMCai1GAMle8ITQ-qWPULmIBboGfMCTIH3fhc&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpBBrFQEwRmbgjRMNtiA2y4sbEZRjNpcQTOworAUtPi7nL6UMj_c15O4nQVD7fDG-gBEY&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRULENFriKwh5iwkzrl2TlWXYThNMWkTGIp6Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS62vYOPeC7Db3Bn8t2jyKnjzMtjnygaKJ3DDLe5GTEFUeKNr3BWRPvFfMs5cy1GtSg-ko&usqp=CAU'
  ];

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0');
        }
      });
    });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const openModal = (imageSrc) => {
    const imageIndex = galleryImages.findIndex(img => img === imageSrc);
    setCurrentImageIndex(imageIndex !== -1 ? imageIndex : 0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const goToImageIndex = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <HeroSection />
      <MassTimes />
      <AboutSection />
      {/* <MinistriesSection /> */}
      <EventsSection />
      <LiturgicalCalendar />
      <PhotoGallery 
        images={galleryImages} 
        onImageClick={openModal} 
      />
      <ContactPrayer />
      {/* <NewsletterSignup /> */}
      <DonationSection />
      <Footer />
      <ImageModal
        isOpen={isModalOpen}
        imageSrc={galleryImages[currentImageIndex]}
        images={galleryImages}
        currentIndex={currentImageIndex}
        onClose={closeModal}
        onNext={goToNextImage}
        onPrevious={goToPreviousImage}
        onImageSelect={goToImageIndex}
      />
    </div>
  );
};

export default HomePage;