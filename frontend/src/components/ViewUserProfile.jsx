import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { USER_API, FRIEND_API } from '@/utils/constant';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Mail,
  Phone,
  Award,
  FileText,
  Calendar,
  Heart,
  MessageSquare,
  Trophy,
  User as UserIcon,
  UserPlus,
  UserCheck,
  UserMinus,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
/* eslint-disable react/prop-types */

const ViewUserProfile = ({ userId, open, onOpenChange }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API}/profile/${userId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchFriendshipStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${FRIEND_API}/status/${userId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setFriendshipStatus(res.data.status);
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  const handleFollow = async () => {
    try {
      const res = await axios.post(
        `${FRIEND_API}/follow`,
        { recipientId: userId },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchFriendshipStatus();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send friend request");
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await axios.post(
        `${FRIEND_API}/unfollow`,
        { friendId: userId },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setFriendshipStatus(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to unfollow");
    }
  };

  useEffect(() => {
    if (open && userId) {
      fetchUserProfile();
      fetchFriendshipStatus();
    } else {
      setUser(null);
      setFriendshipStatus(null);
    }
  }, [open, userId, fetchUserProfile, fetchFriendshipStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-[#467057] rounded-lg">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            User Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            View volunteer profile and contribution statistics
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467057]"></div>
          </div>
        ) : user ? (
          <div className="space-y-6 mt-4">
            {/* Profile Header */}
            <Card className="shadow-md border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-[#467057] shadow-lg">
                      <AvatarImage src={user.profile?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"} />
                      <AvatarFallback className="bg-[#467057] text-white text-3xl font-bold">
                        {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {user.role === 'admin' && (
                      <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {user.fullname}
                      </h2>
                      {friendshipStatus === 'accepted' && (
                        <Badge className="bg-green-500 text-white">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Friends
                        </Badge>
                      )}
                      {friendshipStatus === 'pending_sent' && (
                        <Badge className="bg-yellow-500 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {friendshipStatus === 'pending_received' && (
                        <Badge className="bg-blue-500 text-white">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Request Received
                        </Badge>
                      )}
                    </div>
                    {user.profile?.bio && (
                      <p className="text-gray-600 mb-4">{user.profile.bio}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#467057]" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#467057]" />
                        <span>{user.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#467057]" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Contribution Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-2xl font-bold text-blue-900">{user.stats?.posts || 0}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-2xl font-bold text-pink-900">{user.stats?.likes || 0}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-2xl font-bold text-green-900">{user.stats?.comments || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {user.profile?.skills && user.profile.skills.length > 0 && (
              <Card className="shadow-md border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#467057]" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <Badge key={index} className="bg-[#D0F0DD] text-[#2A4B37] font-semibold px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resume */}
            {user.profile?.resume && (
              <Card className="shadow-md border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#467057]" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={user.profile.resume}
                    className="text-blue-600 hover:underline flex items-center gap-2 break-words"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span>{user.profile.resumeOriginalName || "Download Resume"}</span>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <UserIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>User not found</p>
          </div>
        )}

        <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-200 mt-6">
          <div>
            {friendshipStatus === 'accepted' && (
              <Button
                variant="outline"
                onClick={handleUnfollow}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Unfollow
              </Button>
            )}
            {friendshipStatus === 'pending_sent' && (
              <Button
                variant="outline"
                onClick={handleUnfollow}
                className="text-gray-600"
              >
                <Clock className="h-4 w-4 mr-2" />
                Cancel Request
              </Button>
            )}
            {friendshipStatus === 'pending_received' && (
              <Button
                onClick={handleFollow}
                className="bg-[#467057] hover:bg-[#2A4B37] text-white"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Accept Request
              </Button>
            )}
            {!friendshipStatus && (
              <Button
                onClick={handleFollow}
                className="bg-[#467057] hover:bg-[#2A4B37] text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserProfile;

