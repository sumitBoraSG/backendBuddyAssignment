import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { createPatient } from "../controllers/admin.controller.js";
import { createDoctor } from "../controllers/admin.controller.js";
const router = Router();
router.post("/patients", authenticate, authorize("ADMIN"), createPatient);
router.post("/doctors", authenticate, authorize("ADMIN"), createDoctor);
export default router;
//# sourceMappingURL=admin.routes.js.map