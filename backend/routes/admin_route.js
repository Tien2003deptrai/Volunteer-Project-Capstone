import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAdmin from '../middlewares/isAdmin.js';
import { multipleUpload } from '../middlewares/multer.js';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllPosts,
  deletePostAdmin,
  getAllGroups,
  addUserToGroup,
  removeUserFromGroup,
  createPostAsAdmin,
  getAllReports
} from '../controllers/admin_controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(isAuthenticated);
router.use(isAdmin);

// Dashboard
router.route("/dashboard").get(getDashboardStats);

// User management
router.route("/users").get(getAllUsers);
router.route("/users/:userId").get(getUserById);
router.route("/users/:userId").delete(deleteUser);

// Post management
router.route("/posts").get(getAllPosts);
router.route("/posts").post(multipleUpload, createPostAsAdmin);
router.route("/posts/:postId").delete(deletePostAdmin);

// Group management
router.route("/groups").get(getAllGroups);
router.route("/groups/member").post(addUserToGroup);
router.route("/groups/:groupId/member/:userId").delete(removeUserFromGroup);

// Report management
router.route("/reports").get(getAllReports);

export default router;

