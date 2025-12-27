import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { USER_API } from '@/utils/constant';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Trophy, Medal, Award, MessageSquare, Heart, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
/* eslint-disable react/prop-types */

const Leaderboard = ({ onViewProfile, dutyId }) => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopContributors = useCallback(async () => {
    if (!dutyId) return;

    try {
      setLoading(true);
      const res = await axios.get(`${USER_API}/top-contributors?limit=10&dutyId=${dutyId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setContributors(res.data.contributors);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải bảng xếp hạng");
    } finally {
      setLoading(false);
    }
  }, [dutyId]);

  useEffect(() => {
    if (dutyId) {
      fetchTopContributors();
    }
  }, [dutyId, fetchTopContributors]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankBadgeColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 1:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 2:
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Những Người Đóng Góp Hàng Đầu
          </CardTitle>
          <CardDescription>Tình nguyện viên có nhiều đóng góp nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467057]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contributors.length === 0) {
    return (
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Những Người Đóng Góp Hàng Đầu
          </CardTitle>
          <CardDescription>Tình nguyện viên có nhiều đóng góp nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có người đóng góp</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Những Người Đóng Góp Hàng Đầu
        </CardTitle>
        <CardDescription>Tình nguyện viên có nhiều đóng góp nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contributors.map((contributor, index) => (
            <div
              key={contributor.user._id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
              onClick={() => onViewProfile && onViewProfile(contributor.user._id)}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 flex items-center justify-center">
                {getRankIcon(index)}
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-gray-200">
                <AvatarImage src={contributor.user.profile?.profilePhoto} />
                <AvatarFallback className="bg-[#467057] text-white font-bold">
                  {contributor.user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {contributor.user.fullname}
                  </p>
                  {index < 3 && (
                    <Badge className={`${getRankBadgeColor(index)} text-xs px-2 py-0.5`}>
                      Hạng {index + 1}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{contributor.stats.posts}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{contributor.stats.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{contributor.stats.comments}</span>
                  </div>
                </div>
              </div>

              {/* View Profile Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile && onViewProfile(contributor.user._id);
                }}
                className="flex-shrink-0 p-2 text-[#467057] hover:bg-[#467057] hover:text-white rounded-lg transition-colors"
                title="Xem Hồ sơ"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;

