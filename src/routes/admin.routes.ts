import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { createPatient } from "../controllers/admin.controller";

const router = Router();

router.post(
  "/patients",
  authenticate,
  authorize("ADMIN"),
  createPatient
);

export default router;