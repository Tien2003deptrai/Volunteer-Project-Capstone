import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { applyDuty, getApplicants, getAppliedDuties, updateStatus } from '../controllers/application_controller.js';

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated,applyDuty);
router.route("/get").get(isAuthenticated,getAppliedDuties);
router.route("/:id/applicants").get(isAuthenticated,getApplicants);
router.route("/status/:id/update").post(isAuthenticated,updateStatus);

export default router;