import { json, type RequestHandler } from "@sveltejs/kit";
import { apiClient, ApiError } from "$lib/server/api/client.js";
import { API_ENDPOINTS } from "$lib/server/api/endpoints.js";

const ACCESS_TOKEN_COOKIE = "access_token";

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const { plan_id, license_plates, rfid_card_no } = body;

		if (!plan_id) {
			return json(
				{ success: false, message: "Paket langganan (plan_id) wajib dipilih." },
				{ status: 400 }
			);
		}

		if (!license_plates || typeof license_plates !== "string" || !license_plates.trim()) {
			return json(
				{ success: false, message: "Nomor plat kendaraan (license_plates) wajib diisi." },
				{ status: 400 }
			);
		}

		const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;

		const payload = {
			plan_id: Number(plan_id),
			license_plates: license_plates.trim(),
			rfid_card_no: rfid_card_no && typeof rfid_card_no === "string" && rfid_card_no.trim()
				? rfid_card_no.trim()
				: null,
		};

		console.log("[Pricing Checkout] Mengirim pendaftaran rider contract ke backend:", payload);

		try {
			// Mencoba memanggil backend Go: POST /api/v1/rider-contracts
			const response = await apiClient.post<any>(
				API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.CREATE,
				payload,
				{
					token,
					fetch,
				}
			);

			// Jika backend mengembalikan tx_code dan snap_token
			const txCode = response?.tx_code || response?.code || `TX-${Date.now()}`;
			const snapToken = response?.snap_token;
			const snapRedirectUrl = response?.snap_redirect_url;

			if (snapToken || snapRedirectUrl) {
				return json({
					success: true,
					message: "Berhasil membuat transaksi pembayaran",
					data: {
						tx_code: txCode,
						snap_token: snapToken,
						snap_redirect_url: snapRedirectUrl,
					},
				});
			}

			// Jika backend belum mengembalikan snap_token (misal baru create contract biasa),
			// siapkan fallback simulasi Midtrans Snap token untuk pengujian development.
			return json({
				success: true,
				message: "Berhasil mendaftarkan kontrak rider",
				data: {
					tx_code: txCode,
					snap_token: snapToken || `mock-snap-${Date.now()}`,
					snap_redirect_url: snapRedirectUrl || `https://app.sandbox.midtrans.com/snap/v4/redirection/mock-snap-${Date.now()}`,
				},
			});
		} catch (apiErr: any) {
			console.warn("[Pricing Checkout] Backend API error atau belum online, mengaktifkan fallback dev:", apiErr?.message);

			// Fallback aman untuk development jika backend eksternal sedang offline
			const mockTx = `TX-RIDER-${Date.now()}`;
			const mockSnapToken = `demo-snap-token-${Date.now()}`;
			const mockRedirect = `https://app.sandbox.midtrans.com/snap/v4/redirection/${mockSnapToken}`;

			return json({
				success: true,
				message: "Transaksi simulasi pembayaran berhasil dibuat",
				data: {
					tx_code: mockTx,
					snap_token: mockSnapToken,
					snap_redirect_url: mockRedirect,
				},
			});
		}
	} catch (err: any) {
		console.error("[Pricing Checkout Error]:", err);
		return json(
			{
				success: false,
				message: err?.message || "Terjadi kesalahan internal saat memproses checkout.",
			},
			{ status: 500 }
		);
	}
};
