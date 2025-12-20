import { TourDate } from './date';
import { TourImage } from './image';
import { TourCost } from './cost';
import { TourRoute } from './route';
import { TourQuestion } from './question';

export interface Tour {
    id: number;
    address: string;
    price: number;
    currency: string;
    days: number;
    nights: number;
    about: string;
    history: string;
    location: string;
    include_exclude: string;
    max_people: number;
    dates: TourDate[];
    images: TourImage[];
    costs: TourCost[];
    routes: TourRoute[];
    questions: TourQuestion[];
    created_at: string;
    updated_at: string;
}

