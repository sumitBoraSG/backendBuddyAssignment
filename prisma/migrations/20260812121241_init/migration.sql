-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PATIENT', 'DOCTOR');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "patient_id" INTEGER NOT NULL,
    "height_cm" INTEGER,
    "weight_kg" INTEGER,
    "blood_group" "BloodGroup",
    "dob" DATE,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "doctor_id" INTEGER NOT NULL,
    "specialization_id" INTEGER NOT NULL,
    "experience_years" INTEGER NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "status" "AppointmentStatus" NOT NULL,
    "appointment_start_time" TIMESTAMP(3) NOT NULL,
    "appointment_end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_availabilities" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "availability_start_time" TIMESTAMP(3) NOT NULL,
    "availability_end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_availabilities_pkey" PRIMARY KEY ("id")
);

-- Enable GiST operator classes for scalar types such as INTEGER
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Patients checks
ALTER TABLE "patients"
ADD CONSTRAINT "patients_height_check"
CHECK ("height_cm" > 0 AND "height_cm" <= 250);

ALTER TABLE "patients"
ADD CONSTRAINT "patients_weight_check"
CHECK ("weight_kg" > 0 AND "weight_kg" <= 300);

-- Doctors checks
ALTER TABLE "doctors"
ADD CONSTRAINT "doctors_experience_check"
CHECK ("experience_years" >= 0 AND "experience_years" <= 70);

-- Appointment time check
ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_time_check"
CHECK ("appointment_end_time" > "appointment_start_time");

-- Availability time check
ALTER TABLE "doctor_availabilities"
ADD CONSTRAINT "doctor_availabilities_time_check"
CHECK ("availability_end_time" > "availability_start_time");

-- Prevent overlapping appointments for the same doctor
ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_doctor_no_overlap"
EXCLUDE USING GIST (
    "doctor_id" WITH =,
    tsrange(
        "appointment_start_time",
        "appointment_end_time",
        '[)'
    ) WITH &&
)
WHERE ("status" <> 'CANCELLED');

-- Prevent overlapping availability intervals for the same doctor
ALTER TABLE "doctor_availabilities"
ADD CONSTRAINT "doctor_availabilities_doctor_no_overlap"
EXCLUDE USING GIST (
    "doctor_id" WITH =,
    tsrange(
        "availability_start_time",
        "availability_end_time",
        '[)'
    ) WITH &&
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "doctor_availabilities_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
