import * as doctorService from '../services/doctor.service.js';
import * as slotService from '../services/slot.service.js';
import { createAppointmentSchema } from "../validators/appointment.validation.js";
export const getDoctors = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await doctorService.getDoctors(page, limit);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({
            message: "Invalid request",
            error,
        });
    }
};
export const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;
        if (!date || typeof date !== "string") {
            return res.status(400).json({
                message: "data query parameter is required",
            });
        }
        const result = await slotService.getAvailableSlots(doctorId, date);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch available slots",
            error,
        });
    }
};
export const createAppointment = async (req, res) => {
    try {
        const patientId = req.user.id;
        const createAppointmentInput = createAppointmentSchema.parse(req.body);
        const result = await slotService.createAppointment(patientId, createAppointmentInput);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({
            message: "Failed to create an appointment",
            error,
        });
    }
};
export const getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user.id;
        const appointments = await slotService.getPatientAppointments(patientId);
        return res.status(200).json({
            success: true,
            message: "Appointments fetched successfully.",
            data: appointments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch appointments.",
        });
    }
};
//# sourceMappingURL=patient.controller.js.map