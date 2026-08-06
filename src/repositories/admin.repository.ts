import prisma  from "../config/prisma.js";


export const findAdminByEmail = async (email: string) => {
    return prisma.admin.findUnique({
        where: {
            email,
        },
    });
}


