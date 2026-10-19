// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// import type { UserProfile } from "$lib/types/identity/session.dto.js";

declare global {
	namespace App {
		interface Error {
			message: string;
			errorId?: string;
			status?: number;
		}
		interface Locals {
			deviceId: string | null;
			deviceName: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		snap?: {
			pay: (token: string, callbacks: Record<string, (result: any) => void>) => void;
		};
		NDEFReader?: any;
	}
}

export {};
