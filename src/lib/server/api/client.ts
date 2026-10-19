import { env } from "$env/dynamic/private";
import type { ApiResponse } from "$lib/types/api.dto.js";

export interface ApiClientOptions extends RequestInit {
	params?: Record<string, string | number | boolean | undefined | null>;
	token?: string | null;
	fetch?: typeof fetch;
	deviceId?: string | null;
	deviceName?: string | null;
	tenantId?: string | null;
	tenantCode?: string | null;
	branchId?: string | null;
	branchCode?: string | null;
	raw?: boolean;
}

/**
 * Standard Error Class untuk kesalahan API backend eksternal
 */
export class ApiError extends Error {
	public status: number;
	public data?: unknown;
	public errors?: Record<string, unknown> | string[] | string;

	constructor(
		message: string,
		status: number = 500,
		data?: unknown,
		errors?: Record<string, unknown> | string[] | string
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
		this.errors = errors;
	}
}

/**
 * Centralized API Client untuk berkomunikasi secara privat dari SvelteKit server ke backend eksternal.
 * Menangani URL dasar, injeksi header authorization, metadata tenant/branch/device,
 * serta mengekstrak payload envelope backend `{ status, message, data }`.
 */
export async function apiClient<T = unknown>(
	endpoint: string,
	options: ApiClientOptions = {}
): Promise<T> {
	const {
		params,
		token,
		fetch: customFetch,
		deviceId,
		deviceName,
		tenantId,
		tenantCode,
		branchId,
		branchCode,
		raw = false,
		headers: customHeaders,
		...fetchOptions
	} = options;

	const baseUrl = (
		env.BACKEND_API_URL ||
		process.env.BACKEND_API_URL ||
		"https://nonstatutory-wonda-preadherently.ngrok-free.dev"
	).replace(/\/+$/, "");

	let cleanEndpoint = endpoint.replace(/^\/+/, "");
	if (baseUrl.endsWith("/api/v1") && cleanEndpoint.startsWith("api/v1/")) {
		cleanEndpoint = cleanEndpoint.replace(/^api\/v1\//, "");
	}

	let url = endpoint.startsWith("http")
		? endpoint
		: `${baseUrl}/${cleanEndpoint}`;

	if (params) {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		}
		const qs = searchParams.toString();
		if (qs) {
			url += (url.includes("?") ? "&" : "?") + qs;
		}
	}

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: "*/*",
		"ngrok-skip-browser-warning": "true",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(deviceId ? { "X-Device-ID": deviceId } : {}),
		...(deviceName ? { "X-Device-Name": deviceName } : {}),
		...(tenantId ? { "X-Tenant-ID": tenantId } : {}),
		...(tenantCode ? { "X-Tenant-Code": tenantCode } : {}),
		...(branchId ? { "X-Branch-ID": branchId } : {}),
		...(branchCode ? { "X-Branch-Code": branchCode } : {}),
		...((customHeaders as Record<string, string>) || {}),
	};

	const fetchFn = customFetch || fetch;

	console.log(`[Backend Call] ${fetchOptions.method || "GET"} ${url}`, {
		headers,
		body: fetchOptions.body,
	});

	let response: Response;
	try {
		response = await fetchFn(url, {
			...fetchOptions,
			headers,
		});
	} catch (networkError: unknown) {
		const msg =
			networkError instanceof Error
				? networkError.message
				: "Gagal terhubung ke server backend eksternal";
		throw new ApiError(msg, 503, { originalError: networkError });
	}

	const contentType = response.headers.get("content-type");
	const responseJson: unknown = contentType && contentType.includes("application/json")
		? await response.json().catch(() => null)
		: await response.text().then((text) => (text ? { message: text } : null)).catch(() => null);

	if (!response.ok) {
		console.error(`[Backend Call ERROR] Status ${response.status}:`, responseJson);
		const errObj =
			typeof responseJson === "object" && responseJson !== null
				? (responseJson as Record<string, unknown>)
				: null;

		// Format pasti backend: { success: false, message: '...', errors: { ... } }
		const errorMessage =
			(typeof errObj?.message === "string" && errObj.message) ||
			(typeof errObj?.error === "string" && errObj.error) ||
			`Request backend gagal dengan status ${response.status}`;

		const errors = (errObj?.errors ?? undefined) as Record<string, unknown> | string[] | string | undefined;
		const errorData = errObj?.data;

		throw new ApiError(errorMessage, response.status, errorData, errors);
	}

	// Jika pemanggil meminta format mentah ApiResponse<T>
	if (raw) {
		return responseJson as T;
	}

	// Ekstrak data dari envelope backend { status, message, data }
	if (responseJson && typeof responseJson === "object" && "data" in responseJson) {
		return (responseJson as { data: T }).data;
	}

	return responseJson as T;
}

// Helper methods untuk kemudahan pemanggilan
apiClient.get = <T>(endpoint: string, options?: ApiClientOptions): Promise<T> =>
	apiClient<T>(endpoint, { ...options, method: "GET" });

apiClient.post = <T>(
	endpoint: string,
	body?: unknown,
	options?: ApiClientOptions
): Promise<T> =>
	apiClient<T>(endpoint, {
		...options,
		method: "POST",
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

apiClient.put = <T>(
	endpoint: string,
	body?: unknown,
	options?: ApiClientOptions
): Promise<T> =>
	apiClient<T>(endpoint, {
		...options,
		method: "PUT",
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

apiClient.patch = <T>(
	endpoint: string,
	body?: unknown,
	options?: ApiClientOptions
): Promise<T> =>
	apiClient<T>(endpoint, {
		...options,
		method: "PATCH",
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

apiClient.delete = <T>(endpoint: string, options?: ApiClientOptions): Promise<T> =>
	apiClient<T>(endpoint, { ...options, method: "DELETE" });

// Helper untuk mendapatkan envelope ApiResponse lengkap jika diperlukan
apiClient.raw = <T>(
	endpoint: string,
	options?: ApiClientOptions
): Promise<ApiResponse<T>> => apiClient<ApiResponse<T>>(endpoint, { ...options, raw: true });
