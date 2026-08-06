export declare const getDoctors: (page: number, limit: number) => Promise<{
    doctors: {
        email: string;
        experience: number;
        firstName: string;
        lastName: string;
        specialization: string;
        uid: string;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
//# sourceMappingURL=doctor.service.d.ts.map