import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { memberDashboardService } from "$lib/server/services/analytics/member_dashboard.service.js";
import { riderContractService } from "$lib/server/services/membership/rider_contract.service.js";
import { riderVehicleService } from "$lib/server/services/membership/rider_vehicle.service.js";
import { getUserContext } from "$lib/utils/getCookies.js";
import { ApiError } from "$lib/server/api/client.js";
import type {
	MemberDashboard,
	VehicleQuotaDto,
} from "$lib/types/analytics/member_dashboard.dto.js";
import type { VehicleItemDto } from "$lib/types/membership/rider_vehicle.dto.js";

const ACCESS_TOKEN_COOKIE = "access_token";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
	const user = getUserContext(cookies);

	let dashboardData: MemberDashboard | null = null;
	let vehicles: VehicleItemDto[] = [];
	let vehicleQuota: VehicleQuotaDto = {
		maxVehicles: 0,
		registeredCount: 0,
		canAddMore: false,
	};
	let error: string | null = null;

	try {
		dashboardData = await memberDashboardService.getDashboard(accessToken, { fetch });
	} catch (err: any) {
		console.error("[MemberDashboard] Error fetching dashboard data:", err);
		error = err?.message || "Gagal memuat data dashboard member dari server.";
	}

	const contractId = dashboardData?.membership_data?.membershipId;
	if (contractId) {
		try {
			const vehicleRes = await riderVehicleService.getVehicles(contractId, accessToken, { fetch });
			vehicles = vehicleRes?.vehicles || [];
			if (vehicleRes?.vehicleQuota) {
				vehicleQuota = vehicleRes.vehicleQuota;
			}
		} catch (vErr: any) {
			console.warn("[MemberDashboard] Gagal memuat daftar kendaraan kontrak:", vErr?.message);
			if (dashboardData?.membership_data?.vehicleQuota) {
				vehicleQuota = dashboardData.membership_data.vehicleQuota;
			}
		}
	} else if (dashboardData?.membership_data?.vehicleQuota) {
		vehicleQuota = dashboardData.membership_data.vehicleQuota;
	}

	return {
		dashboardData,
		vehicles,
		vehicleQuota,
		user,
		error,
	};
};

export const actions: Actions = {
	renew: async ({ cookies, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const formData = await request.formData();
		const membershipId = formData.get("membershipId")?.toString();
		const paymentMethod = formData.get("paymentMethod")?.toString() || undefined;

		if (!membershipId) {
			return fail(400, { message: "ID Membership wajib diisi untuk perpanjangan." });
		}

		try {
			const result = await riderContractService.renewSubscription(
				{ membershipId, paymentMethod },
				accessToken,
				{ fetch }
			);
			return {
				success: true,
				action: "renew",
				renewal: result,
			};
		} catch (err: any) {
			console.error("[RenewAction] Error:", err);
			if (err instanceof ApiError) {
				return fail(err.status, { message: err.message });
			}
			return fail(400, { message: err?.message || "Gagal memproses perpanjangan membership." });
		}
	},

	registerVehicle: async ({ cookies, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const formData = await request.formData();
		const contractId = formData.get("contractId")?.toString();
		const licensePlate = formData.get("licensePlate")?.toString()?.trim()?.toUpperCase();
		const vehicleModel = formData.get("vehicleModel")?.toString()?.trim() || undefined;
		const vehicleType = formData.get("vehicleType")?.toString() || "CAR";

		if (!contractId || !licensePlate) {
			return fail(400, { message: "Kontrak ID dan Plat Nomor wajib diisi." });
		}

		try {
			await riderVehicleService.registerVehicle(
				contractId,
				{
					contractId: Number(contractId) || 0,
					licensePlate,
					vehicleModel,
					vehicleType,
				},
				accessToken,
				{ fetch }
			);
			return { success: true, action: "registerVehicle" };
		} catch (err: any) {
			console.error("[RegisterVehicleAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal mendaftarkan kendaraan." });
		}
	},

	updateVehicle: async ({ cookies, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const formData = await request.formData();
		const contractId = formData.get("contractId")?.toString();
		const vehicleId = formData.get("vehicleId")?.toString();
		const licensePlate = formData.get("licensePlate")?.toString()?.trim()?.toUpperCase() || undefined;
		const vehicleModel = formData.get("vehicleModel")?.toString()?.trim() || undefined;
		const vehicleType = formData.get("vehicleType")?.toString() || undefined;

		if (!contractId || !vehicleId) {
			return fail(400, { message: "Kontrak ID dan Kendaraan ID wajib diisi." });
		}

		try {
			await riderVehicleService.updateVehicle(
				contractId,
				vehicleId,
				{
					licensePlate,
					vehicleModel,
					vehicleType,
				},
				accessToken,
				{ fetch }
			);
			return { success: true, action: "updateVehicle" };
		} catch (err: any) {
			console.error("[UpdateVehicleAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal memperbarui data kendaraan." });
		}
	},

	toggleActiveVehicle: async ({ cookies, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const formData = await request.formData();
		const contractId = formData.get("contractId")?.toString();
		const vehicleId = formData.get("vehicleId")?.toString();

		if (!contractId || !vehicleId) {
			return fail(400, { message: "Kontrak ID dan Kendaraan ID wajib diisi." });
		}

		try {
			await riderVehicleService.toggleActiveVehicle(
				contractId,
				{
					contractId: Number(contractId) || 0,
					vehicleId: Number(vehicleId) || 0,
				},
				accessToken,
				{ fetch }
			);
			return { success: true, action: "toggleActiveVehicle" };
		} catch (err: any) {
			console.error("[ToggleActiveVehicleAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal mengubah status aktif kendaraan." });
		}
	},

	deleteVehicle: async ({ cookies, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const formData = await request.formData();
		const contractId = formData.get("contractId")?.toString();
		const vehicleId = formData.get("vehicleId")?.toString();

		if (!contractId || !vehicleId) {
			return fail(400, { message: "Kontrak ID dan Kendaraan ID wajib diisi." });
		}

		try {
			await riderVehicleService.deleteVehicle(contractId, vehicleId, accessToken, { fetch });
			return { success: true, action: "deleteVehicle" };
		} catch (err: any) {
			console.error("[DeleteVehicleAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal menghapus kendaraan." });
		}
	},
};
