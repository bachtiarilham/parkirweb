import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { riderVehicleService } from "$lib/server/services/membership/rider_vehicle.service.js";
import { riderContractService } from "$lib/server/services/membership/rider_contract.service.js";
import { ApiError } from "$lib/server/api/client.js";

const ACCESS_TOKEN_COOKIE = "access_token";

export const load: PageServerLoad = async ({ cookies, params, fetch }) => {
	const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
	const contractId = params.id;

	try {
		const [vehicleData, contract] = await Promise.all([
			riderVehicleService.getVehicles(contractId, accessToken, { fetch }).catch(() => ({
				vehicles: [],
				vehicleQuota: { maxVehicles: 2, registeredCount: 0, canAddMore: true },
			})),
			riderContractService.getById(contractId, accessToken, { fetch }).catch(() => null),
		]);

		return {
			contractId,
			vehicles: vehicleData.vehicles || [],
			vehicleQuota: vehicleData.vehicleQuota || {
				maxVehicles: 2,
				registeredCount: (vehicleData.vehicles || []).length,
				canAddMore: (vehicleData.vehicles || []).length < 2,
			},
			contract,
		};
	} catch (error: any) {
		console.error("[ContractVehiclesPage] Error:", error);
		return {
			contractId,
			vehicles: [],
			vehicleQuota: { maxVehicles: 0, registeredCount: 0, canAddMore: false },
			contract: null,
			error: error instanceof Error ? error.message : "Gagal memuat kendaraan kontrak",
		};
	}
};

export const actions: Actions = {
	register: async ({ cookies, params, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const contractId = params.id;
		const formData = await request.formData();

		const licensePlate = formData.get("licensePlate")?.toString()?.trim()?.toUpperCase();
		const vehicleModel = formData.get("vehicleModel")?.toString()?.trim() || undefined;
		const vehicleType = formData.get("vehicleType")?.toString() || "CAR";

		if (!licensePlate) {
			return fail(400, { message: "Plat nomor kendaraan wajib diisi." });
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
			return { success: true, action: "register" };
		} catch (err: any) {
			console.error("[RegisterVehicleAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal mendaftarkan kendaraan." });
		}
	},

	update: async ({ cookies, params, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const contractId = params.id;
		const formData = await request.formData();

		const vehicleId = formData.get("vehicleId")?.toString();
		const licensePlate = formData.get("licensePlate")?.toString()?.trim()?.toUpperCase() || undefined;
		const vehicleModel = formData.get("vehicleModel")?.toString()?.trim() || undefined;
		const vehicleType = formData.get("vehicleType")?.toString() || undefined;

		if (!vehicleId) {
			return fail(400, { message: "ID Kendaraan wajib diisi." });
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
			return { success: true, action: "update" };
		} catch (err: any) {
			console.error("[UpdateVehicleAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal memperbarui kendaraan." });
		}
	},

	toggleActive: async ({ cookies, params, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const contractId = params.id;
		const formData = await request.formData();
		const vehicleId = formData.get("vehicleId")?.toString();

		if (!vehicleId) {
			return fail(400, { message: "ID Kendaraan wajib diisi." });
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
			return { success: true, action: "toggleActive" };
		} catch (err: any) {
			console.error("[ToggleActiveAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal mengubah status aktif kendaraan." });
		}
	},

	delete: async ({ cookies, params, request, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const contractId = params.id;
		const formData = await request.formData();
		const vehicleId = formData.get("vehicleId")?.toString();

		if (!vehicleId) {
			return fail(400, { message: "ID Kendaraan wajib diisi." });
		}

		try {
			await riderVehicleService.deleteVehicle(contractId, vehicleId, accessToken, { fetch });
			return { success: true, action: "delete" };
		} catch (err: any) {
			console.error("[DeleteVehicleAction] Error:", err);
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err?.message || "Gagal menghapus kendaraan." });
		}
	},
};
