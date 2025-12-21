import {ApiResponse} from '../model';
import axios from "axios";
import {Booking} from "@/network/model/booking";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://946d3a41929e.ngrok-free.app";

export const createBooking = async (model: Booking): Promise<boolean> => {
    try {
        console.log("model:", model);

        const {data} = await axios.post<ApiResponse<string>>(
            `${BASE_URL}/bookings`,
            model,
            {
                validateStatus: () => true,
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "any",
                },
            }
        )

        return data.status;
    } catch (e) {
        console.error("error:", e);
        throw e;
    }
}