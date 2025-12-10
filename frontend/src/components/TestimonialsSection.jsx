import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Tình nguyện viên Môi trường",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      content: "Change-Makers đã kết nối tôi với những cơ hội tuyệt vời để tạo ra sự khác biệt thực sự. Nền tảng dễ sử dụng và cộng đồng rất hỗ trợ!",
      rating: 5,
      organization: "Sáng kiến Trái đất Xanh"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tình nguyện viên Giáo dục",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      content: "Tôi đã tình nguyện thông qua nền tảng này trong 6 tháng qua. Nó đã thay đổi cuộc sống! Tác động mà chúng tôi tạo ra cùng nhau thật đáng kinh ngạc.",
      rating: 5,
      organization: "Quỹ Giáo dục Cho Tất cả"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Tình nguyện viên Sức khỏe Cộng đồng",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      content: "Điều tốt nhất là kết nối với những người có cùng chí hướng giúp đỡ người khác. Rất khuyến nghị cho bất kỳ ai muốn tình nguyện!",
      rating: 5,
      organization: "Trung tâm Sức khỏe Cộng đồng"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Cố vấn Thanh thiếu niên",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      content: "Là một cố vấn, tôi đã chứng kiến trực tiếp cách nền tảng này tập hợp các tình nguyện viên và tạo ra sự thay đổi tích cực lâu dài. Thật truyền cảm hứng!",
      rating: 5,
      organization: "Mạng lưới Trao quyền Thanh thiếu niên"
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
            Những <span className="text-[#467057]">Tình nguyện viên</span> của chúng tôi nói gì
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những câu chuyện thực tế từ những con người thực tạo ra sự khác biệt trong cộng đồng của họ
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
                      &quot;{testimonial.content}&quot;
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
          <p className="text-gray-600 mb-4">Tham gia hàng trăm tình nguyện viên hài lòng</p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#467057] hover:bg-[#2A4B37] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Trở Thành Tình nguyện viên Hôm nay
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
