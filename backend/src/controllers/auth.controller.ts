import type {
    Request,
    Response,
} from "express";


import { loginSchema } from "../validators/auth.validation.js";
import { login, logout } from "../services/auth.service.js";
import { messages } from "../constants/messages/index.js";

import {
    createAppError,
} from "../errors/index.js";

import {
    ERROR_CODES,
} from "../constants/errorCodes.js";

import {
    HTTP_STATUS,
} from "../constants/httpStatus.js";

export const loginController = async (
    req: Request,
    res: Response,
) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        throw createAppError(
            ERROR_CODES.VALIDATION_ERROR,
            HTTP_STATUS.BAD_REQUEST,
        );
    }

    const { email, password } = result.data;

    const authData = await login(
        email,
        password,
    );

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: authData,
    });
};

export const logoutController = async (
    req: Request,
    res: Response,
) => {
    await logout();

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: messages.en.success.LOGOUT_SUCCESSFUL,
    });
};