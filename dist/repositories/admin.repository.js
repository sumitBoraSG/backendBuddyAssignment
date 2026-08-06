import prisma from "../config/prisma.js";
export const findAdminByEmail = async (email) => {
    return prisma.admin.findUnique({
        where: {
            email,
        },
    });
};
//# sourceMappingURL=admin.repository.js.map