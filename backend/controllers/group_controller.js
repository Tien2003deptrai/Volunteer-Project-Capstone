import { Group } from "../models/group_model.js";
import { Duty } from "../models/duty_model.js";
import { Application } from "../models/application_model.js";
import { Post } from "../models/post_model.js";

// Create or get group for a duty
export const getOrCreateGroup = async (req, res) => {
  try {
    const dutyId = req.params.dutyId;
    const userId = req.id;

    // Check if user has applied to this duty (allow pending applications too for now)
    const application = await Application.findOne({
      duty: dutyId,
      applicant: userId
    });

    if (!application) {
      return res.status(403).json({
        message: "You must apply to this duty to access the group",
        success: false
      });
    }

    // Find or create group
    let group = await Group.findOne({ duty: dutyId })
      .populate('duty')
      .populate('members', 'fullname email profile.profilePhoto')
      .populate('created_by', 'fullname email');

    if (!group) {
      const duty = await Duty.findById(dutyId);
      if (!duty) {
        return res.status(404).json({
          message: "Duty not found",
          success: false
        });
      }

      // Get all accepted applicants
      const acceptedApplications = await Application.find({
        duty: dutyId,
        status: 'accepted'
      });

      const memberIds = acceptedApplications.map(app => app.applicant);

      group = await Group.create({
        duty: dutyId,
        name: `${duty.tittle} - Group`,
        description: `Group for ${duty.tittle} volunteers`,
        members: memberIds,
        created_by: duty.created_by
      });

      group = await Group.findById(group._id)
        .populate('duty')
        .populate('members', 'fullname email profile.profilePhoto')
        .populate('created_by', 'fullname email');
    }

    return res.status(200).json({
      group,
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

// Get group posts
export const getGroupPosts = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.id;

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

    const posts = await Post.find({ group: groupId })
      .populate('author', 'fullname email profile.profilePhoto')
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
      posts,
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

// Add member to group (when application is accepted)
export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const adminId = req.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false
      });
    }

    // Check if user is admin or creator
    if (group.created_by.toString() !== adminId) {
      return res.status(403).json({
        message: "Only group creator can add members",
        success: false
      });
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    return res.status(200).json({
      message: "Member added successfully",
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

