import { PrismaClient, Role, AppointmentStatus } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = await hashPassword(
    process.env.ADMIN_PASSWORD || ""
  );

  const admin = await prisma.users.upsert({
    where: {
      email: process.env.ADMIN_EMAIL || "",
    },
    update: {},
    create: {
      first_name: "Sumit",
      last_name: "Bora",
      email: process.env.ADMIN_EMAIL || "",
      password_hash: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin seeded successfully: ${admin.email}`);

  // Seed specializations
  const specializations = [
    {
      name: "Cardiology",
      description: "Diagnosis and treatment of heart and cardiovascular conditions.",
    },
    {
      name: "Dermatology",
      description: "Diagnosis and treatment of skin, hair, and nail conditions.",
    },
    {
      name: "Neurology",
      description: "Diagnosis and treatment of disorders of the nervous system.",
    },
    {
      name: "Pediatrics",
      description: "Medical care for infants, children, and adolescents.",
    },
    {
      name: "Orthopedics",
      description: "Diagnosis and treatment of musculoskeletal conditions.",
    },
    {
      name: "General Medicine",
      description: "Diagnosis and treatment of common and general medical conditions.",
    },
  ];

  for (const specialization of specializations) {
    await prisma.specializations.upsert({
      where: {
        name: specialization.name,
      },
      update: {
        description: specialization.description,
      },
      create: {
        name: specialization.name,
        description: specialization.description,
      },
    });
  }

  console.log("Specializations seeded successfully");


console.log("Doctor availabilities seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });