import prisma from "../config/prisma.js";
import { AppointmentStatus } from '@prisma/client';
export const getBookedAppointments = async (doctorId, appointmentDate) => {
    const startOfDay = appointmentDate;
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    return prisma.appointment.findMany({
        where: {
            doctorId,
            appointmentDate: {
                gte: startOfDay,
                lt: endOfDay,
            },
            status: {
                not: AppointmentStatus.CANCELLED,
            },
        },
        select: {
            appointmentTime: true,
        }
    });
};
export const findBookedAppointment = async (doctorId, appointmentDate, appointmentTime) => {
    const startOfDay = appointmentDate;
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    return prisma.appointment.findFirst({
        where: {
            doctorId,
            appointmentDate: {
                gte: startOfDay,
                lt: endOfDay,
            },
            appointmentTime,
            status: {
                not: AppointmentStatus.CANCELLED,
            },
        },
    });
};
export const createAppointment = async (data) => {
    return prisma.appointment.create({
        data,
        select: {
            uid: true,
            appointmentDate: true,
            appointmentTime: true,
            status: true,
            doctor: {
                select: {
                    uid: true,
                    firstName: true,
                    lastName: true,
                    specialization: true,
                },
            },
            patient: {
                select: {
                    uid: true,
                    firstName: true,
                    lastName: true,
                },
            },
        }
    });
};
export const getAppointmentsByPatientId = async (patientId) => {
    return prisma.appointment.findMany({
        where: {
            patientId,
        },
        include: {
            doctor: {
                select: {
                    uid: true,
                    firstName: true,
                    lastName: true,
                    specialization: true,
                    experience: true,
                    email: true,
                },
            },
        },
        orderBy: {
            appointmentDate: "asc",
        },
    });
};
//# sourceMappingURL=slot.repository.js.map