import prisma from "../config/prisma";

export const findDoctorByEmail = async (email: string) => {
    return prisma.doctor.findUnique({
        where: {
            email,
        },
    });
}