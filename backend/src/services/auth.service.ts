import { findUserByEmail } from "../repositories/auth.repository.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

import {
    createAppError,
} from "../errors/index.js";

import {
    ERROR_CODES,
} from "../constants/errorCodes.js";

import {
    HTTP_STATUS,
} from "../constants/httpStatus.js";

import type { Role } from "../types/role.js";

export const login = async (
    email: string,
    password: string,
) => {
    const user = await findUserByEmail(email);

    if (!user || user.deleted_at) {
        throw createAppError(
            ERROR_CODES.INVALID_CREDENTIALS,
            HTTP_STATUS.UNAUTHORIZED,
        );
    }

    const passwordMatches = await comparePassword(
        password,
        user.hashed_password,
    );

    if (!passwordMatches) {
        throw createAppError(
            ERROR_CODES.INVALID_CREDENTIALS,
            HTTP_STATUS.UNAUTHORIZED,
        );
    }

    const token = generateToken({
        id: String(user.id),
        role: user.role as Role,
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
        },
    };
};

export const logout = async () => {
    return true;
};