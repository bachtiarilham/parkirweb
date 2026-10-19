import { env } from "$env/dynamic/private";
import type { ApiResponse } from "$lib/types/api.dto.js";
import { getRequestContext } from "../context.js";

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
 * Standard Error Class untuk kesalahan API backend eksternal (park-server-v3)
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
 * Centralized API Client untuk berkomunikasi secara privat dari SvelteKit server ke backend Go (park-server-v3).
 * Menangani URL dasar tunggal, injeksi header otomatis dari serverContext,
 * dan mengekstrak payload envelope backend `{ success, message, data }`.
 */
export async function apiClient<T = unknown>(
	endpoint: string,
	options: ApiClientOptions = {}
): Promise<T> {
	const ctx = getRequestContext();

	const {
		params,
		token = ctx?.token ?? null,
		fetch: customFetch,
		deviceId = ctx?.deviceId ?? "web-browser",
		deviceName = ctx?.deviceName ?? "Web Browser",
		tenantId = ctx?.user?.tenantId ? String(ctx.user.tenantId) : null,
		tenantCode = ctx?.user?.tenantCode ?? null,
		branchId = ctx?.user?.branchId ? String(ctx.user.branchId) : null,
		branchCode = ctx?.user?.branchCode ?? null,
		raw = false,
		headers: customHeaders,
		...fetchOptions
	} = options;

	// Base URL tunggal kanonikal (tanpa percabangan OR ganda)
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

	const isFormData = typeof fetchOptions.body === "object" && fetchOptions.body instanceof FormData;

	// Header 1:1 sesuai kebutuhan park-server-v3
	const headers: Record<string, string> = {
		Accept: "application/json, */*",
		"ngrok-skip-browser-warning": "true",
		"X-Request-ID": ctx?.requestId ?? crypto.randomUUID(),
		...(isFormData ? {} : { "Content-Type": "application/json" }),
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
		hasToken: !!token,
		deviceId,
	});

	let response: Response;
	try {
		response = await fetchFn(url, {
			...fetchOptions,
			headers,
		});
	} catch (networkError: unknown) {
		const cause = (networkError as { cause?: unknown })?.cause;
		console.error(`[Backend Call Failed] ${url}:`, networkError, "Cause:", cause);
		const msg =
			networkError instanceof Error
				? `${networkError.message}${cause ? ` (${(cause as Error)?.message || cause})` : ""}`
				: "Gagal terhubung ke server backend eksternal";
		throw new ApiError(msg, 503, { originalError: networkError, cause });
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

		const errorMessage =
			(typeof errObj?.message === "string" && errObj.message) ||
			(typeof errObj?.error === "string" && errObj.error) ||
			`Request backend gagal dengan status ${response.status}`;

		const errors = (errObj?.errors ?? undefined) as Record<string, unknown> | string[] | string | undefined;
		const errorData = errObj?.data;

		throw new ApiError(errorMessage, response.status, errorData, errors);
	}

	if (raw) {
		return responseJson as T;
	}

	// Ekstrak data dari envelope backend { success: true, message: '...', data: T }
	if (responseJson && typeof responseJson === "object" && "data" in responseJson) {
		return (responseJson as { data: T }).data;
	}

	return responseJson as T;
}

// Helper methods
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
		body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
	});

apiClient.put = <T>(
	endpoint: string,
	body?: unknown,
	options?: ApiClientOptions
): Promise<T> =>
	apiClient<T>(endpoint, {
		...options,
		method: "PUT",
		body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
	});

apiClient.patch = <T>(
	endpoint: string,
	body?: unknown,
	options?: ApiClientOptions
): Promise<T> =>
	apiClient<T>(endpoint, {
		...options,
		method: "PATCH",
		body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
	});

apiClient.delete = <T>(endpoint: string, options?: ApiClientOptions): Promise<T> =>
	apiClient<T>(endpoint, { ...options, method: "DELETE" });

apiClient.raw = <T>(
	endpoint: string,
	options?: ApiClientOptions
): Promise<ApiResponse<T>> => apiClient<ApiResponse<T>>(endpoint, { ...options, raw: true });
