import { User } from "../models/user_model.js";

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        message: "Access denied. Admin only.",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export default isAdmin;

