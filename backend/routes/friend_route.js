import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { followUser, unfollowUser, getFriends, getFriendshipStatus, acceptFriendRequest } from '../controllers/friend_controller.js';

const router = express.Router();

router.route("/follow").post(isAuthenticated, followUser);
router.route("/unfollow").post(isAuthenticated, unfollowUser);
router.route("/accept").post(isAuthenticated, acceptFriendRequest);
router.route("/friends").get(isAuthenticated, getFriends);
router.route("/status/:otherUserId").get(isAuthenticated, getFriendshipStatus);

export default router;

