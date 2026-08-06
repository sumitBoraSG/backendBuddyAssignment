import prisma from "../config/prisma.js";
export const findPatientByEmail = async (email) => {
    return prisma.patient.findUnique({
        where: {
            email,
        },
    });
};
export const findPatientById = async (patientId) => {
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
};
export const createPatient = (data, hashedPassword) => {
    return prisma.patient.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
};
//# sourceMappingURL=patient.repository.js.map