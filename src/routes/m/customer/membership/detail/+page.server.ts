import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	// Mock or fetch active contract details for customer
	const activeContract = {
		id: 101,
		code: 'CTR-VIP-2026',
		plan_name: 'VIP Bulanan On-Street',
		plan_code: 'RDR-MTR-MTH',
		status: 'ACTIVE',
		rfid_card_no: 'NFC-84A29B01',
		started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		expires_at: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
		days_remaining: 27,
		license_plates: ['B 1234 XYZ', 'B 5678 ABC'],
		price: 150000,
		features: [
			'Bebas parkir tanpa karcis di seluruh zona kota',
			'Prioritas check-in otomatis kamera OCR',
			'Garansi slot parkir di jam sibuk',
			'Bebas denda overstay parkir resmi'
		]
	};

	return {
		user,
		contract: activeContract
	};
};
