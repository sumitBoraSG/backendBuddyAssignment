import type {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    isAppError,
} from "../errors/isAppError.js";

import {
    HTTP_STATUS,
} from "../constants/httpStatus.js";

import {
    ERROR_CODES,
} from "../constants/errorCodes.js";

import {
    translate,
} from "../constants/messages/translator.js";

import {
    logger,
} from "../logger/logger.js";

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (isAppError(error)) {
        logger.warn(
            {
                requestId: req.requestId,
                code: error.code,
                statusCode: error.statusCode,
                method: req.method,
                path: req.originalUrl,
            },
            "Application error",
        );

        return res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: translate(error.code),
            },
        });
    }

    logger.error(
        {
            err: error,
            requestId: req.requestId,
            method: req.method,
            path: req.originalUrl,
        },
        "Unhandled error",
    );

    return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
            success: false,
            error: {
                code: ERROR_CODES.INTERNAL_ERROR,
                message: translate(
                    ERROR_CODES.INTERNAL_ERROR,
                ),
            },
        });
};