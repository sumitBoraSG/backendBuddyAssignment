ALTER TABLE "appointments"
DROP CONSTRAINT "appointments_no_doctor_overlap";

ALTER TABLE "appointments"
DROP CONSTRAINT "appointments_no_patient_overlap";

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_no_doctor_overlap"
EXCLUDE USING GIST (
    "doctor_id" WITH =,
    "appointment_time" WITH &&
)
WHERE ("status" IN ('PENDING', 'CONFIRMED'));

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_no_patient_overlap"
EXCLUDE USING GIST (
    "patient_id" WITH =,
    "appointment_time" WITH &&
)
WHERE ("status" IN ('PENDING', 'CONFIRMED'));