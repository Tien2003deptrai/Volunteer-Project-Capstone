import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { sendMessage, getConversations, getMessages, messageSSE } from '../controllers/message_controller.js';

const router = express.Router();

router.route("/send").post(isAuthenticated, sendMessage);
router.route("/conversations").get(isAuthenticated, getConversations);
router.route("/conversation/:conversationId").get(isAuthenticated, getMessages);
router.route("/sse").get(isAuthenticated, messageSSE);

export default router;

