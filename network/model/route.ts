export interface RouteImage {
    id: number;
    image_url: string;
    route_id: number;
}

export interface TourRoute {
    id: number;
    day_number: number;
    title: string;
    description: string;
    address?: string;
    tour_id: number;
    image?: RouteImage;
}
