import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import * as patientController from '../controllers/patient.controller.js'

const router = Router();

router.get("/doctors", authenticate, patientController.getDoctors);

export default router;