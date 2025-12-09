import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createReport, getAllReports, updateReportStatus } from '../controllers/report_controller.js';

const router = express.Router();

router.route("/").post(isAuthenticated, createReport);
router.route("/").get(isAuthenticated, getAllReports);
router.route("/:reportId/status").put(isAuthenticated, updateReportStatus);

export default router;

