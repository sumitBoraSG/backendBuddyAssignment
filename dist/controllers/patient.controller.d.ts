import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
export declare const getDoctors: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAvailableSlots: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createAppointment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPatientAppointments: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=patient.controller.d.ts.map