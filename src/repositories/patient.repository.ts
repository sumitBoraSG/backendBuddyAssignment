import prisma from "../config/prisma.js";
import { createPatientInput } from "../types/patient.js";
export const findPatientByEmail = async (email: string) => {
    return prisma.patient.findUnique({
        where: {
            email,
        },
    });
};

export const createPatient = (data: createPatientInput, hashedPassword: string) => {
    return prisma.patient.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
}