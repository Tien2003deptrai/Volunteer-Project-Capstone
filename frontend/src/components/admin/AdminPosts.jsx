import { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API } from '@/utils/constant';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarImage } from '../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Trash2, Search, Plus, MessageSquare, Image as ImageIcon, X, Upload, Sparkles } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchGroups();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API}/posts`, {
        withCredentials: true
      });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/groups`, {
        withCredentials: true
      });
      if (res.data.success) {
        setGroups(res.data.groups);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    if (!postContent.trim() || !selectedGroup) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setCreating(true);
      const formData = new FormData();
      formData.append('groupId', selectedGroup);
      formData.append('content', postContent);

      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const res = await axios.post(
        `${ADMIN_API}/posts`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      if (res.data.success) {
        toast.success("Post created successfully");
        setShowCreateDialog(false);
        setPostContent('');
        setSelectedGroup('');
        setSelectedImages([]);
        setImagePreviews([]);
        fetchPosts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${ADMIN_API}/posts/${selectedPost._id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Post deleted successfully");
        setShowDeleteDialog(false);
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#467057]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Posts Management</h1>
            <p className="text-gray-600 mt-2">Manage all group posts</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-[#467057] hover:bg-[#2A4B37]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author?.profile?.profilePhoto} />
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{post.author?.fullname}</p>
                          <p className="text-sm text-gray-500">{post.author?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-md truncate">{post.content}</p>
                    </TableCell>
                    <TableCell>
                      {post.images && post.images.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{post.images.length}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No images</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{post.group?.name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{post.likes?.length || 0}</TableCell>
                    <TableCell>{post.comments?.length || 0}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedPost(post);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create Post Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#467057]" />
                Create New Post
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Share your thoughts and images with the group
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Group Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Select Group
                </Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-[#467057] focus:ring-[#467057]">
                    <SelectValue placeholder="Choose a group to post in..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.length > 0 ? (
                      groups.map((group) => (
                        <SelectItem key={group._id} value={group._id} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <span>{group.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-gray-500">No groups available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Post Content</Label>
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts with the group..."
                  rows={6}
                  className="resize-none border-gray-300 focus:border-[#467057] focus:ring-[#467057] text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>{postContent.length}</span>
                  <span>characters</span>
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Images
                  <span className="text-xs font-normal text-gray-500">(Max 10 images)</span>
                </Label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-[#467057] transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-[#467057] transition-colors mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold text-[#467057]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>

                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 font-medium">
                        {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} selected
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#467057] transition-colors"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              Image {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setPostContent('');
                    setSelectedGroup('');
                    setSelectedImages([]);
                    imagePreviews.forEach(url => URL.revokeObjectURL(url));
                    setImagePreviews([]);
                  }}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  className="bg-[#467057] hover:bg-[#2A4B37] min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={creating || !postContent.trim() || !selectedGroup}
                >
                  {creating ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Post
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedPost(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPosts;

