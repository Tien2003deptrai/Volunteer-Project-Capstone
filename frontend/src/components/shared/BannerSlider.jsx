import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const BannerSlider = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Default banners if none provided
  const defaultBanners = [
    {
      id: 1,
      title: "Make a Difference Today",
      subtitle: "Join thousands of volunteers making positive impact in communities",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
      ctaText: "Explore Opportunities",
      ctaLink: "/duties",
      gradient: "from-[#467057] to-[#2A4B37]"
    },
    {
      id: 2,
      title: "Volunteer for a Better Tomorrow",
      subtitle: "Discover meaningful volunteer opportunities that match your skills",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
      ctaText: "Browse Duties",
      ctaLink: "/browse",
      gradient: "from-[#2A4B37] to-[#467057]"
    },
    {
      id: 3,
      title: "Upcoming Events",
      subtitle: "Don't miss out on exciting volunteer events starting soon",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
      ctaText: "View Events",
      ctaLink: "/upcoming",
      gradient: "from-[#467057] to-[#345441]"
    }
  ];

  const slides = banners.length > 0 ? banners : defaultBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-2xl">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-delay">
                  {slide.subtitle}
                </p>
                {slide.ctaLink && (
                  <Button
                    size="lg"
                    className="bg-white text-[#467057] hover:bg-gray-100 text-lg px-8 py-6 rounded-lg font-semibold shadow-lg animate-fade-in-delay-2"
                    onClick={() => navigate(slide.ctaLink)}
                  >
                    {slide.ctaText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;

