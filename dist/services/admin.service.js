import * as doctorRepository from '../repositories/doctor.repository.js';
import * as patientRepository from '../repositories/patient.repository.js';
export const checkIfDoctorExists = async (email) => {
    return doctorRepository.findDoctorByEmail(email);
};
export const checkIfPatientExists = async (email) => {
    return patientRepository.findPatientByEmail(email);
};
export const createDoctor = async (data, hashedPassword) => {
    return doctorRepository.createDoctor(data, hashedPassword);
};
export const createPatient = async (data, hashedPassword) => {
    return patientRepository.createPatient(data, hashedPassword);
};
//# sourceMappingURL=admin.service.js.map