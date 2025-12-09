import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createComment, toggleLikeComment, deleteComment } from '../controllers/comment_controller.js';

const router = express.Router();

router.route("/post/:postId").post(isAuthenticated, createComment);
router.route("/:commentId/like").post(isAuthenticated, toggleLikeComment);
router.route("/:commentId").delete(isAuthenticated, deleteComment);

export default router;

