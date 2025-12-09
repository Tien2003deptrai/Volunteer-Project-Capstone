import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminDuties, getAllDuties, getDutyById, postDuty, getFilterOptions, getUpcomingEvents } from '../controllers/duty_controller.js';

const router = express.Router();

router.route("/post").post(isAuthenticated, postDuty);
router.route("/get").get(isAuthenticated, getAllDuties);
router.route("/getadminduties").get(isAuthenticated, getAdminDuties);
router.route("/get/:id").get(isAuthenticated, getDutyById);
router.route("/filters").get(isAuthenticated, getFilterOptions);
router.route("/upcoming").get(isAuthenticated, getUpcomingEvents);

export default router;
