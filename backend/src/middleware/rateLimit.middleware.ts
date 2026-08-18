import rateLimit from "express-rate-limit";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { translate } from "../constants/messages/translator.js";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: ERROR_CODES.AUTH_RATE_LIMITED,
            message: translate(ERROR_CODES.AUTH_RATE_LIMITED),
        },
    },
});
