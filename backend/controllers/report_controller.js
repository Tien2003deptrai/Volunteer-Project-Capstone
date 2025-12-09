import { Report } from "../models/report_model.js";
import { Post } from "../models/post_model.js";
import { Comment } from "../models/comment_model.js";
import { Duty } from "../models/duty_model.js";

// Create a report
export const createReport = async (req, res) => {
  try {
    const { postId, commentId, dutyId, reason, description } = req.body;
    const userId = req.id;

    if (!postId && !commentId && !dutyId) {
      return res.status(400).json({
        message: "Either postId, commentId, or dutyId is required",
        success: false
      });
    }

    if (postId) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          message: "Post not found",
          success: false
        });
      }
    }

    if (commentId) {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
          success: false
        });
      }
    }

    if (dutyId) {
      const duty = await Duty.findById(dutyId);
      if (!duty) {
        return res.status(404).json({
          message: "Duty not found",
          success: false
        });
      }
    }

    const report = await Report.create({
      reportedBy: userId,
      post: postId || null,
      comment: commentId || null,
      duty: dutyId || null,
      reason,
      description: description || ""
    });

    // Add report to post or comment
    if (postId) {
      await Post.findByIdAndUpdate(postId, {
        $push: { reports: report._id }
      });
    }

    return res.status(201).json({
      message: "Report submitted successfully",
      success: true,
      report
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Get all reports (admin only)
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'fullname email')
      .populate('post', 'content')
      .populate('comment', 'content')
      .populate('duty', 'tittle')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      reports,
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

// Update report status (admin only)
export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Report status updated",
      success: true,
      report
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

