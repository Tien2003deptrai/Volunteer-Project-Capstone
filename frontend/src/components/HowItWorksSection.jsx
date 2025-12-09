import { motion } from "framer-motion";
import { Search, UserCheck, HandHeart, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Browse Opportunities",
      description: "Explore hundreds of volunteer opportunities that match your interests and skills. Filter by location, type, and time commitment.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Apply & Get Accepted",
      description: "Submit your application and wait for approval. Once accepted, you'll join a community of passionate volunteers.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Join Groups & Connect",
      description: "Connect with other volunteers in your group. Share experiences, collaborate on projects, and build lasting friendships.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: <HandHeart className="h-8 w-8" />,
      title: "Make an Impact",
      description: "Start volunteering and make a real difference! Track your contributions, share your journey, and inspire others.",
      color: "from-[#467057] to-[#2A4B37]",
      bgColor: "bg-[#D0F0DD]",
      iconColor: "text-[#467057]"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-[#467057]">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in just a few simple steps and begin making a difference today
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all border-2 border-gray-100 hover:border-[#467057]/30 bg-white">
                <CardContent className="p-6">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center ${step.iconColor}`}>
                      {step.icon}
                    </div>
                    <div className="text-4xl font-bold text-gray-200">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Visual Flow (Mobile) */}
        <div className="lg:hidden mb-8">
          <div className="flex flex-col items-center gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 w-full">
                <div className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center ${step.iconColor} flex-shrink-0`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#467057] to-[#5a8a6f] rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Volunteer Journey?
            </h3>
            <p className="text-lg text-gray-100 mb-6 max-w-2xl mx-auto">
              Join thousands of volunteers making a positive impact in their communities.
              Your journey starts with a single click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/duties")}
                className="bg-white text-[#467057] hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
              >
                Browse Opportunities
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
              >
                Create Account
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

