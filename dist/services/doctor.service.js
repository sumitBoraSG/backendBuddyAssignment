import * as doctorRepository from '../repositories/doctor.repository.js';
export const getDoctors = async (page, limit) => {
    const skip = (page - 1) * limit;
    console.log("service reached");
    const doctors = await doctorRepository.getDoctors(skip, limit);
    const total = await doctorRepository.getDoctorCount();
    console.log(doctors + " returing the values");
    return {
        doctors,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
//# sourceMappingURL=doctor.service.js.map