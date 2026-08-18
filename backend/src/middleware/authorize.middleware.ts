import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { createAppError } from '../errors/index.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const authorize = (...roles: string[]) => (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        throw createAppError(
            ERROR_CODES.UNAUTHORIZED,
            HTTP_STATUS.UNAUTHORIZED,
        );
    }
    if (!roles.includes(req.user.role)) {
        throw createAppError(
            ERROR_CODES.FORBIDDEN,
            HTTP_STATUS.FORBIDDEN,
        );
    }
    next();
};