import { relations } from "drizzle-orm/relations";
import { users, patients, doctors, specializations, appointments, doctorAvailabilities } from "./schema";

export const patientsRelations = relations(patients, ({one, many}) => ({
	user: one(users, {
		fields: [patients.patientId],
		references: [users.id]
	}),
	appointments: many(appointments),
}));

export const usersRelations = relations(users, ({many}) => ({
	patients: many(patients),
	doctors: many(doctors),
}));

export const doctorsRelations = relations(doctors, ({one, many}) => ({
	user: one(users, {
		fields: [doctors.doctorId],
		references: [users.id]
	}),
	specialization: one(specializations, {
		fields: [doctors.specializationId],
		references: [specializations.id]
	}),
	appointments: many(appointments),
	doctorAvailabilities: many(doctorAvailabilities),
}));

export const specializationsRelations = relations(specializations, ({many}) => ({
	doctors: many(doctors),
}));

export const appointmentsRelations = relations(appointments, ({one}) => ({
	patient: one(patients, {
		fields: [appointments.patientId],
		references: [patients.patientId]
	}),
	doctor: one(doctors, {
		fields: [appointments.doctorId],
		references: [doctors.doctorId]
	}),
}));

export const doctorAvailabilitiesRelations = relations(doctorAvailabilities, ({one}) => ({
	doctor: one(doctors, {
		fields: [doctorAvailabilities.doctorId],
		references: [doctors.doctorId]
	}),
}));