import { useState, useMemo } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, MapPin, Calendar, Building2, Award, FileText, Download, History, CheckCircle2, Clock, XCircle, Bookmark, Heart, Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedDuties from "@/hooks/useGetAppliedDuties";
import AppliedDutyTable from "./AppliedDutyTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import useFavoriteStore from "@/store/favoriteStore";

const Profile = () => {
  useGetAppliedDuties();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { allAppliedDuties } = useSelector((store) => store.duty);
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavoriteStore();

  const activityHistory = useMemo(() => {
    return allAppliedDuties.filter(
      (application) => application.status === 'accepted' && application.duty
    );
  }, [allAppliedDuties]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Đã chấp nhận</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Đang chờ</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-300">Đã từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-6 border-2 border-gray-200 shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={user?.profile?.profilePhoto} />
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-white">
                      <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {user?.fullname || "Người dùng"}
                    </h1>
                    {user?.profile?.bio && (
                      <p className="text-gray-600 text-sm md:text-base mb-4 max-w-md">
                        {user.profile.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#467057]" />
                        <span>{user?.email}</span>
                      </div>
                      {user?.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Contact className="h-4 w-4 text-[#467057]" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Button
                    onClick={() => setOpen(true)}
                    className="bg-[#467057] hover:bg-[#2A4B37] text-white px-6 py-2"
                    size="lg"
                  >
                    <Pen className="h-4 w-4 mr-2" />
                    Chỉnh sửa hồ sơ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-[#467057]" />
                    Kỹ năng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.profile?.skills && user.profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.profile.skills.map((item, index) => (
                        <Badge
                          key={index}
                          className="bg-[#467057]/10 text-[#467057] border-[#467057]/20 hover:bg-[#467057]/20 px-3 py-1"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Chưa thêm kỹ năng nào</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-[#467057]" />
                    Hồ sơ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.profile?.resume ? (
                    <div className="space-y-3">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={user.profile.resume}
                        className="flex items-center gap-2 text-[#467057] hover:text-[#2A4B37] hover:underline transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm font-medium break-words">
                          {user.profile.resumeOriginalName || "Tải xuống hồ sơ"}
                        </span>
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Chưa tải lên hồ sơ nào</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[#467057]" />
                    Nghĩa vụ đã ứng tuyển
                  </CardTitle>
                  <CardDescription>
                    Xem tất cả các nghĩa vụ bạn đã ứng tuyển
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AppliedDutyTable />
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <History className="h-6 w-6 text-[#467057]" />
                    Lịch sử hoạt động
                  </CardTitle>
                  <CardDescription>
                    Các hoạt động tình nguyện đã hoàn thành và đang thực hiện của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activityHistory.length > 0 ? (
                    <div className="space-y-4">
                      {activityHistory.map((application) => (
                        <div
                          key={application._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white cursor-pointer"
                          onClick={() => navigate(`/description/${application.duty?._id}`)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900 truncate">
                                  {application.duty?.tittle || "Nghĩa vụ chưa có tiêu đề"}
                                </h3>
                                {getStatusIcon(application.status)}
                              </div>

                              {application.duty?.organization && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <Building2 className="h-4 w-4 text-[#467057]" />
                                  <span>{application.duty.organization.name}</span>
                                </div>
                              )}

                              {application.duty?.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <MapPin className="h-4 w-4 text-[#467057]" />
                                  <span>{application.duty.location}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Ứng tuyển: {formatDate(application.createdAt)}</span>
                                </div>
                                {application.duty?.createdAt && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Bắt đầu: {formatDate(application.duty.createdAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Chưa có lịch sử hoạt động</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Các nghĩa vụ đã được chấp nhận sẽ xuất hiện ở đây
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="h-6 w-6 text-[#467057] fill-current" />
                    Hoạt động yêu thích
                  </CardTitle>
                  <CardDescription>
                    Danh sách các hoạt động tình nguyện bạn đã lưu ({favorites.length})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((duty) => (
                        <div
                          key={duty._id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all bg-white relative group cursor-pointer"
                          onClick={() => navigate(`/description/${duty._id}`)}
                        >
                          {/* Image */}
                          {duty.images && duty.images.length > 0 ? (
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                              <img
                                src={duty.images[0]}
                                alt={duty.tittle}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="absolute top-2 left-2">
                                <Bookmark className="h-5 w-5 text-white fill-white drop-shadow-lg" />
                              </div>
                            </div>
                          ) : (
                            <div className="relative h-48 w-full bg-gradient-to-br from-[#467057]/20 to-[#2A4B37]/20 flex items-center justify-center">
                              <Briefcase className="h-16 w-16 text-[#467057]/30" />
                              <div className="absolute top-2 left-2">
                                <Bookmark className="h-5 w-5 text-[#467057] fill-current" />
                              </div>
                            </div>
                          )}

                          {/* Remove Button */}
                          <div className="absolute top-2 right-2 z-10">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFavorite(duty._id);
                              }}
                              className="h-8 w-8 bg-white/90 hover:bg-white text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                              title="Xóa khỏi yêu thích"
                            >
                              <XCircle className="h-5 w-5" />
                            </Button>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-3 min-h-[3rem]">
                              {duty.tittle || "Hoạt động chưa có tiêu đề"}
                            </h3>

                            {duty.organization && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Building2 className="h-4 w-4 text-[#467057] flex-shrink-0" />
                                <span className="truncate">{duty.organization.name}</span>
                              </div>
                            )}

                            {duty.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                <MapPin className="h-4 w-4 text-[#467057] flex-shrink-0" />
                                <span className="truncate">{duty.location}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                              {duty.position && (
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {duty.position} Slots
                                </Badge>
                              )}
                              {duty.jobType && (
                                <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                  {duty.jobType}
                                </Badge>
                              )}
                              {duty.workDuration && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {duty.workDuration}h
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Chưa có hoạt động yêu thích</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Click vào biểu tượng <Bookmark className="h-4 w-4 inline" /> để lưu hoạt động
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
