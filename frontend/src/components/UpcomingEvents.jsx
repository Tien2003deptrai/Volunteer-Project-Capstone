import { useEffect, useState } from "react";
import axios from "axios";
import { DUTY_API } from "@/utils/constant";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import BannerSlider from "./shared/BannerSlider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Building2,
  Users,
  AlertCircle,
  Image as ImageIcon,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpcomingEvents = () => {
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState({
    startingSoon: [],
    openRegistration: [],
    nearDeadline: []
  });
  const [activeTab, setActiveTab] = useState('startingSoon');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${DUTY_API}/upcoming`, {
        withCredentials: true
      });
      if (res.data.success) {
        setUpcomingEvents(res.data.upcomingEvents);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load upcoming events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderDutyCard = (duty) => {
    const daysUntilStart = duty.startDate ? getDaysUntil(duty.startDate) : null;
    const daysUntilDeadline = duty.deadline ? getDaysUntil(duty.deadline) : null;

    return (
      <Card
        key={duty._id}
        className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200"
        onClick={() => navigate(`/description/${duty._id}`)}
      >
        <div className="relative">
          {duty.images && duty.images.length > 0 ? (
            <img
              src={duty.images[0]}
              alt={duty.tittle}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-[#467057] to-[#2A4B37] rounded-t-lg flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-white/50" />
            </div>
          )}
          {daysUntilStart !== null && daysUntilStart >= 0 && (
            <Badge className="absolute top-3 right-3 bg-[#467057] text-white">
              {daysUntilStart === 0 ? "Starts Today" : `${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''} left`}
            </Badge>
          )}
          {daysUntilDeadline !== null && daysUntilDeadline >= 0 && daysUntilDeadline <= 3 && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              <AlertCircle className="h-3 w-3 mr-1" />
              {daysUntilDeadline === 0 ? "Deadline Today" : `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`}
            </Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
            {duty.tittle}
          </CardTitle>
          {duty.organization && (
            <CardDescription className="flex items-center gap-2 mt-1">
              <Building2 className="h-4 w-4 text-[#467057]" />
              <span>{duty.organization.name}</span>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {duty.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-[#467057]" />
                <span>{duty.location}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {duty.startDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#467057]" />
                  <span>Start: {formatDate(duty.startDate)}</span>
                </div>
              )}
              {duty.deadline && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Deadline: {formatDate(duty.deadline)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {duty.applications?.length || 0} applicant{(duty.applications?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <Button
                size="sm"
                className="bg-[#467057] hover:bg-[#2A4B37] text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/description/${duty._id}`);
                }}
              >
                Xem chi tiết
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { id: 'startingSoon', label: 'Bắt đầu sớm', icon: Sparkles, data: upcomingEvents.startingSoon },
    { id: 'openRegistration', label: 'Mở đăng ký', icon: Calendar, data: upcomingEvents.openRegistration },
    { id: 'nearDeadline', label: 'Hết hạn gần', icon: AlertCircle, data: upcomingEvents.nearDeadline }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#467057] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading upcoming events...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner Slider */}
          <div className="mb-8">
            <BannerSlider banners={[
              {
                id: 1,
                title: "Upcoming Volunteer Events",
                subtitle: "Don't miss out on exciting opportunities starting soon",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
                ctaText: "Browse All Duties",
                ctaLink: "/duties",
                gradient: "from-[#467057] to-[#2A4B37]"
              },
              {
                id: 2,
                title: "Events Starting Soon",
                subtitle: "Join volunteer activities beginning in the next 7 days",
                image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
                ctaText: "View All Events",
                ctaLink: "/upcoming",
                gradient: "from-[#2A4B37] to-[#467057]"
              },
              {
                id: 3,
                title: "Act Now - Deadlines Approaching",
                subtitle: "Apply before registration closes for these amazing opportunities",
                image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
                ctaText: "Explore Opportunities",
                ctaLink: "/browse",
                gradient: "from-[#467057] to-[#345441]"
              }
            ]} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-[#467057]" />
              Các Hoạt động Sắp Diễn Ra
            </h1>
            <p className="text-gray-600 text-lg">
              Khám phá các cơ hội tình nguyện bắt đầu sớm, mở đăng ký hoặc có thời gian hết hạn gần
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === tab.id
                      ? 'text-[#467057] border-[#467057] bg-[#467057]/5'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    <Badge className="ml-2 bg-gray-200 text-gray-700">
                      {tab.data.length}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div>
            {tabs.find(tab => tab.id === activeTab)?.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tabs.find(tab => tab.id === activeTab)?.data.map((duty) => renderDutyCard(duty))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="py-16 text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} events
                  </h3>
                  <p className="text-gray-500">
                    Check back later for new opportunities
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpcomingEvents;

