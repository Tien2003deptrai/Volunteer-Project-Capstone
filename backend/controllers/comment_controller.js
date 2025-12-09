import { Comment } from "../models/comment_model.js";
import { Post } from "../models/post_model.js";

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false
      });
    }

    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
      parentComment: parentCommentId || null
    });

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'fullname email profile.profilePhoto')
      .populate('likes', 'fullname');

    return res.status(201).json({
      message: "Comment created successfully",
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Like/Unlike a comment
export const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false
      });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    return res.status(200).json({
      message: isLiked ? "Comment unliked" : "Comment liked",
      success: true,
      isLiked: !isLiked,
      likesCount: comment.likes.length
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own comments",
        success: false
      });
    }

    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId }
    });

    // Delete all replies
    await Comment.deleteMany({ parentComment: commentId });

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
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

