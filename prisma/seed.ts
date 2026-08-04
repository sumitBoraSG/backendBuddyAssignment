import {PrismaClient} from '@prisma/client';
import {hashPassword} from '../src/utils/password'

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || "");
    await prisma.admin.upsert({
        where: {
            email: process.env.ADMIN_EMAIL || "",
        },
        update: {},
        create: {
            firstName: "Sumit",
            lastName: "Bora",
            email: process.env.ADMIN_EMAIL || "",
            password: hashedPassword,
        },
    });
    console.log("Admin seeded successfully");
}

main() 
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
