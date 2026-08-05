import * as adminRepository from "../repositories/admin.repository";
import * as doctorRepository from "../repositories/doctor.repository";
import * as patientRepository from "../repositories/patient.repository";

import {comparePassword} from "../utils/password";
import {generateToken} from "../utils/jwt";

import {User} from "../types/auth";

export const login = async ({
    email,
    password,
}: User) => {
    let user = null;
    let userRole = null;

    user = await adminRepository.findAdminByEmail(email);

    if (user) {
        userRole = "ADMIN";
    } else {
        user = await doctorRepository.findDoctorByEmail(email);

        if (user) {
            userRole = "DOCTOR";
        } else {
            user = await patientRepository.findPatientByEmail(email);

            if (user) {
                userRole = "PATIENT";
            }
        }
    }


    if(!user) {
        throw new Error("User not found");
    }

    const matched = await comparePassword(password, user.password);

    if(!matched) {
        throw new Error("Invalid password");
    }
    const token = generateToken({id: user.uid, role: userRole});

    return {
        token,
        user: {
            uid: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userRole,
        },
    };
};

