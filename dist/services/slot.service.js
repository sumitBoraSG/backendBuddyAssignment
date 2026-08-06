import * as slotRepository from '../repositories/slot.repository.js';
import * as doctorRepository from '../repositories/doctor.repository.js';
import * as patientRepository from '../repositories/patient.repository.js';
import { AppointmentStatus } from '@prisma/client';
const ALL_SLOTS = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
];
const normalizeAppointmentDate = (dateInput) => {
    const [year, month, day] = dateInput.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
};
export const getAvailableSlots = async (doctorId, date) => {
    const targetDate = normalizeAppointmentDate(date);
    const bookedAppointments = await slotRepository.getBookedAppointments(doctorId, targetDate);
    const bookedSlots = bookedAppointments.map(appointment => appointment.appointmentTime);
    const availableSlots = ALL_SLOTS.filter(slot => !bookedSlots.includes(slot));
    return {
        doctorId,
        date,
        availableSlots,
    };
};
export const createAppointment = async (patientId, data) => {
    const appointmentDate = normalizeAppointmentDate(data.appointmentDate);
    const doctor = await doctorRepository.findDoctorById(data.doctorId);
    if (!doctor) {
        throw new Error("Doctor not found");
    }
    const patient = await patientRepository.findPatientById(patientId);
    if (!patient) {
        throw new Error("Patient not found");
    }
    if (!ALL_SLOTS.includes(data.appointmentTime)) {
        throw new Error("Invalid appointment slot");
    }
    const existingAppointment = await slotRepository.findBookedAppointment(data.doctorId, appointmentDate, data.appointmentTime);
    if (existingAppointment) {
        throw new Error("Selected slot is already booked");
    }
    return await slotRepository.createAppointment({
        doctorId: data.doctorId,
        patientId,
        appointmentDate,
        appointmentTime: data.appointmentTime,
        status: AppointmentStatus.BOOKED,
    });
};
export const getPatientAppointments = async (patientId) => {
    return slotRepository.getAppointmentsByPatientId(patientId);
};
//# sourceMappingURL=slot.service.js.map