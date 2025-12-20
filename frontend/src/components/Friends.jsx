import { useState, useEffect, useCallback } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  Users,
  Search,
  Mail,
  Heart,
  Sparkles,
  MapPin,
  Briefcase,
  Phone,
  Calendar,
  Award,
  X
} from "lucide-react";
import axios from "axios";
import { FRIEND_API } from "@/utils/constant";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFriends = useCallback(async () => {
    try {
      const res = await axios.get(`${FRIEND_API}/friends`, {
        withCredentials: true
      });
      console.log('Friends API Response:', res.data);
      if (res.data.success) {
        setFriends(res.data.friends || []);
        toast.success(`Đã tải ${res.data.count || 0} thành viên cộng đồng`);
      } else {
        toast.error(res.data.message || "Không thể tải danh sách");
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error(error.response?.data?.message || "Không thể tải danh sách cộng đồng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredFriends = friends.filter(friend =>
    friend.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#467057]"></div>
        </div>
        <Footer />
      </div>
    );
  }

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
                <Users className="h-12 w-12 text-yellow-300" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Bạn bè <span className="text-yellow-300">Cộng đồng</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100 leading-relaxed">
                Kết nối với những tình nguyện viên khác, chia sẻ trải nghiệm và cùng nhau tạo nên sự thay đổi tích cực
              </p>
            </motion.div>
          </div>
        </section>

        {/* Friends Section */}
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
                  <Users className="h-6 w-6 text-[#467057]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{friends.length}</div>
                <div className="text-sm text-gray-600">Bạn bè của bạn</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#467057]/10 rounded-full mb-3">
                  <Heart className="h-6 w-6 text-[#467057]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <div className="text-sm text-gray-600">Kết nối cộng đồng</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#467057]/10 rounded-full mb-3">
                  <Sparkles className="h-6 w-6 text-[#467057]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100+</div>
                <div className="text-sm text-gray-600">Hoạt động chung</div>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bạn bè theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-6 text-lg"
                />
              </div>
            </motion.div>

            {/* Friends Grid */}
            {filteredFriends.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => handleViewProfile(friend)}
                  >
                    {/* Header với gradient */}
                    <div className="relative h-32 bg-gradient-to-br from-[#467057]/20 to-[#2A4B37]/20 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg relative z-10">
                        <AvatarImage
                          src={friend?.profile?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                          className="object-cover"
                        />
                      </Avatar>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-900 text-center mb-2 group-hover:text-[#467057] transition-colors truncate">
                        {friend.fullname || "User"}
                      </h3>

                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-3">
                        <Mail className="h-3.5 w-3.5 text-[#467057]" />
                        <span className="truncate">{friend.email}</span>
                      </div>

                      {friend?.profile?.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 text-center">
                          {friend.profile.bio}
                        </p>
                      )}

                      {/* Additional Info */}
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        {friend?.profile?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#467057]" />
                            <span className="truncate">{friend.profile.location}</span>
                          </div>
                        )}
                        {friend?.profile?.skills && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-[#467057]" />
                            <span>{friend.profile.skills.length} kỹ năng</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(friend);
                        }}
                        className="w-full bg-[#467057] hover:bg-[#2A4B37] text-white transition-colors"
                      >
                        Xem hồ sơ
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg mb-2">
                  {searchTerm ? "Không tìm thấy bạn bè nào" : "Chưa có bạn bè"}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? "Hãy thử thay đổi từ khóa tìm kiếm" : "Hãy tham gia các hoạt động để kết nối với mọi người"}
                </p>
              </div>
            )}
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
                Mở rộng vòng kết nối của bạn
              </h2>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
                Tham gia các hoạt động tình nguyện để gặp gỡ và kết nối với những người cùng chí hướng.
              </p>
              <a
                href="/duties"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#467057] hover:bg-gray-100 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Khám phá hoạt động
              </a>
            </motion.div>
          </div>
        </section>

        {/* User Profile Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            {selectedUser && (
              <div>
                {/* Header với gradient và avatar */}
                <div className="relative h-48 bg-gradient-to-br from-[#467057] via-[#5a8a6f] to-[#345441]">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                      <AvatarImage
                        src={selectedUser?.profile?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                        className="object-cover"
                      />
                    </Avatar>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-20 px-8 pb-8">
                  {/* Name and Title */}
                  <div className="text-center mb-6">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedUser.fullname || "User"}
                      </DialogTitle>
                    </DialogHeader>
                    <Badge className="bg-[#467057]/10 text-[#467057] border-[#467057]/20 text-sm">
                      {selectedUser.role === 'user' ? 'Tình nguyện viên' : 'Quản trị viên'}
                    </Badge>
                  </div>

                  {/* Bio */}
                  {selectedUser?.profile?.bio && (
                    <div className="mb-6 text-center">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedUser.profile.bio}
                      </p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#467057]/10 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-[#467057]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedUser.email || 'Chưa cập nhật'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedUser?.phoneNumber && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#467057]/10 rounded-full flex items-center justify-center">
                            <Phone className="h-5 w-5 text-[#467057]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedUser.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedUser?.profile?.location && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#467057]/10 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-[#467057]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">Địa điểm</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedUser.profile.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#467057]/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-[#467057]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Thành viên</p>
                          <p className="text-sm font-medium text-gray-900">
                            Tham gia cộng đồng
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {selectedUser?.profile?.skills && selectedUser.profile.skills.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-[#467057]" />
                        <h3 className="text-lg font-semibold text-gray-900">Kỹ năng</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.profile.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            className="bg-white border-2 border-[#467057] text-[#467057] hover:bg-[#467057] hover:text-white transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#467057]">0</div>
                      <div className="text-sm text-gray-600">Hoạt động</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#467057]">0</div>
                      <div className="text-sm text-gray-600">Giờ tình nguyện</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#467057]">0</div>
                      <div className="text-sm text-gray-600">Bạn bè</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      className="flex-1 bg-[#467057] hover:bg-[#2A4B37] text-white"
                      onClick={handleCloseModal}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Friends;

