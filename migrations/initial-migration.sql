CREATE TABLE
  "admins" (
    "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()),
    "username" varchar UNIQUE NOT NULL,
    "password" varchar NOT NULL,
    "role" varchar,
    "email" varchar NOT NULL,
    "gender" varchar NOT NULL,
    "dob" date NOT NULL,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
  );

CREATE TABLE
  "doctors" (
    "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()),
    "username" varchar UNIQUE NOT NULL,
    "password" varchar NOT NULL,
    "first_name" varchar NOT NULL,
    "last_name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "gender" varchar NOT NULL,
    "dob" date NOT NULL,
    "phone" varchar NOT NULL,
    "address" text NOT NULL,
    "profile_picture" varchar NOT NULL,
    "tax" decimal,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
  );

CREATE TABLE
  "academics" (
    "id" SERIAL PRIMARY KEY,
    "degree_title" varchar NOT NULL,
    "institution" varchar NOT NULL,
    "year" integer NOT NULL,
    "doctor_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id")
  );

CREATE TABLE
  "achievements" (
    "id" SERIAL PRIMARY KEY,
    "title" varchar NOT NULL,
    "description" text NOT NULL,
    "year" integer NOT NULL,
    "doctor_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id")
  );

CREATE TABLE
  "certificates" (
    "id" SERIAL PRIMARY KEY,
    "title" varchar NOT NULL,
    "issuer" varchar NOT NULL,
    "year_obtained" integer NOT NULL,
    "doctor_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id")
  );

CREATE TABLE
  "experiences" (
    "id" SERIAL PRIMARY KEY,
    "title" varchar NOT NULL,
    "company" varchar NOT NULL,
    "description" text,
    "start_date" date,
    "end_date" date,
    "is_current" boolean DEFAULT false,
    "doctor_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id")
  );

CREATE TABLE
  "doctor_schedules" (
    "id" SERIAL PRIMARY KEY,
    "doctor_id" uuid NOT NULL,
    "day_of_week" integer NOT NULL,
    "start_at" time NOT NULL,
    "end_at" time NOT NULL,
    "is_close" boolean NOT NULL DEFAULT false,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id")
  );

CREATE TABLE
  "doctor_treatments" (
    "id" SERIAL PRIMARY KEY,
    "doctor_id" uuid NOT NULL,
    "name" text NOT NULL,
    "price" int,
    "duration" int NOT NULL,
    "duration_type" text NOT NULL,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id")
  );

CREATE TABLE
  "users" (
    "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()),
    "password" varchar NOT NULL,
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "phone" varchar UNIQUE NOT NULL,
    "nik" varchar,
    "profile_picture" varchar,
    "gender" varchar NOT NULL,
    "dob" date NOT NULL,
    "created_by" varchar NOT NULL,
    "deleted_at" timestamp,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
  );

CREATE TABLE
  "user_appointment" (
    "id" SERIAL PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "doctor_id" uuid NOT NULL,
    "appointment_date" timestamp,
    "treatment" text,
    "duration" varchar,
    "duration_type" varchar,
    "deleted_at" timestamp,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id")
  );

CREATE TABLE
  "user_files" (
    "id" SERIAL PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "type" varchar,
    "path" varchar,
    "name" varchar,
    "deleted_at" timestamp,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
  );

CREATE TABLE
  "user_treatments" (
    "id" SERIAL PRIMARY KEY,
    "doctor_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "diagnosis" varchar,
    "assessment" text,
    "treatment" varchar,
    "examination_date" timestamp,
    "patient_note" varchar,
    "doctor_note" varchar,
    "deleted_at" timestamp,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
  );

CREATE TABLE
  "user_payments" (
    "id" SERIAL PRIMARY KEY,
    "doctor_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "treatment_id" integer NOT NULL,
    "status" varchar,
    "total_price" int,
    "tax" float,
    "other_payments" text,
    "method" varchar,
    "detail" text,
    "deleted_at" timestamp,
    "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
    FOREIGN KEY ("treatment_id") REFERENCES "user_treatments" ("id")
  );

CREATE TABLE
  "list_of_values" (
    "id" SERIAL PRIMARY KEY,
    "value" varchar,
    "name" varchar NOT NULL,
    "category" varchar NOT NULL
  );

CREATE TABLE
  "master_settings" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL,
    "value" varchar NOT NULL,
    "category" varchar NOT NULL,
    "is_active" boolean DEFAULT true
  );