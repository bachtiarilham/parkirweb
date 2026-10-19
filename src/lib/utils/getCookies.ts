import type { Cookies } from "@sveltejs/kit";
import {
   ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	USER_COOKIE,
} from "../../hooks.server.ts";


// Tipe data hasil parsing context
interface ParsedUserContext {
  userId: number | null;
  fullName: string;
  email: string;
  roleCode: string | null;
  tenantId: number | null;
  tenantCode: string | null;
  branchId: number | null;
  branchCode: string | null;
}

// Helper untuk membaca dan mengekstrak semua params dari cookies
export function getUserContext(cookies: import('@sveltejs/kit').Cookies): ParsedUserContext | null {
  const rawCookie = cookies.get(USER_COOKIE);
  if (!rawCookie) return null;

  try {
    const raw = JSON.parse(rawCookie);

    return {
      // Parsing angka (integer), fallback null jika kosong/tidak valid
      userId: raw.user_id ? parseInt(raw.user_id, 10) : null,
      tenantId: raw.tenantId ? parseInt(raw.tenantId, 10) : null,
      branchId: raw.branchId ? parseInt(raw.branchId, 10) : null,

      // String parameters
      fullName: raw.full_name ?? "User",
      email: raw.email ?? "",
      roleCode: raw.role_code ?? null,
      tenantCode: raw.tenantCode ?? null,
      branchCode: raw.branchCode ?? null,
    };
  } catch (error) {
    console.error("Gagal parse cookie USER_COOKIE:", error);
    return null;
  }
}

export function getAuthTokens(cookies: Cookies) {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
  const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE) ?? null;

  return {
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken)
  };
}