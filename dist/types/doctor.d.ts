import { z } from "zod";
import { createDoctorSchema } from "../validators/doctor.validation.js";
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
//# sourceMappingURL=doctor.d.ts.map