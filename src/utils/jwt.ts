import jwt from "jsonwebtoken";
import {JwtPayload} from "../types/auth.js";

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h",
        }
    );
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}