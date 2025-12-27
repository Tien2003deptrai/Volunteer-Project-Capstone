import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Heart, Users, Target, Award, Sparkles, HandHeart } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const [stats, setStats] = useState([
    { number: "0+", label: "Tình nguyện viên đang hoạt động" },
    { number: "0+", label: "Dự án đã hoàn thành" },
    { number: "0+", label: "Tổ chức đối tác" },
    { number: "0+", label: "Giờ tình nguyện" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${USER_API}/public-stats`);
      if (res.data.success) {
        const { activeVolunteers, completedProjects, partnerOrganizations, totalVolunteerHours } = res.data.stats;
        setStats([
          { number: `${activeVolunteers}+`, label: "Tình nguyện viên đang hoạt động" },
          { number: `${completedProjects}+`, label: "Dự án đã hoàn thành" },
          { number: `${partnerOrganizations}+`, label: "Tổ chức đối tác" },
          { number: `${totalVolunteerHours >= 1000 ? (totalVolunteerHours / 1000).toFixed(1) + 'K' : totalVolunteerHours}+`, label: "Giờ tình nguyện" }
        ]);
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
    }
  };

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Lòng Nhân Ái",
      description: "Chúng tôi tin vào sức mạnh của sự đồng cảm và lòng tốt để biến đổi cộng đồng."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Đoàn Kết",
      description: "Cùng nhau chúng ta mạnh mẽ hơn. Chúng tôi đoàn kết các tình nguyện viên để tạo ra tác động lâu dài."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Mục Đích",
      description: "Mỗi hành động tình nguyện đều phục vụ một mục đích ý nghĩa trong việc xây dựng một thế giới tốt đẹp hơn."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Xuất Sắc",
      description: "Chúng tôi phấn đấu đạt được sự xuất sắc trong tất cả các chương trình và sáng kiến tình nguyện của chúng tôi."
    }
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
                Về <span className="text-yellow-300">Những Người Tạo Thay Đổi</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100 leading-relaxed">
                Kết nối những tình nguyện viên đầy nhiệt huyết với những cơ hội ý nghĩa để tạo ra tác động lâu dài trong cộng đồng của chúng ta
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
                    alt="Tình nguyện viên làm việc cùng nhau"
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
                  Sứ mệnh <span className="text-[#467057]">của chúng tôi</span>
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Nền tảng của chúng tôi được tạo ra để tôn vinh tinh thần của Cách mạng Tháng Bảy của Bangladesh — một phong trào lịch sử đã thể hiện sức mạnh của sự đoàn kết, lòng dũng cảm và quyết tâm cho sự thay đổi tích cực.
                  </p>
                  <p>
                    Được truyền cảm hứng từ di sản này, chúng tôi kết nối những tình nguyện viên đầy nhiệt huyết với những cơ hội ý nghĩa để phục vụ cộng đồng của họ và tạo ra sự khác biệt thực sự. Chúng tôi tin rằng mỗi hành động tình nguyện, dù lớn hay nhỏ, đều góp phần xây dựng một xã hội mạnh mẽ và nhân ái hơn.
                  </p>
                  <p className="font-semibold text-[#467057]">
                    Hãy tham gia cùng chúng tôi để tiếp tục tinh thần cách mạng bằng cách dành thời gian, kỹ năng và trái tim của bạn cho những mục tiêu quan trọng. Cùng nhau, chúng ta có thể tạo ra tác động lâu dài — giống như những người đi trước đã làm.
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
                Giá trị <span className="text-[#467057]">của chúng tôi</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những nguyên tắc hướng dẫn mọi việc chúng tôi làm
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tác động của chúng tôi</h2>
              <p className="text-xl text-gray-100">Những con số kể câu chuyện của chúng tôi</p>
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
                Sẵn sàng tạo ra sự khác biệt?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Tham gia cùng hàng nghìn tình nguyện viên đang tạo ra tác động trong cộng đồng của họ.
                Tìm những cơ hội phù hợp với đam mê và kỹ năng của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/duties"
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#467057] hover:bg-[#2A4B37] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  Xem các cơ hội
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-[#467057] text-[#467057] hover:bg-[#467057] hover:text-white font-semibold rounded-lg transition-colors"
                >
                  Tham gia ngay hôm nay
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
