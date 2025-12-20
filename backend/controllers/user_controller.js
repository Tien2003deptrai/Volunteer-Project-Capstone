import { User } from "../models/user_model.js";
import { Post } from "../models/post_model.js";
import { Group } from "../models/group_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      }
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "7 days",
    });
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    console.log("Uploaded file:", req.file);
    if (!file) {
      return res
        .status(400)
        .json({ message: "File not uploaded", success: false });
    }

    const fileUri = getDataUri(file);
    console.log("File URI:", fileUri);
    if (!fileUri.content) {
      return res
        .status(400)
        .json({ message: "Invalid file format", success: false });
    }

    let cloudResponse;
    try {
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      console.log("Cloudinary Response:", cloudResponse);
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res
        .status(500)
        .json({ message: "File upload failed", success: false });
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id; //middleware authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    //updating user

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; //save cloudinary url
      user.profile.resumeOriginalName = file.originalname; //save original file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Profile update failed",
    });
  }
};

// Get user profile by ID (public profile)
export const getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Get user statistics
    const postCount = await Post.countDocuments({ author: userId });
    const totalLikes = await Post.aggregate([
      { $match: { author: userId } },
      { $project: { likesCount: { $size: "$likes" } } },
      { $group: { _id: null, total: { $sum: "$likesCount" } } }
    ]);
    const totalComments = await Post.aggregate([
      { $match: { author: userId } },
      { $project: { commentsCount: { $size: "$comments" } } },
      { $group: { _id: null, total: { $sum: "$commentsCount" } } }
    ]);

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      stats: {
        posts: postCount,
        likes: totalLikes[0]?.total || 0,
        comments: totalComments[0]?.total || 0,
      }
    };

    return res.status(200).json({
      user: userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get user profile",
      success: false,
    });
  }
};

// Get top contributors (based on post count) for a specific duty/group
export const getTopContributors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const dutyId = req.query.dutyId;

    if (!dutyId) {
      return res.status(400).json({
        message: "Duty ID is required",
        success: false,
      });
    }

    // Find group associated with this duty
    const group = await Group.findOne({ duty: dutyId });
    if (!group) {
      return res.status(200).json({
        contributors: [],
        success: true,
        message: "No group found for this duty",
      });
    }

    // Aggregate users by post count within this group
    const topContributors = await Post.aggregate([
      {
        $match: { group: group._id }
      },
      {
        $group: {
          _id: "$author",
          postCount: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalComments: { $sum: { $size: "$comments" } },
        }
      },
      {
        $sort: { postCount: -1 }
      },
      {
        $limit: limit
      }
    ]);

    // Get user details for each contributor
    const userIds = topContributors.map(contributor => contributor._id);
    if (userIds.length === 0) {
      return res.status(200).json({
        contributors: [],
        success: true,
        message: "No contributors found for this group",
      });
    }

    const users = await User.find({ _id: { $in: userIds } })
      .select('fullname email profile.profilePhoto profile.bio profile.skills role');

    // Combine user data with statistics
    const contributorsWithDetails = topContributors.map(contributor => {
      const user = users.find(u => u._id.toString() === contributor._id.toString());
      return {
        user: user ? {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          profile: user.profile,
          role: user.role,
        } : null,
        stats: {
          posts: contributor.postCount,
          likes: contributor.totalLikes,
          comments: contributor.totalComments,
        }
      };
    }).filter(item => item.user !== null); // Filter out users that don't exist

    return res.status(200).json({
      contributors: contributorsWithDetails,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get top contributors",
      success: false,
    });
  }
};
