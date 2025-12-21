import axios from "axios";
import { ApiResponse, PaginatedData } from "../model";
import { Car, CarBooking } from "../model/car";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://185.191.141.85:8080";



export const getAllCars = async (page = 1, page_size = 10): Promise<PaginatedData<Car> | null> => {
    try {
        const { data } = await axios.get<ApiResponse<PaginatedData<Car>>>(
            `/api/cars?page=${page}&page_size=${page_size}`,
            {
                validateStatus: () => true,
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "any",
                },
            }
        )
            ;
        return data.data || null;
    } catch (e) {
        console.error("error:", e);
        throw e;
    }
}

export const getTopCars = async (): Promise<Car[]> => {
    try {
        const { data } = await axios.get<ApiResponse<Car[]>>(
            `/api/cars/top`,
            {
                validateStatus: () => true,
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "any",
                },
            }
        )
            ;
        return data.data ?? [];
    } catch (e) {
        console.error("error:", e);
        throw e;
    }
}

export const createBooking = async (model: CarBooking): Promise<boolean> => {
    try {

        const { data } = await axios.post<ApiResponse<string>>(
            `/api/car-bookings`,
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

export const findCars = async (params: {
    title?: string | null;
    min_price?: number | string | null;
    max_price?: number | string | null;
}): Promise<Car[] | null> => {
    const { title } = params || {};
    let { min_price, max_price } = params || {};

    if (!title) {
        throw new Error("Missing required query parameter: title");
    }

    if (min_price == null || min_price === "") min_price = 0;
    if (max_price == null || max_price === "") max_price = Number.MAX_SAFE_INTEGER;

    try {
        const qs = new URLSearchParams();
        qs.append("title", String(title));
        qs.append("min_price", String(min_price));
        qs.append("max_price", String(max_price));

        const url = `/api/cars/find?${qs.toString()}`;

        const { data } = await axios.get<ApiResponse<Car[]>>(url, {
            validateStatus: () => true,
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "any",
            },
        });

        return data.data || null;
    } catch (e) {
        console.error("error (findCars):", e);
        throw e;
    }
};


