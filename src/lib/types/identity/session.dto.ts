import type { UserRole } from "./user.dto.js";
export type { UserRole };

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	username: string;
	role: UserRole;
	avatarUrl?: string | null;
	avatar?: string | null;
	tenantId?: string | null;
	tenantCode?: string | null;
	branchId?: string | null;
	branchCode?: string | null;
	createdAt?: string | null;
}

export interface CreateSession {
	identity?: string;
	email?: string;
	password?: string;
}

export interface Token {
	accessToken: string;
	refreshToken?: string;
	expiresIn?: number;
	expires_in?: number;
}

export interface LoginResult {
	tokens: Token;
	user?: UserProfile;
}

export interface RefreshTokenResult {
	tokens: Token;
	user?: UserProfile;
}
