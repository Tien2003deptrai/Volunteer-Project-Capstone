import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getOrganizationById, getOrganizations, registerOrganization, updateOrganization } from '../controllers/organization_controller.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route("/register").post(isAuthenticated, singleUpload, registerOrganization);
router.route("/get").get(isAuthenticated, getOrganizations);
router.route("/get/:id").get(isAuthenticated, getOrganizationById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateOrganization);

export default router;
