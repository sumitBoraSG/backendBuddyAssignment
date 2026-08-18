export const en = {
    errors: {
        USER_NOT_FOUND: "User not found.",
        USER_ALREADY_EXISTS: "A user with this email already exists.",

        INVALID_CREDENTIALS: "Invalid email or password.",

        INVITATION_NOT_FOUND: "Invitation not found.",
        INVITATION_EXPIRED: "This invitation has expired.",
        INVITATION_ALREADY_USED: "This invitation has already been used.",

        DOCTOR_NOT_FOUND: "Doctor not found.",
        PATIENT_NOT_FOUND: "Patient not found.",

        APPOINTMENT_NOT_FOUND: "Appointment not found.",
        APPOINTMENT_CONFLICT:
            "The selected appointment time is unavailable.",

        VALIDATION_ERROR: "Invalid request data.",

        AUTH_RATE_LIMITED: "Too many login attempts. Please try again later.",

        UNAUTHORIZED: "Authentication required.",
        FORBIDDEN: "You do not have permission to perform this action.",

        INTERNAL_ERROR:
            "An unexpected error occurred.",
    },

    success: {
        USER_CREATED: "User created successfully.",
        USER_UPDATED: "User updated successfully.",

        LOGOUT_SUCCESSFUL: "Logout successful.",

        INVITATION_CREATED:
            "Invitation sent successfully.",

        APPOINTMENT_CREATED:
            "Appointment created successfully.",

        APPOINTMENT_CANCELLED:
            "Appointment cancelled successfully.",
    },
} as const;