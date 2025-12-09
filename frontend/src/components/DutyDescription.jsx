import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API, DUTY_API, REPORT_API } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setSingleDuty } from "@/redux/dutySlice";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Avatar, AvatarImage } from "./ui/avatar";
import Group from "./Group";
import Leaderboard from "./Leaderboard";
import ViewUserProfile from "./ViewUserProfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Briefcase,
  Award,
  FileText,
  Building2,
  Globe,
  CheckCircle2,
  MessageSquare,
  Flag,
  Ban,
  AlertTriangle,
  XCircle,
  CreditCard,
  Copy,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

const DutyDescription = () => {
  const { singleDuty } = useSelector((store) => store.duty);
  const { user } = useSelector((store) => store.auth);

  const getInitialApplicationStatus = () => {
    if (!singleDuty?.applications || !user?._id) return null;
    const application = singleDuty.applications.find(
      (app) => app.applicant === user._id || app.applicant?._id === user._id
    );
    return application?.status || null;
  };

  const [applicationStatus, setApplicationStatus] = useState(getInitialApplicationStatus());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'group'
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [viewProfileUserId, setViewProfileUserId] = useState(null);
  const [showViewProfile, setShowViewProfile] = useState(false);

  const params = useParams();
  const dutyId = params.id;
  const dispatch = useDispatch();

  const dutyHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API}/apply/${dutyId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setApplicationStatus('pending');
        // Refresh duty data to get updated application
        const dutyRes = await axios.get(`${DUTY_API}/get/${dutyId}`, {
          withCredentials: true,
        });
        if (dutyRes.data.success) {
          dispatch(setSingleDuty(dutyRes.data.duty));
          const updatedApplication = dutyRes.data.duty.applications?.find(
            (app) => app.applicant === user?._id || app.applicant?._id === user?._id
          );
          if (updatedApplication) {
            setApplicationStatus(updatedApplication.status);
          }
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    const fetchSingleDuty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${DUTY_API}/get/${dutyId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleDuty(res.data.duty));
          // Find user's application status
          const userApplication = res.data.duty.applications?.find(
            (app) => app.applicant === user?._id || app.applicant?._id === user?._id
          );
          setApplicationStatus(userApplication?.status || null);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load duty details");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleDuty();
  }, [dutyId, dispatch, user?._id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExperienceLabel = (level) => {
    const labels = {
      1: "Entry Level",
      2: "Intermediate",
      3: "Advanced",
    };
    return labels[level] || `Level ${level}`;
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }

    try {
      setIsReporting(true);
      const res = await axios.post(
        REPORT_API,
        {
          dutyId: dutyId,
          reason: reportReason,
          description: reportDescription
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Report submitted successfully");
        setShowReportDialog(false);
        setReportReason('');
        setReportDescription('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsReporting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#467057] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading duty details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!singleDuty) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Duty not found</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Organization Card */}
          {singleDuty?.organization && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-gray-200 flex-shrink-0">
                  <AvatarImage src={singleDuty.organization.logo || ""} />
                </Avatar>
                <div className="flex-grow min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {singleDuty.organization.name || "Organization"}
                  </h2>
                  {singleDuty.organization.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {singleDuty.organization.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    {singleDuty.organization.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{singleDuty.organization.location}</span>
                      </div>
                    )}
                    {singleDuty.organization.website && (
                      <a
                        href={singleDuty.organization.website.startsWith('http')
                          ? singleDuty.organization.website
                          : `https://${singleDuty.organization.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#467057] hover:underline"
                      >
                        <Globe className="h-4 w-4 flex-shrink-0" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          {applicationStatus === 'accepted' && (
            <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${activeTab === 'details'
                    ? 'text-[#467057] border-b-2 border-[#467057]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <FileText className="h-5 w-5 inline-block mr-2" />
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('group')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${activeTab === 'group'
                    ? 'text-[#467057] border-b-2 border-[#467057]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <MessageSquare className="h-5 w-5 inline-block mr-2" />
                  Group
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Images Gallery */}
                {singleDuty?.images && singleDuty.images.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    {singleDuty.images.length === 1 ? (
                      <div className="relative">
                        <img
                          src={singleDuty.images[0]}
                          alt={singleDuty.tittle}
                          className="w-full h-64 md:h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImageIndex(0)}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Main Image */}
                        <div className="relative h-64 md:h-80">
                          <img
                            src={singleDuty.images[selectedImageIndex !== null ? selectedImageIndex : 0]}
                            alt={singleDuty.tittle}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImageIndex(selectedImageIndex !== null ? selectedImageIndex : 0)}
                          />
                          {singleDuty.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex(prev =>
                                    prev === null ? 0 : (prev - 1 + singleDuty.images.length) % singleDuty.images.length
                                  );
                                }}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                                aria-label="Previous image"
                              >
                                <ChevronLeft className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex(prev =>
                                    prev === null ? 0 : (prev + 1) % singleDuty.images.length
                                  );
                                }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                                aria-label="Next image"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {(selectedImageIndex !== null ? selectedImageIndex : 0) + 1} / {singleDuty.images.length}
                              </div>
                            </>
                          )}
                        </div>
                        {/* Thumbnail Strip */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {singleDuty.images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${(selectedImageIndex !== null ? selectedImageIndex : 0) === index
                                  ? 'border-[#467057] ring-2 ring-[#467057] ring-offset-2'
                                  : 'border-gray-300 hover:border-[#467057]'
                                  }`}
                              >
                                <img
                                  src={image}
                                  alt={`${singleDuty.tittle} - Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Job Header */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900">
                          {singleDuty?.tittle}
                        </h1>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowReportDialog(true)}
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                          title="Report this duty"
                        >
                          <Flag className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="text-[#467057] bg-green-50 font-semibold px-3 py-1">
                          {singleDuty?.position || 0} Slot{singleDuty?.position !== 1 ? "s" : ""}
                        </Badge>
                        <Badge className="text-[#F83002] bg-red-50 font-semibold px-3 py-1">
                          {singleDuty?.jobType}
                        </Badge>
                        <Badge className="text-[#2A4B37] bg-emerald-50 font-semibold px-3 py-1">
                          {singleDuty?.workDuration} Hour{singleDuty?.workDuration !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={applicationStatus ? null : dutyHandler}
                      disabled={!!applicationStatus}
                      size="lg"
                      className={`rounded-lg px-8 py-6 text-lg font-semibold ${applicationStatus === 'accepted'
                        ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                        : applicationStatus === 'rejected'
                          ? "bg-red-600 hover:bg-red-700 cursor-not-allowed"
                          : applicationStatus === 'pending'
                            ? "bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed"
                            : "bg-[#467057] hover:bg-[#2A4B37]"
                        }`}
                    >
                      {applicationStatus === 'accepted' ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Applied
                        </span>
                      ) : applicationStatus === 'rejected' ? (
                        <span className="flex items-center gap-2">
                          <XCircle className="h-5 w-5" />
                          Rejected
                        </span>
                      ) : applicationStatus === 'pending' ? (
                        <span className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Pending
                        </span>
                      ) : (
                        "Apply Now"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#467057]" />
                    Duty Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {singleDuty?.description || "No description available."}
                  </p>
                </div>

                {/* Requirements Section */}
                {singleDuty?.requirements && singleDuty.requirements.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#467057]" />
                      Requirements
                    </h2>
                    <ul className="space-y-3">
                      {singleDuty.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar Info */}
              <div className="space-y-6">
                {/* Quick Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 top-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Job Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#467057] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Location</p>
                        <p className="text-gray-900">{singleDuty?.location || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-[#467057] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Job Type</p>
                        <p className="text-gray-900">{singleDuty?.jobType || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-[#467057] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Experience Level</p>
                        <p className="text-gray-900">
                          {singleDuty?.experienceLevel
                            ? `${getExperienceLabel(singleDuty.experienceLevel)} (${singleDuty.experienceLevel})`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[#467057] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Work Duration</p>
                        <p className="text-gray-900">
                          {singleDuty?.workDuration || 0} Hour{singleDuty?.workDuration !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-[#467057] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Applicants</p>
                        <p className="text-gray-900">
                          {singleDuty?.applications?.length || 0} Applicant{singleDuty?.applications?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-[#467057] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Posted Date</p>
                        <p className="text-gray-900">{formatDate(singleDuty?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Info Card */}
                {singleDuty?.organization && (
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#467057]" />
                      About Organization
                    </h2>
                    {singleDuty.organization.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {singleDuty.organization.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Leaderboard */}
                <Leaderboard
                  dutyId={dutyId}
                  onViewProfile={(userId) => {
                    setViewProfileUserId(userId);
                    setShowViewProfile(true);
                  }}
                />
              </div>
            </div>
          ) : (
            /* Group Tab Content */
            <div>
              <Group dutyId={dutyId} />
            </div>
          )}
        </div>
      </main>

      {/* Image Lightbox Modal */}
      {selectedImageIndex !== null && singleDuty?.images && (
        <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black/95">
            <div className="relative w-full h-full">
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              <img
                src={singleDuty.images[selectedImageIndex]}
                alt={singleDuty.tittle}
                className="w-full h-[85vh] object-contain"
              />

              {singleDuty.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + singleDuty.images.length) % singleDuty.images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all z-50"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % singleDuty.images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all z-50"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    {selectedImageIndex + 1} / {singleDuty.images.length}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* View User Profile Dialog */}
      <ViewUserProfile
        userId={viewProfileUserId}
        open={showViewProfile}
        onOpenChange={setShowViewProfile}
      />

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <Flag className="h-5 w-5 text-red-600" />
              </div>
              Report Duty
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Help us maintain a safe and trustworthy community. Your report will be reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>Reason for Report</span>
                <span className="text-red-500">*</span>
              </Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-red-500 focus:ring-red-500">
                  <SelectValue placeholder="Choose a reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4 text-red-500" />
                      <span>Spam</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inappropriate" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>Inappropriate Content</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="false_info" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>False Information</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scam" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-red-600" />
                      <span>Scam or Fraud</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="duplicate" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Copy className="h-4 w-4 text-blue-500" />
                      <span>Duplicate Posting</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="other" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-4 w-4 text-gray-500" />
                      <span>Other</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {!reportReason && (
                <p className="text-xs text-gray-500 mt-1">Please select a reason to continue</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Additional Details
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </Label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Provide more context about why you're reporting this duty..."
                rows={5}
                className="resize-none border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500">
                {reportDescription.length} characters
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-blue-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>
                  Reports are reviewed by our moderation team. False reports may result in account restrictions.
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReportDialog(false);
                  setReportReason('');
                  setReportDescription('');
                }}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReport}
                disabled={isReporting || !reportReason}
                className="bg-red-600 hover:bg-red-700 min-w-[130px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReporting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Submit Report
                  </span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DutyDescription;
