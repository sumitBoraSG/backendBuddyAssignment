import { z } from "zod";
export const createDoctorSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    experience: z.number().positive(),
    specialization: z.string().min(1),
});
//# sourceMappingURL=doctor.validation.js.map