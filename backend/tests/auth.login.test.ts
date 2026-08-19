import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { login } from "../src/services/auth.service.js";
import { generateToken, verifyToken } from "../src/utils/jwt.js";
import { hashPassword, comparePassword } from "../src/utils/password.js";
import { loginSchema } from "../src/validators/auth.validation.js";
import { loginRateLimiter } from "../src/middleware/rateLimit.middleware.js";
import { Role } from "../src/types/role.js";
import { ERROR_CODES } from "../src/constants/errorCodes.js";
import { HTTP_STATUS } from "../src/constants/httpStatus.js";
import { translate } from "../src/constants/messages/translator.js";
import { db, pool } from "../src/database/index.js";
import { users } from "../src/database/schema.js";
import { eq } from "drizzle-orm";
import express from "express";
import authRoutes from "../src/routes/auth.routes.js";
import { errorHandler } from "../src/middleware/errorHandler.middleware.js";

describe("Authentication & Login System Test Suite", () => {
    const testUserEmail = `test.user.${Date.now()}@example.com`;
    const testPassword = "Password123!";
    let testUserId: number;
    let ipCounter = 1;

    // Helper to send requests with a unique simulated IP so rate limits are cleanly isolated per test
    const makeRequest = () => {
        const ip = `10.0.0.${ipCounter++}`;
        return request(app).post("/api/auth/login").set("X-Forwarded-For", ip);
    };

    before(async () => {
        // Ensure trust proxy is enabled on app for X-Forwarded-For testing
        app.set("trust proxy", true);

        // Sync postgres sequence in case seed data inserted explicit ids
        await pool.query("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false)");

        // Create a test user in the database for deterministic integration tests
        const hashedPassword = await hashPassword(testPassword);
        const [insertedUser] = await db
            .insert(users)
            .values({
                first_name: "Test",
                last_name: "User",
                email: testUserEmail,
                hashed_password: hashedPassword,
                role: "PATIENT",
            })
            .returning();

        if (insertedUser) {
            testUserId = insertedUser.id;
        }
    });

    after(async () => {
        // Clean up test user
        if (testUserId) {
            await db.delete(users).where(eq(users.id, testUserId));
        }
        await pool.end();
    });

    describe("1. POST /api/auth/login - Happy Path", () => {
        it("should successfully log in with valid credentials and return token & user info", async () => {
            const res = await makeRequest()
                .send({
                    email: testUserEmail,
                    password: testPassword,
                });

            assert.equal(res.status, HTTP_STATUS.OK);
            assert.equal(res.body.success, true);
            assert.ok(res.body.data);
            assert.ok(res.body.data.token, "Token should be present");
            assert.equal(typeof res.body.data.token, "string");

            // User object assertions
            assert.equal(res.body.data.user.email, testUserEmail);
            assert.equal(res.body.data.user.role, "PATIENT");
            assert.equal(res.body.data.user.firstName, "Test");
            assert.equal(res.body.data.user.lastName, "User");
            assert.equal(res.body.data.user.hashed_password, undefined, "hashed_password must not be leaked");
            assert.equal(res.body.data.user.hashedPassword, undefined, "hashedPassword must not be leaked");

            // Verify JWT Token
            const decoded = verifyToken(res.body.data.token);
            assert.equal(decoded.id, String(testUserId));
            assert.equal(decoded.role, Role.PATIENT);
        });

        it("should handle email case-insensitivity and whitespace trimming", async () => {
            const res = await makeRequest()
                .send({
                    email: `  ${testUserEmail.toUpperCase()}  `,
                    password: testPassword,
                });

            assert.equal(res.status, HTTP_STATUS.OK);
            assert.equal(res.body.success, true);
            assert.equal(res.body.data.user.email, testUserEmail);
        });
    });

    describe("2. POST /api/auth/login - Validation Edge Cases (HTTP 400)", () => {
        it("should return 400 VALIDATION_ERROR when email is missing", async () => {
            const res = await makeRequest()
                .send({
                    password: "password123",
                });

            assert.equal(res.status, HTTP_STATUS.BAD_REQUEST);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.VALIDATION_ERROR);
            assert.equal(res.body.error.message, translate(ERROR_CODES.VALIDATION_ERROR));
        });

        it("should return 400 VALIDATION_ERROR when password is missing", async () => {
            const res = await makeRequest()
                .send({
                    email: "test@example.com",
                });

            assert.equal(res.status, HTTP_STATUS.BAD_REQUEST);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.VALIDATION_ERROR);
        });

        it("should return 400 VALIDATION_ERROR for empty request body", async () => {
            const res = await makeRequest()
                .send({});

            assert.equal(res.status, HTTP_STATUS.BAD_REQUEST);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.VALIDATION_ERROR);
        });

        it("should return 400 VALIDATION_ERROR for invalid email format", async () => {
            const invalidEmails = ["not-an-email", "user@", "@domain.com", "plainaddress", "user@domain..com"];

            for (const email of invalidEmails) {
                const res = await makeRequest()
                    .send({
                        email,
                        password: "password123",
                    });

                assert.equal(res.status, HTTP_STATUS.BAD_REQUEST, `Failed for email: ${email}`);
                assert.equal(res.body.success, false);
                assert.equal(res.body.error.code, ERROR_CODES.VALIDATION_ERROR);
            }
        });

        it("should return 400 VALIDATION_ERROR when password is shorter than 8 characters", async () => {
            const shortPasswords = ["1", "1234567", "short"];

            for (const password of shortPasswords) {
                const res = await makeRequest()
                    .send({
                        email: "test@example.com",
                        password,
                    });

                assert.equal(res.status, HTTP_STATUS.BAD_REQUEST, `Failed for password: ${password}`);
                assert.equal(res.body.success, false);
                assert.equal(res.body.error.code, ERROR_CODES.VALIDATION_ERROR);
            }
        });

        it("should return 400 VALIDATION_ERROR when fields have wrong data types", async () => {
            const invalidBodies = [
                { email: 12345, password: "password123" },
                { email: "test@example.com", password: 12345678 },
                { email: null, password: null },
                { email: true, password: false },
                { email: ["admin@example.com"], password: "password123" },
            ];

            for (const body of invalidBodies) {
                const res = await makeRequest()
                    .send(body);

                assert.equal(res.status, HTTP_STATUS.BAD_REQUEST);
                assert.equal(res.body.success, false);
                assert.equal(res.body.error.code, ERROR_CODES.VALIDATION_ERROR);
            }
        });
    });

    describe("3. POST /api/auth/login - Authentication Edge Cases (HTTP 401)", () => {
        it("should return 401 INVALID_CREDENTIALS for non-existent email", async () => {
            const res = await makeRequest()
                .send({
                    email: "nonexistent.user.123456@example.com",
                    password: "password123",
                });

            assert.equal(res.status, HTTP_STATUS.UNAUTHORIZED);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.INVALID_CREDENTIALS);
            assert.equal(res.body.error.message, translate(ERROR_CODES.INVALID_CREDENTIALS));
        });

        it("should return 401 INVALID_CREDENTIALS for incorrect password", async () => {
            const res = await makeRequest()
                .send({
                    email: testUserEmail,
                    password: "WrongPassword999!",
                });

            assert.equal(res.status, HTTP_STATUS.UNAUTHORIZED);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.INVALID_CREDENTIALS);
            assert.equal(res.body.error.message, translate(ERROR_CODES.INVALID_CREDENTIALS));
        });

        it("should return 401 INVALID_CREDENTIALS if user is soft-deleted", async () => {
            const deletedUserEmail = `deleted.user.${Date.now()}@example.com`;
            const hashedPassword = await hashPassword(testPassword);
            const [deletedUser] = await db
                .insert(users)
                .values({
                    first_name: "Deleted",
                    last_name: "User",
                    email: deletedUserEmail,
                    hashed_password: hashedPassword,
                    role: "PATIENT",
                    deleted_at: new Date(),
                })
                .returning();

            try {
                const res = await makeRequest()
                    .send({
                        email: deletedUserEmail,
                        password: testPassword,
                    });

                assert.equal(res.status, HTTP_STATUS.UNAUTHORIZED);
                assert.equal(res.body.success, false);
                assert.equal(res.body.error.code, ERROR_CODES.INVALID_CREDENTIALS);
            } finally {
                if (deletedUser) {
                    await db.delete(users).where(eq(users.id, deletedUser.id));
                }
            }
        });
    });

    describe("4. Rate Limiter Edge Cases", () => {
        it("should return 429 when rate limit (10 requests) is exceeded on the main login endpoint", async () => {
            const targetIp = "192.168.100.99";

            // Fire 10 requests that should pass the rate limiter
            for (let i = 0; i < 10; i++) {
                const res = await request(app)
                    .post("/api/auth/login")
                    .set("X-Forwarded-For", targetIp)
                    .send({ email: "invalid@example.com", password: "password123" });
                
                // Should return 401 (auth failure), not 429 (rate limited)
                assert.equal(res.status, HTTP_STATUS.UNAUTHORIZED);
            }

            // The 11th request must be blocked with HTTP 429
            const blockedRes = await request(app)
                .post("/api/auth/login")
                .set("X-Forwarded-For", targetIp)
                .send({ email: "invalid@example.com", password: "password123" });

            assert.equal(blockedRes.status, 429);
            assert.equal(blockedRes.body.success, false);
            assert.equal(blockedRes.body.error.code, ERROR_CODES.AUTH_RATE_LIMITED);
            assert.equal(blockedRes.body.error.message, translate(ERROR_CODES.AUTH_RATE_LIMITED));
        });
    });

    describe("5. Unit Tests for Utilities, Validation & Service", () => {
        it("should validate correct inputs with loginSchema", () => {
            const parsed = loginSchema.safeParse({
                email: "  User@Example.COM  ",
                password: "password123",
            });
            assert.equal(parsed.success, true);
            if (parsed.success) {
                assert.equal(parsed.data.email, "user@example.com");
                assert.equal(parsed.data.password, "password123");
            }
        });

        it("should hash and compare passwords accurately", async () => {
            const password = "mySecurePassword123";
            const hashed = await hashPassword(password);
            assert.notEqual(hashed, password);

            const match = await comparePassword(password, hashed);
            assert.equal(match, true);

            const mismatch = await comparePassword("wrongPassword", hashed);
            assert.equal(mismatch, false);
        });

        it("should generate and verify JWT tokens correctly", () => {
            const payload = {
                id: "123",
                role: Role.ADMIN,
            };

            const token = generateToken(payload);
            assert.equal(typeof token, "string");

            const decoded = verifyToken(token);
            assert.equal(decoded.id, "123");
            assert.equal(decoded.role, Role.ADMIN);
        });

        it("should directly call login service with valid credentials successfully", async () => {
            const result = await login(testUserEmail, testPassword);
            assert.ok(result.token);
            assert.equal(result.user.email, testUserEmail);
            assert.equal(result.user.role, "PATIENT");
            assert.equal(result.user.firstName, "Test");
            assert.equal(result.user.lastName, "User");
        });

        it("should throw AppError with 401 INVALID_CREDENTIALS when service is called with wrong password", async () => {
            await assert.rejects(
                async () => {
                    await login(testUserEmail, "IncorrectPassword123!");
                },
                (err: any) => {
                    assert.equal(err.code, ERROR_CODES.INVALID_CREDENTIALS);
                    assert.equal(err.statusCode, HTTP_STATUS.UNAUTHORIZED);
                    return true;
                }
            );
        });

        it("should throw AppError with 401 INVALID_CREDENTIALS when service is called with non-existent email", async () => {
            await assert.rejects(
                async () => {
                    await login("definitely_not_existing_user@test.org", testPassword);
                },
                (err: any) => {
                    assert.equal(err.code, ERROR_CODES.INVALID_CREDENTIALS);
                    assert.equal(err.statusCode, HTTP_STATUS.UNAUTHORIZED);
                    return true;
                }
            );
        });
    });

    describe("6. POST /api/auth/logout - Logout Flow", () => {
        it("should successfully log out when authenticated with a valid Bearer token", async () => {
            const token = generateToken({
                id: String(testUserId),
                role: Role.PATIENT,
            });

            const res = await request(app)
                .post("/api/auth/logout")
                .set("X-Forwarded-For", `10.0.1.${ipCounter++}`)
                .set("Authorization", `Bearer ${token}`);

            assert.equal(res.status, HTTP_STATUS.OK);
            assert.equal(res.body.success, true);
            assert.equal(res.body.message, "Logout successful.");
        });

        it("should return 401 UNAUTHORIZED when logging out without a token", async () => {
            const res = await request(app)
                .post("/api/auth/logout")
                .set("X-Forwarded-For", `10.0.1.${ipCounter++}`);

            assert.equal(res.status, HTTP_STATUS.UNAUTHORIZED);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.UNAUTHORIZED);
            assert.equal(res.body.error.message, translate(ERROR_CODES.UNAUTHORIZED));
        });

        it("should return 401 UNAUTHORIZED when logging out with an invalid token", async () => {
            const res = await request(app)
                .post("/api/auth/logout")
                .set("X-Forwarded-For", `10.0.1.${ipCounter++}`)
                .set("Authorization", "Bearer invalid.fake.token");

            assert.equal(res.status, HTTP_STATUS.UNAUTHORIZED);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.UNAUTHORIZED);
        });
    });

    describe("7. Middleware Standardization - Global Constants Verification", () => {
        it("should return 401 UNAUTHORIZED from authenticate middleware on protected endpoint", async () => {
            const testApp = express();
            testApp.use(express.json());
            const { authenticate } = await import("../src/middleware/auth.middleware.js");
            testApp.get("/protected", authenticate, (req, res) => res.json({ ok: true }));
            testApp.use(errorHandler);

            const res = await request(testApp).get("/protected");
            assert.equal(res.status, HTTP_STATUS.UNAUTHORIZED);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.UNAUTHORIZED);
            assert.equal(res.body.error.message, translate(ERROR_CODES.UNAUTHORIZED));
        });

        it("should return 403 FORBIDDEN from authorize middleware when role does not match", async () => {
            const testApp = express();
            testApp.use(express.json());
            const { authenticate } = await import("../src/middleware/auth.middleware.js");
            const { authorize } = await import("../src/middleware/authorize.middleware.js");

            testApp.get("/admin-only", authenticate, authorize("ADMIN"), (req, res) => res.json({ ok: true }));
            testApp.use(errorHandler);

            // Generate token with PATIENT role
            const patientToken = generateToken({
                id: "123",
                role: Role.PATIENT,
            });

            const res = await request(testApp)
                .get("/admin-only")
                .set("Authorization", `Bearer ${patientToken}`);

            assert.equal(res.status, HTTP_STATUS.FORBIDDEN);
            assert.equal(res.body.success, false);
            assert.equal(res.body.error.code, ERROR_CODES.FORBIDDEN);
            assert.equal(res.body.error.message, translate(ERROR_CODES.FORBIDDEN));
        });

        it("should allow request through authorize middleware when role matches", async () => {
            const testApp = express();
            testApp.use(express.json());
            const { authenticate } = await import("../src/middleware/auth.middleware.js");
            const { authorize } = await import("../src/middleware/authorize.middleware.js");

            testApp.get("/admin-only", authenticate, authorize("ADMIN"), (req, res) => res.json({ success: true }));
            testApp.use(errorHandler);

            // Generate token with ADMIN role
            const adminToken = generateToken({
                id: "123",
                role: Role.ADMIN,
            });

            const res = await request(testApp)
                .get("/admin-only")
                .set("Authorization", `Bearer ${adminToken}`);

            assert.equal(res.status, HTTP_STATUS.OK);
            assert.equal(res.body.success, true);
        });
    });
});
