import { pgTable, varchar, timestamp, text, integer, uniqueIndex, serial, foreignKey, check, date, boolean, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const appointmentStatus = pgEnum("AppointmentStatus", ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING']);
export const bloodGroup = pgEnum("BloodGroup", ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']);
export const role = pgEnum("Role", ['ADMIN', 'PATIENT', 'DOCTOR']);
export const prismaMigrations = pgTable("_prisma_migrations", {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    checksum: varchar({ length: 64 }).notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
    migrationName: varchar("migration_name", { length: 255 }).notNull(),
    logs: text(),
    rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
    startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});
export const users = pgTable("users", {
    id: serial().primaryKey().notNull(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: role().notNull(),
    createdBy: integer("created_by"),
    updatedBy: integer("updated_by"),
    createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql `CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: 'string' }),
}, (table) => [
    uniqueIndex("users_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);
export const patients = pgTable("patients", {
    patientId: integer("patient_id").primaryKey().notNull(),
    heightCm: integer("height_cm"),
    weightKg: integer("weight_kg"),
    bloodGroup: bloodGroup("blood_group"),
    dob: date(),
}, (table) => [
    foreignKey({
        columns: [table.patientId],
        foreignColumns: [users.id],
        name: "patients_patient_id_fkey"
    }).onUpdate("cascade").onDelete("restrict"),
    check("patients_height_check", sql `(height_cm > 0) AND (height_cm <= 250)`),
    check("patients_weight_check", sql `(weight_kg > 0) AND (weight_kg <= 300)`),
]);
export const doctors = pgTable("doctors", {
    doctorId: integer("doctor_id").primaryKey().notNull(),
    specializationId: integer("specialization_id").notNull(),
    experienceYears: integer("experience_years").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.doctorId],
        foreignColumns: [users.id],
        name: "doctors_doctor_id_fkey"
    }).onUpdate("cascade").onDelete("restrict"),
    foreignKey({
        columns: [table.specializationId],
        foreignColumns: [specializations.id],
        name: "doctors_specialization_id_fkey"
    }).onUpdate("cascade").onDelete("restrict"),
    check("doctors_experience_check", sql `(experience_years >= 0) AND (experience_years <= 70)`),
]);
export const specializations = pgTable("specializations", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    description: varchar({ length: 500 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql `CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
}, (table) => [
    uniqueIndex("specializations_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);
export const appointments = pgTable("appointments", {
    id: serial().primaryKey().notNull(),
    patientId: integer("patient_id").notNull(),
    doctorId: integer("doctor_id").notNull(),
    status: appointmentStatus().notNull(),
    appointmentStartTime: timestamp("appointment_start_time", { precision: 3, mode: 'string' }).notNull(),
    appointmentEndTime: timestamp("appointment_end_time", { precision: 3, mode: 'string' }).notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql `CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.patientId],
        foreignColumns: [patients.patientId],
        name: "appointments_patient_id_fkey"
    }).onUpdate("cascade").onDelete("restrict"),
    foreignKey({
        columns: [table.doctorId],
        foreignColumns: [doctors.doctorId],
        name: "appointments_doctor_id_fkey"
    }).onUpdate("cascade").onDelete("restrict"),
    check("appointments_time_check", sql `appointment_end_time > appointment_start_time`),
]);
export const doctorAvailabilities = pgTable("doctor_availabilities", {
    id: serial().primaryKey().notNull(),
    doctorId: integer("doctor_id").notNull(),
    availabilityStartTime: timestamp("availability_start_time", { precision: 3, mode: 'string' }).notNull(),
    availabilityEndTime: timestamp("availability_end_time", { precision: 3, mode: 'string' }).notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql `CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.doctorId],
        foreignColumns: [doctors.doctorId],
        name: "doctor_availabilities_doctor_id_fkey"
    }).onUpdate("cascade").onDelete("restrict"),
    check("doctor_availabilities_time_check", sql `availability_end_time > availability_start_time`),
]);
//# sourceMappingURL=schema.js.map