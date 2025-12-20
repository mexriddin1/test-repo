export interface PaginatedData<T> {
    items: T[];
    page: number;
    page_size: number;
    size: number;
    total_pages: number;
}

export interface ApiResponse<T> {
    status: boolean;
    data: PaginatedData<T>;
}
