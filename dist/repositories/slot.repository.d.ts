import { AppointmentStatus } from '@prisma/client';
export declare const getBookedAppointments: (doctorId: string, appointmentDate: Date) => Promise<{
    appointmentTime: string;
}[]>;
export declare const findBookedAppointment: (doctorId: string, appointmentDate: Date, appointmentTime: string) => Promise<{
    uid: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    patientId: string;
    doctorId: string;
} | null>;
export declare const createAppointment: (data: {
    doctorId: string;
    patientId: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: AppointmentStatus;
}) => Promise<{
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
export declare const getAppointmentsByPatientId: (patientId: string) => Promise<({
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
//# sourceMappingURL=slot.repository.d.ts.map