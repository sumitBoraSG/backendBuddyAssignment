import { eq } from "drizzle-orm";

import { db } from "../database/index.js";
import { users } from "../database/schema.js";

export const findUserByEmail = async (email: string) => {
    return db.query.users.findFirst({
        where: eq(users.email, email),
    });
};