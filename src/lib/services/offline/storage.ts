import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface PendingCheckIn {
	id: string; // UUID / unique client ID
	plate_number: string;
	vehicle_type: 'MOTOR' | 'MOBIL' | 'TRUK';
	branch_id: string | number;
	gate_id?: string | number;
	idempotency_key: string;
	timestamp: number;
	status: 'PENDING' | 'SYNCING' | 'FAILED';
	error_message?: string;
}

interface OfflineDB extends DBSchema {
	pending_checkins: {
		key: string;
		value: PendingCheckIn;
		indexes: { 'by-timestamp': number };
	};
}

const DB_NAME = 'linespot_offline_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

function getDb(): Promise<IDBPDatabase<OfflineDB>> {
	if (!dbPromise) {
		dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains('pending_checkins')) {
					const store = db.createObjectStore('pending_checkins', { keyPath: 'id' });
					store.createIndex('by-timestamp', 'timestamp');
				}
			}
		});
	}
	return dbPromise;
}

export const offlineStorage = {
	async savePendingCheckIn(item: Omit<PendingCheckIn, 'id' | 'status'>): Promise<PendingCheckIn> {
		const db = await getDb();
		const record: PendingCheckIn = {
			...item,
			id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
			status: 'PENDING'
		};
		await db.put('pending_checkins', record);
		return record;
	},

	async getPendingCheckIns(): Promise<PendingCheckIn[]> {
		const db = await getDb();
		return db.getAllFromIndex('pending_checkins', 'by-timestamp');
	},

	async removePendingCheckIn(id: string): Promise<void> {
		const db = await getDb();
		await db.delete('pending_checkins', id);
	},

	async updateStatus(id: string, status: PendingCheckIn['status'], error_message?: string): Promise<void> {
		const db = await getDb();
		const item = await db.get('pending_checkins', id);
		if (item) {
			item.status = status;
			if (error_message) item.error_message = error_message;
			await db.put('pending_checkins', item);
		}
	},

	async getPendingCount(): Promise<number> {
		const db = await getDb();
		return db.count('pending_checkins');
	}
};
