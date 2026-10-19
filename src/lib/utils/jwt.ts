import type { UserProfile, UserRole } from "$lib/types/identity/session.dto.js";

/**
 * Payload JWT Claims dari Backend Go
 */
export interface JwtClaims {
	full_name: string;
	user_code: string;
	user_id: number;
	role_code: string;
	tenant_code: string | null;
	tenant_id: number | null;
	branch_code: string | null;
	branch_id: number | null;
	exp?: number;
	iat?: number;
	iss?: string;
	sub?: string;
	[key: string]: unknown;
}

/**
 * Decode Base64URL string (standar JWT)
 */
function base64UrlDecode(str: string): string {
	let output = str.replace(/-/g, "+").replace(/_/g, "/");
	switch (output.length % 4) {
		case 0:
			break;
		case 2:
			output += "==";
			break;
		case 3:
			output += "=";
			break;
		default:
			throw new Error("Illegal base64url string!");
	}

	try {
		if (typeof atob === "function") {
			return decodeURIComponent(
				atob(output)
					.split("")
					.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
					.join("")
			);
		}
		return Buffer.from(output, "base64").toString("utf-8");
	} catch {
		if (typeof atob === "function") {
			return atob(output);
		}
		return Buffer.from(output, "base64").toString("utf-8");
	}
}

/**
 * Parsing token JWT tanpa verifikasi signature untuk ekstraksi claims di BFF / client.
 */
export function parseJwt(token: string | null | undefined): JwtClaims | null {
	if (!token || typeof token !== "string") return null;

	const parts = token.split(".");
	if (parts.length !== 3) return null;

	try {
		const payloadJson = base64UrlDecode(parts[1]);
		return JSON.parse(payloadJson) as JwtClaims;
	} catch (err) {
		console.error("[JwtParser] Gagal decode token JWT:", err);
		return null;
	}
}

/**
 * Mengonversi claims JWT langsung menjadi objek UserProfile yang kompatibel dengan Locals / Session.
 */
export function jwtClaimsToUserProfile(claims: JwtClaims | null): UserProfile | null {
	if (!claims) return null;

	const roleCode = (claims.role_code || "").toLowerCase();
	let role: UserRole = "admin";
	if (roleCode.includes("system") || roleCode.includes("super")) {
		role = "system";
	} else if (roleCode.includes("tenant")) {
		role = "tenant";
	} else if (roleCode.includes("branch")) {
		role = "branch";
	}

	return {
		id: String(claims.user_id),
		name: claims.full_name || claims.user_code || "User",
		email: (claims.email as string) || `${claims.user_code}@parkir.local`,
		username: claims.user_code || String(claims.user_id),
		role,
		tenantId: claims.tenant_id ? String(claims.tenant_id) : null,
		tenantCode: claims.tenant_code || null,
		branchId: claims.branch_id ? String(claims.branch_id) : null,
		branchCode: claims.branch_code || null,
	};
}

/**
 * Mengecek apakah token sudah expired berdasarkan claim exp.
 */
export function isJwtExpired(claims: JwtClaims | null): boolean {
	if (!claims || !claims.exp) return false;
	const currentTimeSeconds = Math.floor(Date.now() / 1000);
	return claims.exp < currentTimeSeconds;
}
