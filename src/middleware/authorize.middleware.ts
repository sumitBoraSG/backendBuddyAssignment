import { Response, NextFunction} from 'express';
import { AuthRequest } from './auth.middleware';

export const authorize = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }
    console.log(req.user)
    if(!roles.includes(req.user.role)) {
        console.log(req.user.role)
        return res.status(403).json({
            message: "Forbidden",
        })
    }
    next();
}