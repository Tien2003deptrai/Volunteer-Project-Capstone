import { User } from "../models/user_model.js";
import { Duty } from "../models/duty_model.js";
import { Organization } from "../models/organization_model.js";
import { Application } from "../models/application_model.js";
import { Group } from "../models/group_model.js";
import { Post } from "../models/post_model.js";
import { Report } from "../models/report_model.js";
import { Comment } from "../models/comment_model.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalDuties = await Duty.countDocuments();
    const totalOrganizations = await Organization.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalPosts = await Post.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Recent activities
    const recentDuties = await Duty.find()
      .populate('organization', 'name')
      .populate('created_by', 'fullname')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find()
      .populate('duty', 'tittle')
      .populate('applicant', 'fullname email')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalDuties,
        totalOrganizations,
        totalApplications,
        totalGroups,
        totalPosts,
        pendingReports
      },
      recentDuties,
      recentApplications
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        message: "Cannot delete admin user",
        success: false
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User deleted successfully",
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

// Get all posts (admin view)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'fullname email profile.profilePhoto')
      .populate('group', 'name duty')
      .populate('likes', 'fullname')
      .populate('shares', 'fullname')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'fullname email profile.profilePhoto'
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Delete post (admin)
export const deletePostAdmin = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
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

// Get all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('duty', 'tittle description')
      .populate('members', 'fullname email profile.profilePhoto')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      groups
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Add user to group (admin)
export const addUserToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    return res.status(200).json({
      message: "User added to group successfully",
      success: true,
      group
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Remove user from group (admin)
export const removeUserFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false
      });
    }

    // Remove user from group
    group.members = group.members.filter(id => id.toString() !== userId);
    await group.save();

    // Update application status to 'pending' when user is removed from group
    if (group.duty) {
      const application = await Application.findOne({
        duty: group.duty,
        applicant: userId
      });

      if (application && application.status === 'accepted') {
        application.status = 'pending';
        await application.save();
      }
    }

    // Populate group data before returning
    const populatedGroup = await Group.findById(group._id)
      .populate('duty', 'tittle description')
      .populate('members', 'fullname email profile.profilePhoto')
      .populate('created_by', 'fullname email');

    return res.status(200).json({
      message: "User removed from group successfully. Application status reset to pending.",
      success: true,
      group: populatedGroup
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Create post as admin
export const createPostAsAdmin = async (req, res) => {
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

    // Upload images if provided
    let imageUrls = [];
    if (files && files.length > 0) {
      try {
        const getDataUri = (await import('../utils/datauri.js')).default;
        const cloudinary = (await import('../utils/cloudinary.js')).default;

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

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'fullname email')
      .populate('post', 'content author')
      .populate('comment', 'content author')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reports
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

