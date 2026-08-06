import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authorize.middleware.d.ts.map