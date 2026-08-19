CREATE TYPE "public"."appointment_status" AS ENUM('CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."blood_group" AS ENUM('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'PATIENT', 'DOCTOR');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"patient_id" smallint NOT NULL,
	"doctor_id" smallint NOT NULL,
	"status" "appointment_status" NOT NULL,
	"appointment_time" "tstzrange" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_availabilities" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"doctor_id" smallint NOT NULL,
	"availability_time" "tstzrange" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"doctor_id" smallint PRIMARY KEY NOT NULL,
	"specialization_id" smallint NOT NULL,
	"experience_years" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"patient_id" smallint PRIMARY KEY NOT NULL,
	"height_cm" smallint,
	"weight_kg" smallint,
	"blood_group" "blood_group",
	"dob" date
);
--> statement-breakpoint
CREATE TABLE "specializations" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_invitations" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"hashed_token" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_by" smallint NOT NULL,
	"updated_by" smallint NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_invitations_hashed_token_unique" UNIQUE("hashed_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"hashed_password" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "doctor_availabilities_doctor_id_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_doctor_id_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialization_id_specializations_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "public"."specializations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;


CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_no_doctor_overlap"
EXCLUDE USING GIST (
    "doctor_id" WITH =,
    "appointment_time" WITH &&
)

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_no_patient_overlap"
EXCLUDE USING GIST (
    "patient_id" WITH =,
    "appointment_time" WITH &&
)

ALTER TABLE "doctor_availabilities"
ADD CONSTRAINT "doctor_availability_no_overlap"
EXCLUDE USING GIST (
    "doctor_id" WITH =,
    "availability_time" WITH &&
);