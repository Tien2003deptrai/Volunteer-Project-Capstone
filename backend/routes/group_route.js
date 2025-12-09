import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getOrCreateGroup, getGroupPosts, addMemberToGroup } from '../controllers/group_controller.js';

const router = express.Router();

router.route("/duty/:dutyId").get(isAuthenticated, getOrCreateGroup);
router.route("/:groupId/posts").get(isAuthenticated, getGroupPosts);
router.route("/:groupId/member").post(isAuthenticated, addMemberToGroup);

export default router;

