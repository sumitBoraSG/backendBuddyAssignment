import { CreateDoctorInput } from '../types/doctor.js';
import { createPatientInput } from '../types/patient.js';
export declare const checkIfDoctorExists: (email: string) => Promise<{
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    experience: number;
    specialization: string;
} | null>;
export declare const checkIfPatientExists: (email: string) => Promise<{
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
export declare const createDoctor: (data: CreateDoctorInput, hashedPassword: string) => Promise<{
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    experience: number;
    specialization: string;
}>;
export declare const createPatient: (data: createPatientInput, hashedPassword: string) => Promise<{
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: Date;
    height: number;
    weight: number;
    bloodGroup: string;
}>;
//# sourceMappingURL=admin.service.d.ts.map