import {Request, Response} from "express";
import * as doctorService from '../services/doctor.service.js'
export const getDoctors = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        console.log("req recieved")
        const result = await doctorService.getDoctors(page, limit);
        console.log(result + " recieved the result")
        console.log("before json");
        return res.status(200).json(result);
        console.log("after json");
    } catch(error) {
        return res.status(400).json({
        message: "Invalid request",
        error,
        });
    }

}