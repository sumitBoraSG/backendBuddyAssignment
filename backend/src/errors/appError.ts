import { HTTP_STATUS } from "../constants/httpStatus.js";

export type AppError = Error & {
    code: string;
    statusCode: number;
    isAppError: true;
};

export const createAppError = (
    code: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): AppError => {
    const error = new Error(code) as AppError;

    error.code = code;
    error.statusCode = statusCode;
    error.isAppError = true;

    return error;
};