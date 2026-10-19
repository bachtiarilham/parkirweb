/**
 * Standard Envelope Response dari Backend
 * Format: { status, message, data }
 */
export interface ApiResponse<T = unknown> {
	status: number | string;
	message: string;
	data: T;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages?: number;
}

export interface PaginatedData<T> {
	items: T[];
	meta?: PaginationMeta;
	total?: number;
	page?: number;
	limit?: number;
}

export type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export interface ApiErrorResponse {
	success: boolean;
	message: string;
	errors?: Record<string, unknown> | string[] | string;
	data?: unknown;
	status?: number | string;
}