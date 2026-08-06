import { CreateDoctorInput } from "../types/doctor.js";
export declare const findDoctorByEmail: (email: string) => Promise<{
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    experience: number;
    specialization: string;
} | null>;
export declare const findDoctorById: (doctorId: string) => Promise<{
    firstName: string;
    lastName: string;
    specialization: string;
    uid: string;
} | null>;
export declare const createDoctor: (data: CreateDoctorInput, hashedPassword: string) => Promise<{
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    experience: number;
    specialization: string;
}>;
export declare const getDoctors: (skip: number, take: number) => Promise<{
    email: string;
    experience: number;
    firstName: string;
    lastName: string;
    specialization: string;
    uid: string;
}[]>;
export declare const getDoctorCount: () => Promise<number>;
//# sourceMappingURL=doctor.repository.d.ts.map