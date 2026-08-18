import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { logger } from "../logger/logger.js";

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const duration =
            Number(process.hrtime.bigint() - start) /
            1_000_000;

        logger.info(
            {
                requestId: req.requestId,
                method: req.method,
                path: req.originalUrl,
                statusCode: res.statusCode,
                durationMs: Number(duration.toFixed(2)),
            },
            "HTTP request",
        );
    });

    next();
};