import { createAppointmentInput } from '../types/appointment.js';
export declare const getAvailableSlots: (doctorId: string, date: string) => Promise<{
    doctorId: string;
    date: string;
    availableSlots: string[];
}>;
export declare const createAppointment: (patientId: string, data: createAppointmentInput) => Promise<{
    appointmentDate: Date;
    appointmentTime: string;
    doctor: {
        firstName: string;
        lastName: string;
        specialization: string;
        uid: string;
    };
    patient: {
        firstName: string;
        lastName: string;
        uid: string;
    };
    status: import("@prisma/client").$Enums.AppointmentStatus;
    uid: string;
}>;
export declare const getPatientAppointments: (patientId: string) => Promise<({
    doctor: {
        email: string;
        experience: number;
        firstName: string;
        lastName: string;
        specialization: string;
        uid: string;
    };
} & {
    uid: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    patientId: string;
    doctorId: string;
})[]>;
//# sourceMappingURL=slot.service.d.ts.map