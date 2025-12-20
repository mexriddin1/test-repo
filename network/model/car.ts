export interface Car {
    id: number;
    title: string;
    description?: string; // omitempty bo'lgani uchun optional (?) qildik
    price_per_day: number;
    seats?: number;
    luggage?: number;
    transmission?: string;
    unlimited_km: boolean;
    images?: CarImage[];
    created_at: string;
    updated_at: string;
}

export interface CarImage {
    id: number;
    image_url: string;
    position: number;
    car_id: number;
    created_at: string;
}

export interface CarBooking {
    id: number;
    name: string;
    email: string;
    phone?: string;
    people: number;
    car_id: number;
    start_date?: string | null;
    end_date?: string | null;
    created_at: string;
}