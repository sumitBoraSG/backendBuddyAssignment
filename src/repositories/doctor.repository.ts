import prisma from "../config/prisma.js";
import { CreateDoctorInput } from "../types/doctor.js";
export const findDoctorByEmail = async (email: string) => {
    return prisma.doctor.findUnique({
        where: {
            email,
        },
    });
}


export const createDoctor = async (data: CreateDoctorInput, hashedPassword: string) => {
    return prisma.doctor.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
}    