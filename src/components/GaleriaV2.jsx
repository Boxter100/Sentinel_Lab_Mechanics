import { useState, useEffect, useRef } from 'react';

// Iconos SVG nativos (reemplazo de lucide-react)
const IconChevronLeft = ({ size = 28 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconChevronRight = ({ size = 28 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function ImageGridCarousel() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);

  const images = [
    { id: 1, src: '/pcs/gabinete1.webp', alt: 'Gabinete 1', gridArea: 'img1' },
    { id: 2, src: '/pcs/gabinete2.webp', alt: 'Gabinete 2', gridArea: 'img2' },
    { id: 3, src: '/pcs/gabinete3.webp', alt: 'Gabinete 3', gridArea: 'img3' },
    { id: 4, src: '/pcs/gabinete4.webp', alt: 'Gabinete 4', gridArea: 'img4' },
    { id: 5, src: '/pcs/gabinete5.webp', alt: 'Gabinete 5', gridArea: 'img5' },
    { id: 6, src: '/pcs/gabinete6.webp', alt: 'Gabinete 6', gridArea: 'img1' },
    { id: 7, src: '/pcs/gabinete7.webp', alt: 'Gabinete 7', gridArea: 'img2' },
    { id: 8, src: '/pcs/gabinete8.webp', alt: 'Gabinete 8', gridArea: 'img3' },
    { id: 9, src: '/pcs/gabinete9.webp', alt: 'Gabinete 9', gridArea: 'img4' },
    { id: 10, src: '/pcs/gabinete10.webp', alt: 'Gabinete 10', gridArea: 'img5' },
    { id: 11, src: '/pcs/gabinete11.webp', alt: 'Gabinete 11', gridArea: 'img1' },
    { id: 12, src: '/pcs/gabinete12.webp', alt: 'Gabinete 12', gridArea: 'img2' },
    { id: 13, src: '/pcs/gabinete13.webp', alt: 'Gabinete 13', gridArea: 'img3' },
    { id: 14, src: '/pcs/gabinete14.webp', alt: 'Gabinete 14', gridArea: 'img4' },
    { id: 15, src: '/pcs/gabinete15.webp', alt: 'Gabinete 15', gridArea: 'img5' },
  ];

  const totalSlides = Math.ceil(images.length / 5);

  useEffect(() => {
    const handleScroll = () => {
      if (selectedImage !== null) {
        setSelectedImage(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage !== null) {
        setSelectedImage(null);
      }
    };

    if (selectedImage !== null) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedImage]);

  const handleImageClick = (id) => {
    setSelectedImage(id);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
    }
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getCurrentImages = () => {
    const startIndex = currentIndex * 5;
    return images.slice(startIndex, startIndex + 5);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="relative">
        {/* Carousel Container */}
        <div className="carousel-wrapper" ref={carouselRef}>
          <div className="grid-container">
            {getCurrentImages().map((img, index) => (
              <div
                key={img.id}
                className={`image-wrapper ${img.gridArea} ${
                  selectedImage === img.id ? 'selected' : ''
                } ${selectedImage !== null && selectedImage !== img.id ? 'dimmed' : ''}`}
                onClick={() => handleImageClick(img.id)}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="nav-button left"
          aria-label="Anterior"
        >
          <IconChevronLeft size={28} />
        </button>
        
        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="nav-button right"
          aria-label="Siguiente"
        >
          <IconChevronRight size={28} />
        </button>

        {/* Dots Indicator */}
        <div className="dots-container">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 600);
                }
              }}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Expanded View Overlay */}
        {selectedImage !== null && (
          <div
            className="overlay"
            onClick={handleBackdropClick}
          >
            <div className="expanded-container">
              <img
                src={images.find(img => img.id === selectedImage).src}
                alt={images.find(img => img.id === selectedImage).alt}
                className="expanded-image"
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .carousel-wrapper {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .grid-container {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 180px);
          grid-template-areas:
            "img1 img2 img3"
            "img4 img4 img3"
            "img4 img4 img5";
          width: 100%;
        }

        @media (min-width: 768px) {
          .grid-container {
            gap: 1rem;
            grid-template-rows: repeat(3, 200px);
          }
        }

        @media (min-width: 1024px) {
          .grid-container {
            grid-template-rows: repeat(3, 240px);
          }
        }

        .img1 { grid-area: img1; }
        .img2 { grid-area: img2; }
        .img3 { grid-area: img3; }
        .img4 { grid-area: img4; }
        .img5 { grid-area: img5; }

        .image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          transform: translateX(30px);
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .image-wrapper:hover {
          transform: scale(1.02) translateX(0);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                      0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .image-wrapper.dimmed {
          opacity: 0.4;
          filter: brightness(0.7);
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-wrapper:hover .image {
          transform: scale(1.05);
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                      0 2px 4px -1px rgba(0, 0, 0, 0.06);
          z-index: 10;
          color: #1f2937;
        }

        .nav-button:hover:not(:disabled) {
          background: white;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                      0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-button.left {
          left: -20px;
        }

        .nav-button.right {
          right: -20px;
        }

        @media (max-width: 768px) {
          .nav-button {
            width: 40px;
            height: 40px;
          }
          
          .nav-button.left {
            left: -10px;
          }

          .nav-button.right {
            right: -10px;
          }
        }

        .dots-container {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot:hover {
          background: #9ca3af;
          transform: scale(1.2);
        }

        .dot.active {
          background: #3b82f6;
          width: 24px;
          border-radius: 5px;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          animation: fadeIn 0.3s ease-out;
          backdrop-filter: blur(8px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .expanded-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .expanded-image {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}