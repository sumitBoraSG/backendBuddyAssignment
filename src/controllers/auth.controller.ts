import {Request, Response} from "express";
import * as authService from "../services/auth.service";

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {email, password, role} = req.body;
        const result = await authService.login({email, password, role});
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }catch (error) {
        if(error instanceof Error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}