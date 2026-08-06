import * as adminRepository from "../repositories/admin.repository.js";
import * as doctorRepository from "../repositories/doctor.repository.js";
import * as patientRepository from "../repositories/patient.repository.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
export const login = async ({ email, password, }) => {
    let user = null;
    let userRole = null;
    user = await adminRepository.findAdminByEmail(email);
    if (user) {
        userRole = "ADMIN";
    }
    else {
        user = await doctorRepository.findDoctorByEmail(email);
        if (user) {
            userRole = "DOCTOR";
        }
        else {
            user = await patientRepository.findPatientByEmail(email);
            if (user) {
                userRole = "PATIENT";
            }
        }
    }
    if (!user) {
        throw new Error("User not found");
    }
    const matched = await comparePassword(password, user.password);
    if (!matched) {
        throw new Error("Invalid password");
    }
    const token = generateToken({ id: user.uid, role: userRole });
    return {
        token,
        user: {
            uid: user.uid,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userRole,
        },
    };
};
//# sourceMappingURL=auth.service.js.map