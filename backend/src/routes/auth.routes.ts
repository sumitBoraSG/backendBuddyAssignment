import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Apply rate limiter first
router.use(loginRateLimiter);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - PATIENT
 *                   - DOCTOR
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", authController.loginController);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authenticate, authController.logoutController);

export default router;