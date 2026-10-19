import { json, type RequestHandler } from "@sveltejs/kit";
import { apiClient } from "$lib/server/api/client.js";

async function proxyToBackend(
	request: Request,
	url: URL,
	cookies: any,
	fetch: typeof globalThis.fetch
) {
	try {
		const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
		const token = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : (cookies.get("access_token") || null);
		const idempotencyKey = request.headers.get("X-Idempotency-Key") || request.headers.get("Idempotency-Key") || undefined;
		const contentType = request.headers.get("content-type") || "";

		let body: any = undefined;
		const headers: Record<string, string> = {};

		if (idempotencyKey) {
			headers["X-Idempotency-Key"] = idempotencyKey;
		}

		if (request.method !== "GET" && request.method !== "HEAD") {
			if (contentType.includes("multipart/form-data")) {
				body = await request.formData();
			} else if (contentType.includes("application/json")) {
				body = await request.json().catch(() => undefined);
			} else {
				const text = await request.text().catch(() => "");
				if (text) body = text;
			}
		}

		// Panggil endpoint kanonikal 1:1 ke backend Go (url.pathname + url.search)
		const targetPath = url.pathname + url.search;
		const result = await apiClient.raw<any>(targetPath, {
			method: request.method,
			body,
			headers,
			token,
			fetch,
		});

		return json(result, { status: 200 });
	} catch (err: any) {
		console.error(`[API Gateway] Error on ${request.method} ${url.pathname}:`, err);
		return json(
			{
				success: false,
				code: err.status || 500,
				message: err.message || "Gagal memproses request ke backend Go",
				error: err.errors || err.message,
			},
			{ status: err.status || 500 }
		);
	}
}

export const GET: RequestHandler = async ({ request, url, cookies, fetch }) =>
	proxyToBackend(request, url, cookies, fetch);

export const POST: RequestHandler = async ({ request, url, cookies, fetch }) =>
	proxyToBackend(request, url, cookies, fetch);

export const PUT: RequestHandler = async ({ request, url, cookies, fetch }) =>
	proxyToBackend(request, url, cookies, fetch);

export const PATCH: RequestHandler = async ({ request, url, cookies, fetch }) =>
	proxyToBackend(request, url, cookies, fetch);

export const DELETE: RequestHandler = async ({ request, url, cookies, fetch }) =>
	proxyToBackend(request, url, cookies, fetch);
