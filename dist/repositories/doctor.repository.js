import prisma from "../config/prisma.js";
export const findDoctorByEmail = async (email) => {
    return prisma.doctor.findUnique({
        where: {
            email,
        },
    });
};
export const findDoctorById = async (doctorId) => {
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
};
export const createDoctor = async (data, hashedPassword) => {
    return prisma.doctor.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
};
export const getDoctors = async (skip, take) => {
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
};
export const getDoctorCount = async () => {
    return await prisma.doctor.count();
};
//# sourceMappingURL=doctor.repository.js.map