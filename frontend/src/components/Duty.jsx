import { Button } from "./ui/button";
import { Bookmark, MapPin, Clock, Users } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useFavoriteStore from "@/store/favoriteStore";
import { toast } from "sonner";

/* eslint-disable react/prop-types */
const Duty = ({ duty }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const isBookmarked = isFavorite(duty?._id);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(duty);
    if (isBookmarked) {
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } else {
      toast.success("Đã thêm vào danh sách yêu thích");
    }
  };

  return (
    <div
      className="group h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: '1000px',
      }}
    >
      <div
        className="h-full flex flex-col p-6 rounded-2xl bg-white border border-gray-200 overflow-hidden relative transition-all duration-500 ease-out"
        style={{
          transform: isHovered ? 'translateY(-12px) rotateX(2deg) scale(1.02)' : 'translateY(0) rotateX(0) scale(1)',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(70, 112, 87, 0.25), 0 0 0 1px rgba(70, 112, 87, 0.1)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#467057]/5 via-transparent to-[#2A4B37]/5 opacity-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Animated corner accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#467057] to-[#2A4B37] rounded-bl-full opacity-0 transition-all duration-500"
          style={{
            opacity: isHovered ? 0.1 : 0,
            transform: isHovered ? 'translate(20%, -20%) scale(1.2)' : 'translate(0, 0) scale(1)',
          }}
        />

        {/* Content wrapper with z-index for 3D effect */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#467057]/10 to-[#2A4B37]/10 rounded-full border border-[#467057]/20 transition-all duration-300 group-hover:scale-105">
              <Clock className="h-3.5 w-3.5 text-[#467057]" />
              <p className="text-xs font-semibold text-[#467057]">
                {daysAgoFunction(duty?.createdAt) === 0
                  ? "Hôm nay"
                  : `${daysAgoFunction(duty?.createdAt)} ngày trước`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className={`rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${isBookmarked
                ? 'bg-[#467057] text-white border-[#467057] hover:bg-[#2A4B37]'
                : 'border-[#467057]/30 hover:bg-[#467057] hover:text-white hover:border-[#467057]'
                }`}
              size="icon"
              title={isBookmarked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Organization Info */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#467057]/5 group-hover:to-transparent">
            <div className="relative">
              <Avatar className="w-14 h-14 border-2 border-[#467057]/20 transition-all duration-300 group-hover:border-[#467057] group-hover:scale-110">
                <AvatarImage src={duty?.organization?.logo} />
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white transition-all duration-300 group-hover:scale-125 group-hover:animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base text-gray-900 truncate transition-colors duration-300 group-hover:text-[#467057]">
                {duty?.organization?.name}
              </h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-[#467057]" />
                <p className="truncate">{duty?.organization?.location}</p>
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-grow mb-4">
            <h1 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 transition-all duration-300 group-hover:text-[#467057]">
              {duty?.tittle}
            </h1>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {duty?.description}
            </p>
          </div>

          {/* Badges with icons */}
          <div className="flex flex-wrap gap-2 mb-5">
            <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-semibold border border-green-200 transition-all duration-300 hover:scale-105 hover:shadow-md">
              <Users className="h-3.5 w-3.5 mr-1" />
              {duty?.position} Slots
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-semibold border border-orange-200 transition-all duration-300 hover:scale-105 hover:shadow-md">
              {duty?.jobType}
            </Badge>
            <Badge className="bg-gradient-to-r from-[#467057]/10 to-[#2A4B37]/10 text-[#2A4B37] font-semibold border border-[#467057]/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {duty?.workDuration} Giờ
            </Badge>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Button
              onClick={() => navigate(`/description/${duty?._id}`)}
              className="w-full bg-gradient-to-r from-[#467057] to-[#2A4B37] hover:from-[#2A4B37] hover:to-[#467057] text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                Xem chi tiết
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Button>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 0.8s ease-in-out',
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
};

export default Duty;
