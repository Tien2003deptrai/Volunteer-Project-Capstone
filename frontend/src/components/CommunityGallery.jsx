import { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { X, ChevronLeft, ChevronRight, Heart, Users, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { motion } from "framer-motion";

const CommunityGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample gallery images - Replace with actual images from your community
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
      title: "Community Cleanup Day",
      description: "Volunteers working together to clean up local parks",
      date: "2024-01-15"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      title: "Education Workshop",
      description: "Teaching digital literacy to seniors",
      date: "2024-01-20"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      title: "Tree Planting Initiative",
      description: "Planting trees for a greener future",
      date: "2024-02-01"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      title: "Food Bank Volunteer",
      description: "Distributing food to families in need",
      date: "2024-02-10"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      title: "Youth Mentorship Program",
      description: "Mentors guiding young people",
      date: "2024-02-15"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
      title: "Health Camp",
      description: "Free health checkups for the community",
      date: "2024-02-20"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
      title: "Beach Cleanup",
      description: "Protecting our oceans and beaches",
      date: "2024-03-01"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      title: "Reading Program",
      description: "Promoting literacy among children",
      date: "2024-03-05"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      title: "Community Garden",
      description: "Growing fresh vegetables together",
      date: "2024-03-10"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      title: "Disaster Relief",
      description: "Supporting communities in times of need",
      date: "2024-03-15"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      title: "Animal Shelter Help",
      description: "Caring for animals in need",
      date: "2024-03-20"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
      title: "Senior Care",
      description: "Bringing joy to elderly community members",
      date: "2024-03-25"
    }
  ];

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (direction === 'next') {
      const nextIndex = (selectedIndex + 1) % galleryImages.length;
      setSelectedIndex(nextIndex);
      setSelectedImage(galleryImages[nextIndex]);
    } else {
      const prevIndex = (selectedIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedIndex(prevIndex);
      setSelectedImage(galleryImages[prevIndex]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#467057] via-[#5a8a6f] to-[#345441] text-white py-20 md:py-28">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center mb-6">
                <Sparkles className="h-12 w-12 text-yellow-300" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Community <span className="text-yellow-300">Gallery</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100 leading-relaxed">
                Celebrating the spirit of volunteerism through moments of impact, unity, and positive change
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#467057]/10 rounded-full mb-3">
                  <Heart className="h-6 w-6 text-[#467057]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{galleryImages.length}+</div>
                <div className="text-sm text-gray-600">Moments Captured</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#467057]/10 rounded-full mb-3">
                  <Users className="h-6 w-6 text-[#467057]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <div className="text-sm text-gray-600">Volunteers Featured</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#467057]/10 rounded-full mb-3">
                  <Sparkles className="h-6 w-6 text-[#467057]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100+</div>
                <div className="text-sm text-gray-600">Events Documented</div>
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => openLightbox(image, index)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#467057] transition-colors">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-500">{new Date(image.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-[#467057] to-[#5a8a6f] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Be Part of Our Story
              </h2>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
                Join our community of volunteers and create moments that matter.
                Your actions today become the memories that inspire tomorrow.
              </p>
              <a
                href="/duties"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#467057] hover:bg-gray-100 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Get Involved Today
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black/95 border-none">
          {selectedImage && (
            <div className="relative w-full h-full">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image */}
              <div className="relative w-full h-[85vh] flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Navigation Buttons */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all z-50"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all z-50"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    {selectedIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-200 mb-2">{selectedImage.description}</p>
                <p className="text-sm text-gray-300">
                  {new Date(selectedImage.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CommunityGallery;

