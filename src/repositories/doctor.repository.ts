import prisma from "../config/prisma.js";
import { CreateDoctorInput } from "../types/doctor.js";
export const findDoctorByEmail = async (email: string) => {
    return prisma.doctor.findUnique({
        where: {
            email,
        },
    });
}
export const findDoctorById = async (doctorId: string) => {
    return prisma.doctor.findUnique({
        where: {
            uid: doctorId,
        },
        select: {
            uid: true,
            firstName: true,
            lastName: true,
            specialization: true,
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


export const getDoctors = async (skip: number, take: number) => {
    return await prisma.doctor.findMany({
        skip,
        take,
        select: {
            uid: true,
            firstName: true,
            lastName: true,
            email: true,
            specialization: true,
            experience: true,
        },
        orderBy: {
            firstName: "asc",
        },
    });
}

export const getDoctorCount = async () => {
  return await prisma.doctor.count();
};