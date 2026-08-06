import * as doctorRepository from '../repositories/doctor.repository.js'
import * as patientRepository from '../repositories/patient.repository.js'
import { CreateDoctorInput } from '../types/doctor.js';
import { createPatientInput } from '../types/patient.js';

export const checkIfDoctorExists = async (email : string) => {
    return doctorRepository.findDoctorByEmail(email);
}
export const checkIfPatientExists = async (email : string) => {
    return patientRepository.findPatientByEmail(email);
}

export const createDoctor = async (data: CreateDoctorInput, hashedPassword: string) => {
    return doctorRepository.createDoctor(data, hashedPassword);
}

export const createPatient = async (data: createPatientInput, hashedPassword: string) => {
    return patientRepository.createPatient(data, hashedPassword);
}
