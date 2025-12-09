import { motion } from "framer-motion";
import { Quote, Star, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Environmental Volunteer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      content: "Change-Makers has connected me with amazing opportunities to make a real difference. The platform is easy to use and the community is incredibly supportive!",
      rating: 5,
      organization: "Green Earth Initiative"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Education Volunteer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      content: "I've been volunteering through this platform for 6 months now. It's been life-changing! The impact we're making together is incredible.",
      rating: 5,
      organization: "Education for All Foundation"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Community Health Volunteer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      content: "The best part is connecting with like-minded people who share the same passion for helping others. Highly recommend to anyone looking to volunteer!",
      rating: 5,
      organization: "Community Health Center"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Youth Mentor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      content: "As a mentor, I've seen firsthand how this platform brings together volunteers and creates lasting positive change. It's truly inspiring!",
      rating: 5,
      organization: "Youth Empowerment Network"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Quote className="h-10 w-10 text-[#467057]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-[#467057]">Volunteers</span> Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real people making a difference in their communities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border border-gray-200 bg-white">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="flex-1 mb-6">
                    <Quote className="h-8 w-8 text-[#467057]/20 mb-3" />
                    <p className="text-gray-700 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Avatar className="w-12 h-12 border-2 border-[#467057]">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="bg-[#467057] text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-[#467057] font-medium mt-1 truncate">
                        {testimonial.organization}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Join hundreds of satisfied volunteers</p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#467057] hover:bg-[#2A4B37] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Become a Volunteer Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

