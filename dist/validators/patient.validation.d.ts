import { z } from "zod";
export declare const createPatientSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    dob: z.ZodCoercedDate<unknown>;
    height: z.ZodNumber;
    weight: z.ZodNumber;
    bloodGroup: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=patient.validation.d.ts.map