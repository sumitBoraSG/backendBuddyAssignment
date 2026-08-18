import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_change_in_production";

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};