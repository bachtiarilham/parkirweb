import { getUserContext } from "$lib/utils/getCookies.js";
import type { Actions, PageServerLoad } from "./$types.js";

const defaultSettings: Record<string, string> = {
	siteName: "Web Parkir",
	timezone: "Asia/Jakarta",
	defaultRole: "viewer",
	maintenanceMode: "false",
};

const notificationPrefKeys = [
	"notif_new_user",
	"notif_content_published",
	"notif_security_alert",
	"notif_system_warning",
	"notif_weekly_digest",
	"notif_maintenance",
];

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const notifPrefs: Record<string, boolean> = {};
	for (const key of notificationPrefKeys) {
		notifPrefs[key] = true;
	}

	const userContext = getUserContext(cookies);

	return {
		profile: {
			id: String(userContext?.userId ?? ""),
			name: userContext?.fullName ?? "User",
			email: userContext?.email ?? "",
			username: userContext?.fullName ?? "User",
			role: userContext?.roleCode ?? "admin",
		},
		settings: { ...defaultSettings },
		isAdmin: userContext?.roleCode === "ADMIN-SYSTEM",
		isDemoMode: false,
		sessions: [
			{
				id: locals.deviceId || "current-session",
				userAgent: locals.deviceName || "Current Browser",
				ipAddress: "127.0.0.1",
				createdAt: new Date(),
				expiresAt: new Date(Date.now() + 7 * 86400000),
			},
		],
		currentSessionId: locals.deviceId || "current-session",
		notificationPrefs: notifPrefs,
	};
};

type ActionResult = { success: boolean; message?: string; action?: string };

export const actions: Actions = {
	updateProfile: async (): Promise<ActionResult> => {
		return { success: true, action: "profile" };
	},
	changePassword: async (): Promise<ActionResult> => {
		return { success: true, action: "password" };
	},
	updateSettings: async (): Promise<ActionResult> => {
		return { success: true, action: "settings" };
	},
	revokeSession: async (): Promise<ActionResult> => {
		return { success: true, action: "session" };
	},
	revokeAllOtherSessions: async (): Promise<ActionResult> => {
		return { success: true, action: "sessions" };
	},
	resetDemo: async (): Promise<ActionResult> => {
		return { success: true, action: "resetDemo" };
	},
	updateNotificationPrefs: async (): Promise<ActionResult> => {
		return { success: true, action: "notifications" };
	},
};
