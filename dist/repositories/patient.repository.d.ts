import { createPatientInput } from "../types/patient.js";
export declare const findPatientByEmail: (email: string) => Promise<{
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: Date;
    height: number;
    weight: number;
    bloodGroup: string;
} | null>;
export declare const findPatientById: (patientId: string) => Promise<{
    firstName: string;
    lastName: string;
    uid: string;
} | null>;
export declare const createPatient: (data: createPatientInput, hashedPassword: string) => import("@prisma/client").Prisma.Prisma__PatientClient<{
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: Date;
    height: number;
    weight: number;
    bloodGroup: string;
}, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
//# sourceMappingURL=patient.repository.d.ts.map