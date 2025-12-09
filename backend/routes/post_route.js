import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { multipleUpload } from '../middlewares/multer.js';
import { createPost, toggleLikePost, sharePost, deletePost } from '../controllers/post_controller.js';

const router = express.Router();

router.route("/").post(isAuthenticated, multipleUpload, createPost);
router.route("/:postId/like").post(isAuthenticated, toggleLikePost);
router.route("/:postId/share").post(isAuthenticated, sharePost);
router.route("/:postId").delete(isAuthenticated, deletePost);

export default router;

