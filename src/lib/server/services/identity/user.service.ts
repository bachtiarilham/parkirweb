import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	CreateUserRequest,
	UpdateUserDTO,
	User,
	UserQueryParams,
} from "$lib/types/identity/user.dto.js";
import type { PaginatedData } from "$lib/types/api.dto.js";

export const userService = {
	/**
	 * Ambil daftar user paginated (GET /api/v1/users)
	 */
	async getAll(
		token?: string | null,
		params?: UserQueryParams,
		options: { fetch?: typeof fetch } = {}
	): Promise<User[] | PaginatedData<User>> {
		return apiClient<User[] | PaginatedData<User>>(API_ENDPOINTS.USERS.LIST, {
			fetch: options.fetch,
			token,
			params: params as Record<string, any>,
		});
	},

	/**
	 * Ambil detail satu user (GET /api/v1/users/:id)
	 */
	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<User> {
		return apiClient<User>(API_ENDPOINTS.USERS.GET_BY_ID(id), {
			fetch: options.fetch,
			token,
		});
	},

	/**
	 * Buat / daftarkan user baru (POST /api/v1/users)
	 */
	async create(
		data: CreateUserRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<User> {
		return apiClient.post<User>(API_ENDPOINTS.USERS.CREATE, data, {
			fetch: options.fetch,
			token,
		});
	},

	/**
	 * Update profil user (PATCH /api/v1/users/:id)
	 */
	async update(
		id: string | number,
		data: Partial<UpdateUserDTO>,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<User> {
		return apiClient.patch<User>(API_ENDPOINTS.USERS.UPDATE(id), data, {
			fetch: options.fetch,
			token,
		});
	},

	/**
	 * Hapus user (DELETE /api/v1/users/:id)
	 */
	async delete(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.delete<{ success: boolean; message?: string }>(
			API_ENDPOINTS.USERS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	/**
	 * Payment methods per user
	 */
	paymentMethods: {
		async getAll(
			userId: string | number,
			token?: string | null,
			options: { fetch?: typeof fetch } = {}
		): Promise<any[]> {
			return apiClient<any[]>(
				API_ENDPOINTS.USERS.PAYMENT_METHODS.LIST(userId),
				{
					fetch: options.fetch,
					token,
				}
			);
		},

		async create(
			userId: string | number,
			data: any,
			token?: string | null,
			options: { fetch?: typeof fetch } = {}
		): Promise<any> {
			return apiClient.post(
				API_ENDPOINTS.USERS.PAYMENT_METHODS.CREATE(userId),
				data,
				{
					fetch: options.fetch,
					token,
				}
			);
		},

		async delete(
			userId: string | number,
			pmId: string | number,
			token?: string | null,
			options: { fetch?: typeof fetch } = {}
		): Promise<{ success: boolean; message?: string }> {
			return apiClient.delete(
				API_ENDPOINTS.USERS.PAYMENT_METHODS.DELETE(userId, pmId),
				{
					fetch: options.fetch,
					token,
				}
			);
		},
	},
};
