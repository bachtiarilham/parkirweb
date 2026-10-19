import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

const sampleNotifications = [
	{
		id: "1",
		title: "Selamat Datang di Web Parkir",
		message: "Sistem aplikasi parkir berbasis frontend telah berhasil dimuat.",
		type: "info",
		read: false,
		createdAt: new Date(),
	},
	{
		id: "2",
		title: "Pemberitahuan Sistem",
		message: "Koneksi backend disiapkan di src/server/api.",
		type: "success",
		read: true,
		createdAt: new Date(Date.now() - 3600000),
	},
];

export const load: PageServerLoad = async () => {
	return { notifications: sampleNotifications };
};

type ActionRes = { success: boolean; message?: string };

export const actions: Actions = {
	markRead: async (): Promise<ActionRes> => {
		return { success: true };
	},
	markAllRead: async (): Promise<ActionRes> => {
		return { success: true };
	},
	delete: async (): Promise<ActionRes> => {
		return { success: true };
	},
};
