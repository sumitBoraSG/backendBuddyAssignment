import type { AppError } from "./appError.js";

export const isAppError = (
    error: unknown,
): error is AppError => {
    return (
        error instanceof Error &&
        "code" in error &&
        "statusCode" in error &&
        "isAppError" in error &&
        error.isAppError === true
    );
};