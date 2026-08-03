import prisma  from "../config/prisma";

export const findAdminByEmail = async (email: string) => {
    return prisma.admin.findUnique({
        where: {
            email,
        },
    });
}
