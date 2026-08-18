import prisma from "../config/prisma.js";
import { createPatientInput } from "../types/patient.js";
export const findPatientByEmail = async (email: string) => {
    return prisma.patient.findUnique({
        where: {
            email,
        },
    });
};

export const findPatientById = async (patientId: string) => {
    return prisma.patient.findUnique({
        where: {
            uid: patientId,
        },
        select: {
            uid: true,
            firstName: true,
            lastName: true,        
        },
    });
}

export const createPatient = (data: createPatientInput, hashedPassword: string) => {
    return prisma.patient.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
}