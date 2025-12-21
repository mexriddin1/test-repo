import { Tour, PaginatedData, ApiResponse } from '../model';
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://946d3a41929e.ngrok-free.app";

export const galAllTours = async (page = 1, page_size = 10): Promise<PaginatedData<Tour> | null> => {
    try {
        const { data } = await axios.get<ApiResponse<PaginatedData<Tour>>>(
            `${BASE_URL}/tours?page=${page}&page_size=${page_size}`,
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

export const findById = async (id: number): Promise<ApiResponse<Tour>> => {
    try {
        const { data } = await axios.get<ApiResponse<Tour>>(
            `${BASE_URL}/tours/${id}`,
            {
                validateStatus: () => true,
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "any",
                },
            }
        )

        return data;
    } catch (e) {
        console.error("error:", e);
        throw e;
    }
}

export const getTopTours = async (): Promise<Tour[]> => {
    try {
        const { data } = await axios.get<ApiResponse<Tour[]>>(
            `${BASE_URL}/tours/top`,
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

export const findTours = async (params: {
    address?: string | null;
    start?: string | null;
    end?: string | null;
    people?: string | number | null;
}): Promise<Tour[] | null> => {
    const { address, start } = params || {};
    let { end, people } = params || {};

    // address and start are required
    if (!address || !start) {
        throw new Error("Missing required query parameters: address, start");
    }

    // if end is not provided, default to start (single-day search)
    if (!end) end = start;

    // default people to 1
    if (people == null || people === "") people = 1;

    try {
        const qs = new URLSearchParams();
        qs.append("address", address);
        qs.append("start", String(start));
        qs.append("end", String(end));
        qs.append("people", String(people));

        const url = `${BASE_URL}/tours/find?${qs.toString()}`;

        const { data } = await axios.get<ApiResponse<Tour[]>>(url, {
            validateStatus: () => true,
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "any",
            },
        });

        return data.data || null;
    } catch (e) {
        console.error("error (findTours):", e);
        throw e;
    }
};


