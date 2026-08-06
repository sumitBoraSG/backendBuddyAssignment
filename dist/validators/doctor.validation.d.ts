import { z } from "zod";
export declare const createDoctorSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    experience: z.ZodNumber;
    specialization: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=doctor.validation.d.ts.map