export declare const patientsRelations: import("drizzle-orm/relations").Relations<string, {
    user: import("drizzle-orm/relations").One<any, true>;
    appointments: import("drizzle-orm/relations").Many<any>;
}>;
export declare const usersRelations: import("drizzle-orm/relations").Relations<string, {
    patients: import("drizzle-orm/relations").Many<any>;
    doctors: import("drizzle-orm/relations").Many<any>;
}>;
export declare const doctorsRelations: import("drizzle-orm/relations").Relations<string, {
    user: import("drizzle-orm/relations").One<any, true>;
    specialization: import("drizzle-orm/relations").One<any, true>;
    appointments: import("drizzle-orm/relations").Many<any>;
    doctorAvailabilities: import("drizzle-orm/relations").Many<any>;
}>;
export declare const specializationsRelations: import("drizzle-orm/relations").Relations<string, {
    doctors: import("drizzle-orm/relations").Many<any>;
}>;
export declare const appointmentsRelations: import("drizzle-orm/relations").Relations<string, {
    patient: import("drizzle-orm/relations").One<any, true>;
    doctor: import("drizzle-orm/relations").One<any, true>;
}>;
export declare const doctorAvailabilitiesRelations: import("drizzle-orm/relations").Relations<string, {
    doctor: import("drizzle-orm/relations").One<any, true>;
}>;
//# sourceMappingURL=relations.d.ts.map