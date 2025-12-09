import { Post } from "../models/post_model.js";
import { Group } from "../models/group_model.js";
import { Comment } from "../models/comment_model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Create a post
export const createPost = async (req, res) => {
  try {
    const { groupId, content } = req.body;
    const userId = req.id;
    const files = req.files || [];

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false
      });
    }

    // Check if user is a member
    if (!group.members.includes(userId)) {
      return res.status(403).json({
        message: "You are not a member of this group",
        success: false
      });
    }

    // Upload images if provided
    let imageUrls = [];
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map(async (file) => {
          const fileUri = getDataUri(file);
          if (fileUri && fileUri.content) {
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            return cloudResponse.secure_url;
          }
          return null;
        });
        imageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        // Continue without images if upload fails
      }
    }

    const post = await Post.create({
      group: groupId,
      author: userId,
      content,
      images: imageUrls
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'fullname email profile.profilePhoto')
      .populate('likes', 'fullname')
      .populate('shares', 'fullname');

    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      post: populatedPost
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Like/Unlike a post
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false
      });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      message: isLiked ? "Post unliked" : "Post liked",
      success: true,
      isLiked: !isLiked,
      likesCount: post.likes.length
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};


// Share a post
export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false
      });
    }

    if (!post.shares.includes(userId)) {
      post.shares.push(userId);
      await post.save();
    }

    return res.status(200).json({
      message: "Post shared successfully",
      success: true,
      sharesCount: post.shares.length
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own posts",
        success: false
      });
    }

    // Delete all comments
    await Comment.deleteMany({ post: postId });

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

