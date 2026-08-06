import { User } from "../types/auth.js";
export declare const login: ({ email, password, }: User) => Promise<{
    token: string;
    user: {
        uid: string;
        firstName: string;
        lastName: string;
        email: string;
        userRole: string | null;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map