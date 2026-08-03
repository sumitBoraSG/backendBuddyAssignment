import prisma from "../config/prisma";

export const findPatientByEmail = async (email: string) => {
    return prisma.patient.findUnique({
        where: {
            email,
        },
    });
};