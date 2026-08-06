import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

import * as patientController from '../controllers/patient.controller.js'

const router = Router();

router.get("/doctors", authenticate, patientController.getDoctors);
router.get("/slots/:doctorId", authenticate, patientController.getAvailableSlots);
router.post("/appointments", authenticate, authorize("PATIENT"), patientController.createAppointment);

export default router;