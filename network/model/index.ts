export * from './tour';
export * from './date';
export * from './image';
export * from './cost';
export * from './route';
export * from './question';
export * from './paginated';

export interface ApiResponse<T> {
    status: boolean;
    data?: T | null;
    message?: string | null;
}