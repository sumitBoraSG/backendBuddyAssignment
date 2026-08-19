import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { randomUUID } from "crypto";

export const requestId = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const requestId =
        req.header("x-request-id") ?? randomUUID();

    req.requestId = requestId;

    res.setHeader(
        "x-request-id",
        requestId,
    );

    next();
};