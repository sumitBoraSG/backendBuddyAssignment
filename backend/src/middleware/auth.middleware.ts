import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/jwt.js";
import { createAppError } from "../errors/index.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createAppError(
            ERROR_CODES.UNAUTHORIZED,
            HTTP_STATUS.UNAUTHORIZED,
        );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw createAppError(
            ERROR_CODES.UNAUTHORIZED,
            HTTP_STATUS.UNAUTHORIZED,
        );
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch {
        throw createAppError(
            ERROR_CODES.UNAUTHORIZED,
            HTTP_STATUS.UNAUTHORIZED,
        );
    }
};