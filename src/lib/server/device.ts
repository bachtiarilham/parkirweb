import { createHash } from "node:crypto";
import type { RequestEvent } from "@sveltejs/kit";

export interface DeviceInfo {
	deviceId: string;
	deviceName: string;
}

/**
 * Parsing User-Agent untuk mendapatkan nama perangkat dan browser yang manusiawi (human-readable).
 * Contoh: "Chrome on Windows", "Safari on iPhone", "Firefox on Linux"
 */
export function getDeviceNameFromUserAgent(userAgent: string | null): string {
	if (!userAgent) return "Unknown Device";

	let os = "Unknown OS";
	if (/windows phone/i.test(userAgent)) {
		os = "Windows Phone";
	} else if (/win/i.test(userAgent)) {
		os = "Windows";
	} else if (/android/i.test(userAgent)) {
		os = "Android";
	} else if (/ipad/i.test(userAgent)) {
		os = "iPad";
	} else if (/iphone|ipod/i.test(userAgent)) {
		os = "iPhone";
	} else if (/mac/i.test(userAgent)) {
		os = "macOS";
	} else if (/linux/i.test(userAgent)) {
		os = "Linux";
	}

	let browser = "Browser";
	if (/edg/i.test(userAgent)) {
		browser = "Edge";
	} else if (/opr|opera/i.test(userAgent)) {
		browser = "Opera";
	} else if (/chrome|crios/i.test(userAgent)) {
		browser = "Chrome";
	} else if (/firefox|fxios/i.test(userAgent)) {
		browser = "Firefox";
	} else if (/safari/i.test(userAgent)) {
		browser = "Safari";
	}

	return `${browser} on ${os}`;
}

/**
 * Menghasilkan Device ID yang konsisten dan stabil (Deterministic Device Fingerprint)
 * berdasarkan Client IP, User-Agent, dan Accept-Language tanpa menggunakan Cookies.
 */
// export function getDeviceIdFromRequest(event: RequestEvent): string {
// 	// 1. Cek jika client/mobile app mengirim header eksplisit
// 	const headerDeviceId = event.request.headers.get("x-device-id");
// 	if (headerDeviceId && headerDeviceId.trim()) {
// 		return headerDeviceId.trim();
// 	}

// 	// 2. Ambil IP Address klien
//    const clientIp : string = event.getClientAddress()

// 	const userAgent = event.request.headers.get("user-agent") || "unknown-ua";
// 	const acceptLanguage = event.request.headers.get("accept-language") || "";

// 	// 3. Buat hash sha256 unik berformat hex 32-karakter
// 	const rawFingerprint = `${clientIp}:::${userAgent}:::${acceptLanguage}`;
// 	const hash = createHash("sha256").update(rawFingerprint).digest("hex");

// 	// Format UUID-like agar rapi dan kompatibel dengan backend (misal: 8-4-4-4-12)
// 	return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
// }

/**
 * Mengambil nama perangkat dari Request (header atau User-Agent).
 */
// export function getDeviceNameFromRequest(event: RequestEvent): string {
// 	const headerDeviceName = event.request.headers.get("x-device-name");
// 	if (headerDeviceName && headerDeviceName.trim()) {
// 		return headerDeviceName.trim();
// 	}

// 	const userAgent = event.request.headers.get("user-agent");
// 	return getDeviceNameFromUserAgent(userAgent);
// }

// /**
//  * Helper all-in-one untuk mengekstrak Device ID dan Device Name dari RequestEvent.
//  */
// export function getDeviceInfo(event: RequestEvent): DeviceInfo {
// 	return {
// 		deviceId: getDeviceIdFromRequest(event),
// 		deviceName: getDeviceNameFromRequest(event),
// 	};
// }
