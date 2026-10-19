import { getUserContext } from "$lib/utils/getCookies.js";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies }) => {
	const userContext = getUserContext(cookies);

	const currentUser = {
		id: String(userContext?.userId ?? ""),
		name: userContext?.fullName ?? "User",
		email: userContext?.email ?? "",
		role: userContext?.roleCode ?? "admin",
	};

	const roleDefinitions = [
		{
			name: "system" as const,
			label: "System Admin",
			description:
				"Akses level sistem tertinggi. Mengelola seluruh tenant, cabang (branch), konfigurasi platform global, dan pemeliharaan.",
			permissions: [
				"Kelola semua tenant & branch",
				"Kelola semua akun pengguna",
				"Akses konfigurasi sistem & audit log",
				"Pengaturan billing & subscription",
			],
			users: currentUser.role === "system" ? [currentUser] : [],
			count: currentUser.role === "system" ? 1 : 0,
		},
		{
			name: "tenant" as const,
			label: "Tenant Admin",
			description:
				"Akses level organisasi/perusahaan penyewa. Mengelola seluruh cabang (branch) dan staf dalam naungan organisasi tenant.",
			permissions: [
				"Kelola seluruh cabang di organisasi",
				"Kelola user branch & admin cabang",
				"Akses laporan analitik agregat tenant",
				"Pengaturan tarif dasar organisasi",
			],
			users: currentUser.role === "tenant" ? [currentUser] : [],
			count: currentUser.role === "tenant" ? 1 : 0,
		},
		{
			name: "branch" as const,
			label: "Branch Manager",
			description:
				"Akses manajer cabang/lokasi parkir. Bertanggung jawab atas operasional dan pengawasan gerbang/staf di cabang terkait.",
			permissions: [
				"Kelola operasional cabang spesifik",
				"Kelola staf/admin operasional branch",
				"Akses laporan pendapatan & okupansi cabang",
				"Monitoring status perangkat gerbang",
			],
			users: currentUser.role === "branch" ? [currentUser] : [],
			count: currentUser.role === "branch" ? 1 : 0,
		},
		{
			name: "admin" as const,
			label: "Admin (Per Branch)",
			description:
				"Akses admin operasional unit di cabang. Melakukan pengawasan transaksi harian, pos gerbang, dan pembukaan palang manual.",
			permissions: [
				"Operasional pos masuk & keluar",
				"Penanganan kendala tiket & member",
				"Cetak laporan shift kasir",
				"Override gerbang darurat",
			],
			users: currentUser.role === "admin" ? [currentUser] : [],
			count: currentUser.role === "admin" ? 1 : 0,
		},
	];

	return { roles: roleDefinitions };
};

type ActionRes = { success: boolean; message?: string };

export const actions: Actions = {
	changeRole: async (): Promise<ActionRes> => {
		return { success: true };
	},
};
