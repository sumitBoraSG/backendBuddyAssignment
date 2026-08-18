import "dotenv/config";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

import { db, pool } from "./database/index.js";
import {
  users,
  specializations,
  patients,
  doctors,
  user_invitations,
  doctor_availabilities,
  appointments,
} from "./database/schema.js";

function readCsv<T = Record<string, string>>(filename: string): T[] {
  const filePath = path.join(
    process.cwd(),
    "dummy_seed_data",
    filename
  );

  const content = fs.readFileSync(filePath, "utf-8");

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
  }) as T[];
}

async function seed() {
  console.log("Starting seed...");

  await db.transaction(async (tx) => {
    // 1. USERS
    const userRows = readCsv("users.csv").map((row: any) => ({
      id: Number(row.id),
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      hashed_password: row.hashed_password,
      role: row.role,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      deleted_at: row.deleted_at
        ? new Date(row.deleted_at)
        : null,
    }));

    await tx.insert(users).values(userRows);

    console.log(`✓ Inserted ${userRows.length} users`);

    // 2. SPECIALIZATIONS
    const specializationRows = readCsv(
      "specializations.csv"
    ).map((row: any) => ({
      id: Number(row.id),
      name: row.name,
      description: row.description || null,
      is_active: row.is_active === "true",
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));

    await tx.insert(specializations).values(specializationRows);

    console.log(
      `✓ Inserted ${specializationRows.length} specializations`
    );

    // 3. PATIENTS
    const patientRows = readCsv("patients.csv").map(
      (row: any) => ({
        patient_id: Number(row.patient_id),
        height_cm: row.height_cm
          ? Number(row.height_cm)
          : null,
        weight_kg: row.weight_kg
          ? Number(row.weight_kg)
          : null,
        blood_group: row.blood_group || null,
        dob: row.dob || null,
      })
    );

    await tx.insert(patients).values(patientRows);

    console.log(`✓ Inserted ${patientRows.length} patients`);

    // 4. DOCTORS
    const doctorRows = readCsv("doctors.csv").map(
      (row: any) => ({
        doctor_id: Number(row.doctor_id),
        specialization_id: Number(row.specialization_id),
        experience_years: Number(row.experience_years),
      })
    );

    await tx.insert(doctors).values(doctorRows);

    console.log(`✓ Inserted ${doctorRows.length} doctors`);

    // 5. USER INVITATIONS
    const invitationRows = readCsv(
      "user_invitations.csv"
    ).map((row: any) => ({
      id: Number(row.id),
      email: row.email,
      role: row.role,
      hashed_token: row.hashed_token,
      expires_at: new Date(row.expires_at),
      used_at: row.used_at
        ? new Date(row.used_at)
        : null,
      created_by: Number(row.created_by),
      updated_by: Number(row.updated_by),
      revoked_at: row.revoked_at
        ? new Date(row.revoked_at)
        : null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));

    await tx
      .insert(user_invitations)
      .values(invitationRows);

    console.log(
      `✓ Inserted ${invitationRows.length} invitations`
    );

    // 6. DOCTOR AVAILABILITIES
    const availabilityRows = readCsv(
      "doctor_availabilities.csv"
    ).map((row: any) => ({
      id: Number(row.id),
      doctor_id: Number(row.doctor_id),

      // PostgreSQL tstzrange
      availability_time: row.availability_time,

      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));

    await tx
      .insert(doctor_availabilities)
      .values(availabilityRows);

    console.log(
      `✓ Inserted ${availabilityRows.length} availabilities`
    );

    // 7. APPOINTMENTS
    const appointmentRows = readCsv(
      "appointments.csv"
    ).map((row: any) => ({
      id: Number(row.id),
      patient_id: Number(row.patient_id),
      doctor_id: Number(row.doctor_id),
      status: row.status,

      // PostgreSQL tstzrange
      appointment_time: row.appointment_time,

      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));

    await tx.insert(appointments).values(appointmentRows);

    console.log(
      `✓ Inserted ${appointmentRows.length} appointments`
    );
  });

  console.log("Seed completed successfully.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });