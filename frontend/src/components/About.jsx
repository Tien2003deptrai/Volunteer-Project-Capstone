import { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Heart, Users, Target, Award, Sparkles, HandHeart } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Compassion",
      description: "We believe in the power of empathy and kindness to transform communities."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Unity",
      description: "Together we are stronger. We unite volunteers to create lasting impact."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Purpose",
      description: "Every volunteer action serves a meaningful purpose in building a better world."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for excellence in all our volunteer programs and initiatives."
    }
  ];

  const stats = [
    { number: "500+", label: "Active Volunteers" },
    { number: "100+", label: "Completed Projects" },
    { number: "50+", label: "Partner Organizations" },
    { number: "10K+", label: "Hours Volunteered" }
  ];

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
                About <span className="text-yellow-300">Change-Makers</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100 leading-relaxed">
                Connecting passionate volunteers with meaningful opportunities to create lasting impact in our communities
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800"
                    alt="Volunteers working together"
                    className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#467057]/20 to-transparent rounded-2xl"></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our <span className="text-[#467057]">Mission</span>
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Our platform was created to honor the spirit of the July Revolution of Bangladesh — a historic movement that showcased the power of unity, courage, and determination for positive change.
                  </p>
                  <p>
                    Inspired by this legacy, we connect passionate volunteers with meaningful opportunities to serve their communities and make a real difference. We believe that every act of volunteering, big or small, contributes to building a stronger, more compassionate society.
                  </p>
                  <p className="font-semibold text-[#467057]">
                    Join us in continuing the revolutionary spirit by offering your time, skills, and heart to causes that matter. Together, we can create lasting impact — just as those before us did.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our <span className="text-[#467057]">Values</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className="w-16 h-16 bg-[#467057]/10 rounded-lg flex items-center justify-center text-[#467057] mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-[#467057] to-[#5a8a6f] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl text-gray-100">Numbers that tell our story</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-yellow-300">{stat.number}</div>
                  <div className="text-lg text-gray-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center mb-6">
                <HandHeart className="h-16 w-16 text-[#467057]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of volunteers who are already making an impact in their communities.
                Find opportunities that match your passion and skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/duties"
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#467057] hover:bg-[#2A4B37] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  Browse Opportunities
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-[#467057] text-[#467057] hover:bg-[#467057] hover:text-white font-semibold rounded-lg transition-colors"
                >
                  Join Us Today
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
