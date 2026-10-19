import { AsyncLocalStorage } from 'node:async_hooks';
import type { Cookies } from '@sveltejs/kit';

export interface RequestContextStore {
	token: string | null;
	deviceId: string;
	deviceName: string;
	requestId: string;
	user: any | null;
	cookies?: Cookies;
}

export const serverContext = new AsyncLocalStorage<RequestContextStore>();

export function getRequestContext(): RequestContextStore | undefined {
	return serverContext.getStore();
}

export function runWithRequestContext<R>(context: RequestContextStore, fn: () => R): R {
	return serverContext.run(context, fn);
}
