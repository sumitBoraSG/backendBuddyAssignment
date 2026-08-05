import {Request, Response} from 'express';
import prisma from '../config/prisma';
import { createPatientSchema } from "../validators/patient.validation";
import {hashPassword} from '../utils/password'

export const createPatient = async (
    req: Request,
    res: Response
) => {
    try {
        const data = createPatientSchema.parse(req.body);

        const existingPatient = await prisma.patient.findUnique({
            where: {
                email: data.email,
            },
        });

        if(existingPatient) {
            return res.status(409).json({
                message: "Patient already exists",
            });
        }

        const hashedPassword = await hashPassword(data.password || "");

        const patient = await prisma.patient.create({
            data: {
                ...data,
                password: hashedPassword,
            }
        })
        return res.status(201).json({
      message: "Patient created successfully",
      patient,
    });
    } catch (error) {

        return res.status(400).json({
        message: "Invalid request",
        error,
    });

    }
}
