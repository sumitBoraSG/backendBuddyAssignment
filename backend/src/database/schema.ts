import {
    pgTable,
    smallserial,
    smallint,
    varchar,
    timestamp,
    pgEnum,
    boolean,
    date,
    customType,
} from 'drizzle-orm/pg-core';

export const tstzrange = customType<{
    data: string;
    driverData: string;
}>({
    dataType() {
        return "tstzrange";
    },
});
export const userRoleEnum = pgEnum("user_role", [
    "ADMIN",
    "PATIENT",
    "DOCTOR",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
    "CONFIRMED",
    "CANCELLED",
    "REJECTED",
    "COMPLETED",
    "PENDING",
]);

export const bloodGroupEnum = pgEnum("blood_group", [
    "O+",
    "O-",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
]);

export const users = pgTable("users", {
    id: smallserial("id").primaryKey(),
    first_name: varchar("first_name", {
        length: 50,
    }).notNull(),
    last_name: varchar("last_name", {
        length: 50,
    }).notNull(),
    email: varchar("email", {
        length: 255,
    }).notNull().unique(),
    hashed_password: varchar("hashed_password", {
        length: 255,
    }).notNull(),
    role: userRoleEnum("role").notNull(),
    created_at: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
    deleted_at: timestamp("deleted_at", {
        withTimezone: true,
    }),
});

export const user_invitations = pgTable("user_invitations", {
    id: smallserial("id").primaryKey(),
    email: varchar("email", {
        length: 255,
    }).notNull(),
    role: userRoleEnum("role").notNull(),
    hashed_token: varchar("hashed_token", {
        length: 255,
    }).notNull().unique(),
    expires_at: timestamp("expires_at", {
        withTimezone: true,
    }).notNull(),
    used_at: timestamp("used_at", {
        withTimezone: true,
    }),
    created_by: smallint("created_by").notNull().references(() => users.id),
    updated_by: smallint("updated_by").notNull().references(() => (users.id)),
    revoked_at: timestamp("revoked_at", { 
        withTimezone: true,
    }),
    created_at: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull(),

});

export const specializations = pgTable("specializations", {
    id: smallserial("id").primaryKey(),

    name: varchar("name", {
        length: 100,
    }).notNull(),

    description: varchar("description", {
        length: 500,
    }),

    is_active: boolean("is_active").notNull().default(true),

    created_at: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),

    updated_at: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
});

export const patients = pgTable("patients", {
    patient_id: smallint("patient_id")
        .primaryKey()
        .references(() => users.id),

    height_cm: smallint("height_cm"),

    weight_kg: smallint("weight_kg"),

    blood_group: bloodGroupEnum("blood_group"),

    dob: date("dob"),
});

export const doctors = pgTable("doctors", {
    doctor_id: smallint("doctor_id")
        .primaryKey()
        .references(() => users.id),

    specialization_id: smallint("specialization_id")
        .notNull()
        .references(() => specializations.id),

    experience_years: smallint("experience_years")
        .notNull(),
});

export const appointments = pgTable("appointments", {
    id: smallserial("id").primaryKey(),

    patient_id: smallint("patient_id")
        .notNull()
        .references(() => patients.patient_id),

    doctor_id: smallint("doctor_id")
        .notNull()
        .references(() => doctors.doctor_id),

    status: appointmentStatusEnum("status")
        .notNull(),

    appointment_time: tstzrange("appointment_time")
        .notNull(),

    created_at: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),

    updated_at: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
});

export const doctor_availabilities = pgTable("doctor_availabilities", {
    id: smallserial("id").primaryKey(),

    doctor_id: smallint("doctor_id")
        .notNull()
        .references(() => doctors.doctor_id),

    availability_time: tstzrange("availability_time")
        .notNull(),

    created_at: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow().notNull(),

    updated_at: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow().notNull(),
});