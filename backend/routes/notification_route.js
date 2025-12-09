import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, notificationSSE } from '../controllers/notification_controller.js';

const router = express.Router();

router.route("/").get(isAuthenticated, getNotifications);
router.route("/:notificationId/read").put(isAuthenticated, markAsRead);
router.route("/read-all").put(isAuthenticated, markAllAsRead);
router.route("/:notificationId").delete(isAuthenticated, deleteNotification);
router.route("/sse").get(isAuthenticated, notificationSSE);

export default router;

