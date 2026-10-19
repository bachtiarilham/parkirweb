export type UserRole = "system" | "tenant" | "branch" | "admin";

export interface User {
	user_id: number;
  user_code: string;
  role_code: string;
  nik?: string | null;
  full_name?: string;
  email?: string;
  phone_number?: string | null;
  photo_url?: string | null;
  // password_hash diabaikan karena json:"-"
  status: string;
  created_at: string; // Representasi ISO string dari time.Time
  is_verified: boolean;

  // UI / backward-compatibility aliases
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt?: string | Date;

  // branch and tenant
  tenant_id?: number | null;
  tenant_code?: string | null;
  branch_id?: number | null;
  branch_code?: string | null;
  branch_type: string | null;
  zona: string | null;
  address: string | null;
}

// export interface User extends UserProfile {
// 	status?: "active" | "inactive" | "suspended";
// 	phone?: string | null;
// 	updatedAt?: string | Date;
// }

export interface CreateUserRequest {
   full_name: string;
   username: string;
   email: string;
   phone?: string;
   password?: string;
   nik?: string;

	role: UserRole;
	tenantId?: string | null;
	branchId?: string | null;
}

export interface UpdateUserDTO {
   user_id: number;
   full_name?: string | null;
   email?: string | null;
   phone_number?: string | null;
   nik?: string | null;
   photo_url?: string | null;
	username?: string;
	password?: string;
	role?: UserRole;
	tenantId?: string | null;
	branchId?: string | null;
	status?: "active" | "inactive" | "suspended";
}

export interface UserQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	role?: UserRole;
	tenantId?: string;
	branchId?: string;
}
