import { Duty } from "../models/duty_model.js";
const { Application } = await import("../models/application_model.js");
const { Group } = await import("../models/group_model.js");

export const postDuty = async (req, res) => {
  try {
    const { tittle, description, requirements, workDuration, experience, location, jobType, position, organizationId } = req.body;
    const userId = req.id;

    if (!tittle || !description || !requirements || !workDuration || !experience || !location || !jobType || !position || !organizationId) {
      return res.status(400).json({
        message: "Input is missing",
        success: false,
      });
    }

    const duty = await Duty.create({
      tittle,
      description,
      requirements: requirements.split(","),
      workDuration: Number(workDuration),
      experienceLevel: experience,
      location,
      jobType,
      position,
      organization: organizationId,
      created_by: userId
    });

    return res.status(201).json({
      message: "Duty created successfully",
      success: true,
      duty
    });
  } catch (error) {
    console.error("Error in postDuty:", error); // <-- Log error to console
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message, // <-- Return error message
    });
  }
};


export const getAllDuties = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const jobType = req.query.jobType || "";
    const experienceLevel = req.query.experienceLevel || "";

    const query = {};

    if (keyword) {
      query.$or = [
        { tittle: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job Type filter
    if (jobType) {
      query.jobType = { $regex: jobType, $options: 'i' };
    }

    // Experience Level filter
    if (experienceLevel) {
      query.experienceLevel = Number(experienceLevel);
    }

    const duties = await Duty.find(query).populate({
      path: "organization"
    }).sort({ createdAt: -1 });

    if (!duties) {
      return res.status(404).json({
        message: "No duties found",
        success: false
      });
    }
    return res.status(200).json({
      duties,
      success: true
    });


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}
//user will get data
//Imagine you click on a job listing titled "Backend Developer". The URL for the listing might look like "/jobs/12345".Here, 12345 is the unique identifier for that job.The system uses the 12345 ID to search the database for that specific job.If found, the system returns the job details.If there’s no job with ID 12345, the system informs you that the job doesn’t exist (404 error).If the job is found, the system sends the details (title, description, company, etc.) back to you.

export const getDutyById = async (req, res) => {
  try {
    const dutyId = req.params.id;
    const duty = await Duty.findById(dutyId)
      .populate({
        path: "organization",
      })
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
          select: "fullname email profile"
        }
      });
    if (!duty) {
      return res.status(404).json({
        message: "No duty found",
        success: false
      });
    }
    return res.status(200).json({
      duty,
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAdminDuties = async (req, res) => {
  try {
    // const adminId = req.id;
    const duties = await Duty.find({})
      .populate({
        path: "organization",
        select: "name logo address website"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      duties: duties || [],
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get admin duties",
      success: false,
      error: error.message
    });
  }
}

export const getFilterOptions = async (req, res) => {
  try {
    const locations = await Duty.distinct("location");
    const jobTypes = await Duty.distinct("jobType");
    const experienceLevels = await Duty.distinct("experienceLevel");
    const sortedLocations = locations.filter(loc => loc).sort();
    const sortedJobTypes = jobTypes.filter(type => type).sort();
    const sortedExperienceLevels = experienceLevels
      .filter(level => level !== null && level !== undefined)
      .sort((a, b) => a - b);

    return res.status(200).json({
      success: true,
      filters: {
        locations: sortedLocations,
        jobTypes: sortedJobTypes,
        experienceLevels: sortedExperienceLevels
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}

// Update duty (admin only)
export const updateDuty = async (req, res) => {
  try {
    const { dutyId } = req.params;
    const { tittle, description, requirements, workDuration, experience, location, jobType, position, organizationId } = req.body;
    const adminId = req.id;

    const duty = await Duty.findById(dutyId);
    if (!duty) {
      return res.status(404).json({
        message: "Duty not found",
        success: false
      });
    }

    // Check if the user is the creator of the duty
    if (duty.created_by.toString() !== adminId) {
      return res.status(403).json({
        message: "You are not authorized to update this duty",
        success: false
      });
    }

    // Update duty
    const updateData = {
      tittle,
      description,
      requirements: requirements ? requirements.split(",") : duty.requirements,
      workDuration: workDuration ? Number(workDuration) : duty.workDuration,
      experienceLevel: experience !== undefined ? experience : duty.experienceLevel,
      location: location || duty.location,
      jobType: jobType || duty.jobType,
      position: position !== undefined ? position : duty.position,
      organization: organizationId || duty.organization
    };

    const updatedDuty = await Duty.findByIdAndUpdate(
      dutyId,
      updateData,
      { new: true, runValidators: true }
    ).populate('organization', 'name logo address website');

    return res.status(200).json({
      message: "Duty updated successfully",
      success: true,
      duty: updatedDuty
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Delete duty (admin only)
export const deleteDuty = async (req, res) => {
  try {
    const { dutyId } = req.params;
    const adminId = req.id;

    const duty = await Duty.findById(dutyId);
    if (!duty) {
      return res.status(404).json({
        message: "Duty not found",
        success: false
      });
    }

    // Check if the user is the creator of the duty
    if (duty.created_by.toString() !== adminId) {
      return res.status(403).json({
        message: "You are not authorized to delete this duty",
        success: false
      });
    }
    // Delete all related applications
    await Application.deleteMany({ duty: dutyId });

    // Delete related group
    await Group.deleteOne({ duty: dutyId });

    // Delete the duty
    await Duty.findByIdAndDelete(dutyId);

    return res.status(200).json({
      message: "Duty and related data deleted successfully",
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

// Get upcoming events (within 7 days)
export const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    // Duties starting within 7 days
    const upcomingDuties = await Duty.find({
      startDate: {
        $gte: now,
        $lte: sevenDaysLater
      },
      isOpen: true
    })
      .populate({
        path: "organization",
        select: "name logo location"
      })
      .sort({ startDate: 1 })
      .limit(20);

    // Duties with open registration
    const openRegistration = await Duty.find({
      isOpen: true,
      deadline: {
        $gte: now
      }
    })
      .populate({
        path: "organization",
        select: "name logo location"
      })
      .sort({ deadline: 1 })
      .limit(20);

    // Duties near deadline (within 3 days)
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    const nearDeadline = await Duty.find({
      deadline: {
        $gte: now,
        $lte: threeDaysLater
      },
      isOpen: true
    })
      .populate({
        path: "organization",
        select: "name logo location"
      })
      .sort({ deadline: 1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      upcomingEvents: {
        startingSoon: upcomingDuties,
        openRegistration: openRegistration,
        nearDeadline: nearDeadline
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}
