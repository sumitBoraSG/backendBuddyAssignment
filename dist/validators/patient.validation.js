import { z } from "zod";
export const createPatientSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    dob: z.coerce.date(),
    height: z.number().int().positive(),
    weight: z.number().int().positive(),
    bloodGroup: z.string(),
});
//# sourceMappingURL=patient.validation.js.map