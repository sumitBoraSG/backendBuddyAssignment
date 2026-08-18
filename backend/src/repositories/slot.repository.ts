import prisma from "../config/prisma.js";
import { AppointmentStatus } from '@prisma/client';


export const getBookedAppointments = async (doctorId : string, appointmentDate: Date) => {


    return prisma.appointment.findMany({

        where: {
            doctorId,
            appointmentDate: appointmentDate,
            status: {
                not: AppointmentStatus.CANCELLED,
            },
        },
        select: {
            appointmentTime: true,
        }
    });
   



}

export const findBookedAppointment = async (
    doctorId: string,
    appointmentDate: Date,
    appointmentTime: string
) => {
    return prisma.appointment.findFirst({
        where: {
            doctorId,
            appointmentDate,
            appointmentTime,
            status: {
                not: AppointmentStatus.CANCELLED,
            },

        },
    })
}

export const createAppointment = async ( data: {
    doctorId: string;
    patientId: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: AppointmentStatus;
}) => {
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
    })
}


export const getAppointmentsByPatientId = async (patientId: string) => {
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
}