import { z } from 'zod';
export const createAppointmentSchema = z.object({
    doctorId: z.uuid(),
    appointmentDate: z.string().date(),
    appointmentTime: z.enum([
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
    ]),
});
//# sourceMappingURL=appointment.validation.js.map