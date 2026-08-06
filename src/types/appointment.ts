import { z } from "zod";
import { createAppointmentSchema } from "../validators/appointment.validation.js";

export type createAppointmentInput = z.infer<typeof createAppointmentSchema>;