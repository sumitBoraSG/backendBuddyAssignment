import { z } from "zod";
import { createPatientSchema } from "../validators/patient.validation.js";
export type createPatientInput = z.infer<typeof createPatientSchema>;
//# sourceMappingURL=patient.d.ts.map