import { Organization } from '../models/organization_model.js';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerOrganization = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Organization Name is required",
        success: false
      });
    }

    // Check if organization with same name already exists
    let organization = await Organization.findOne({ name: name.trim() });
    if (organization) {
      return res.status(400).json({
        message: "Organization already exists",
        success: false
      });
    }

    // Handle logo upload if file is provided
    let logo = '';
    const file = req.file;
    if (file && file.buffer) {
      try {
        const fileUri = getDataUri(file);
        if (fileUri && fileUri.content) {
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
          if (cloudResponse && cloudResponse.secure_url) {
            logo = cloudResponse.secure_url;
          }
        }
      } catch (uploadError) {
        console.error("Error uploading logo to Cloudinary:", uploadError);
        // Continue without logo if upload fails
        // Don't fail the entire request if logo upload fails
        // Organization will be created without logo
      }
    }

    // Create organization with all fields
    organization = await Organization.create({
      name: name.trim(),
      description: description || '',
      website: website || '',
      location: location || '',
      logo: logo,
      userId: req.id
    });

    return res.status(201).json({
      message: "Organization created successfully",
      organization,
      success: true
    });
  } catch (error) {
    console.error("Error in registerOrganization:", error);
    return res.status(500).json({
      message: "Registration for Organization failed",
      error: error.message,
      success: false
    });
  }
};


//"getOrganizations" function is like being a business registry admin:
// 1. A user asks, "What companies have I registered?"
// 2. You identify them using their ID.
// 3. You search your database for all companies linked to that ID.

export const getOrganizations = async (req, res) => {
  try {
    const userId = req.id;
    const organizations = await Organization.find({ userId });
    if (!organizations) {
      return res.status(404).json({
        message: "No organizations found",
        success: false
      });
    }
    return res.status(200).json({
      organizations,
      success: true
    });
  } catch (error) {
    console.log(error);
  }
}
export const getOrganizationById = async (req, res) => {
  try {
    const organizationId = req.params.id;
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({
        message: "Organization Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      organization,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateOrganization = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };

    // Only update logo if file is provided
    const file = req.file;
    if (file && file.buffer) {
      try {
        const fileUri = getDataUri(file);
        if (fileUri && fileUri.content) {
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
          if (cloudResponse && cloudResponse.secure_url) {
            updateData.logo = cloudResponse.secure_url;
          }
        }
      } catch (uploadError) {
        console.error("Error uploading logo to Cloudinary:", uploadError);
        // Continue without updating logo if upload fails
        // Don't fail the entire update if logo upload fails
      }
    }

    const organization = await Organization.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
        success: false
      });
    }
    return res.status(200).json({
      message: "Organization updated successfully",
      organization,
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
