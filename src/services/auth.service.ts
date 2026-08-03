import * as adminRepository from "../repositories/admin.repository";
import * as doctorRepository from "../repositories/doctor.repository";
import * as patientRepository from "../repositories/patient.repository";

import {comparePassword} from "../utils/password";
import {generateToken} from "../utils/jwt";

import {Role} from "../types/role";
import {User} from "../types/auth";

export const login = async ({
    email,
    password,
    role,
}: User) => {
    let user = null;

    switch (role) {
        case Role.ADMIN:
            user = await adminRepository.findAdminByEmail(email);
            break;
        case Role.DOCTOR:
            user = await doctorRepository.findDoctorByEmail(email);
            break;
        case Role.PATIENT:
            user = await patientRepository.findPatientByEmail(email);
            break;
        default:
            throw new Error("Invalid role");
    }

    if(!user) {
        throw new Error("User not found");
    }

    const matched = await comparePassword(password, user.password);

    if(!matched) {
        throw new Error("Invalid password");
    }
    const token = generateToken({uid: user.id, role: user.role});

    return {
        token,
        user: {
            uid: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role,
        },
    };
};

