import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  MoreVertical,
  Flag,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { POST_API, COMMENT_API, REPORT_API, GROUP_API } from '@/utils/constant';
import { useSelector } from 'react-redux';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
/* eslint-disable react/prop-types */

const PostCard = ({ post, onUpdate }) => {
  const { user } = useSelector(store => store.auth);
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => like._id === user?._id) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [sharesCount, setSharesCount] = useState(post.shares?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const handleLike = async () => {
    try {
      const res = await axios.post(`${POST_API}/${post._id}/like`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  };

  const handleShare = async () => {
    try {
      const res = await axios.post(`${POST_API}/${post._id}/share`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        setSharesCount(res.data.sharesCount);
        toast.success("Post shared!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to share post");
    }
  };


  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setIsCommenting(true);
      const res = await axios.post(
        `${COMMENT_API}/post/${post._id}`,
        { content: commentText },
        { withCredentials: true }
      );
      if (res.data.success) {
        setComments([...comments, res.data.comment]);
        setCommentText('');
        toast.success("Comment added!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await axios.delete(`${POST_API}/${post._id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Post deleted!");
        onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }

    try {
      const res = await axios.post(
        REPORT_API,
        {
          postId: post._id,
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
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author?.profile?.profilePhoto} />
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{post.author?.fullname}</p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            {post.author?._id === user?._id ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : (
              <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-red-600">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Post</DialogTitle>
                    <DialogDescription>
                      Help us understand the problem with this post
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Reason</Label>
                      <Select value={reportReason} onValueChange={setReportReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spam">Spam</SelectItem>
                          <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                          <SelectItem value="harassment">Harassment</SelectItem>
                          <SelectItem value="false_info">False Information</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description (optional)</Label>
                      <Textarea
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        placeholder="Provide more details..."
                      />
                    </div>
                    <Button onClick={handleReport} className="w-full">
                      Submit Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {post.images.map((image, idx) => (
            <div key={idx} className="relative group">
              <img
                src={image}
                alt={`Post image ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(image, '_blank')}
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={isLiked ? "text-red-600" : ""}
        >
          <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
          {likesCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          {comments.length}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5 mr-2" />
          {sharesCount}
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.author?.profile?.profilePhoto} />
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-semibold text-sm">{comment.author?.fullname}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <Button
              onClick={handleComment}
              disabled={isCommenting || !commentText.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div >
  );
};

const Group = ({ dutyId }) => {
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GROUP_API}/duty/${dutyId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setGroup(res.data.group);
        fetchPosts(res.data.group._id);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load group");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (groupId) => {
    try {
      const res = await axios.get(`${GROUP_API}/${groupId}/posts`, {
        withCredentials: true
      });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dutyId]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setSelectedImages([...selectedImages, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      setIsCreatingPost(true);
      const formData = new FormData();
      formData.append('groupId', group._id);
      formData.append('content', postContent);

      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const res = await axios.post(
        POST_API,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      if (res.data.success) {
        toast.success("Post created!");
        setPostContent('');
        setSelectedImages([]);
        setImagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
        setShowCreateDialog(false);
        fetchPosts(group._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsCreatingPost(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467057]"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Unable to load group. Please make sure you have applied to this duty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
            <p className="text-gray-600 mt-1">{group.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {group.members?.length || 0} Member{group.members?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#467057] hover:bg-[#2A4B37]">
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts with the group
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={6}
                  />
                </div>
                <div>
                  <Label>Images (Max 10)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="cursor-pointer mt-2"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border border-gray-200"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={isCreatingPost || !postContent.trim()}
                  className="w-full bg-[#467057] hover:bg-[#2A4B37]"
                >
                  {isCreatingPost ? "Posting..." : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Posts List */}
      <div>
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
            <p className="text-gray-600">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={() => fetchPosts(group._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Group;

