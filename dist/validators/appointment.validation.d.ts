import { z } from 'zod';
export declare const createAppointmentSchema: z.ZodObject<{
    doctorId: z.ZodUUID;
    appointmentDate: z.ZodString;
    appointmentTime: z.ZodEnum<{
        "09:00": "09:00";
        "10:00": "10:00";
        "11:00": "11:00";
        "14:00": "14:00";
        "15:00": "15:00";
        "16:00": "16:00";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=appointment.validation.d.ts.map