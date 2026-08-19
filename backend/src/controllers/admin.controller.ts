import {Request, Response} from 'express';
import prisma from '../config/prisma.js';
import { createPatientSchema } from "../validators/patient.validation.js";
import {createDoctorSchema} from "../validators/doctor.validation.js"
import {hashPassword} from '../utils/password.js'
// import {findDoctorByEmail} from '../repositories/doctor.repository.js'
import * as adminService from '../services/admin.service.js'
import {findPatientByEmail} from '../repositories/patient.repository.js'
export const createPatient = async (
    req: Request,
    res: Response
) => {
    try {
        const data = createPatientSchema.parse(req.body);

        const existingPatient = await adminService.checkIfPatientExists(data.email);

        if(existingPatient) {
            return res.status(409).json({
                message: "Patient already exists",
            });
        }

        const hashedPassword = await hashPassword(data.password || "");

        const patient = await adminService.createPatient(data, hashedPassword);

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

export const createDoctor = async (
    req: Request,
    res: Response
) => {
    try {
        const data = createDoctorSchema.parse(req.body);

        const existingDoctor = await adminService.checkIfDoctorExists(data.email);

        if(existingDoctor) {
            return res.status(409).json({
                message: "Doctor already exists",
            });
        }

        const hashedPassword = await hashPassword(data.password || "");

        const doctor = await adminService.createDoctor(data, hashedPassword);

        return res.status(201).json({
            message: "Doctor created successfully",
            doctor,
        });



    } catch (error) {

        return res.status(400).json({
        message: "Invalid request",
        error,
    });

    }
}
