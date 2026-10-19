<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { offlineStorage } from '$lib/services/offline/storage.js';
	import LiquidGlassAmbientBackdrop from '$lib/components/ui/liquid-glass/LiquidGlassAmbientBackdrop.svelte';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import HomeIcon from '@lucide/svelte/icons/home';
	import CameraIcon from '@lucide/svelte/icons/camera';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import { API_ENDPOINTS } from '$lib/api/endpoints.js';

	let { data, children } = $props();

	let isOnline = $state(true);
	let pendingOfflineCount = $state(0);
	let isSyncing = $state(false);

	const pathname = $derived(page.url.pathname);
	const isLoginPage = $derived(pathname.startsWith('/m/login'));

	const isUserJukir = $derived(
		(data.user?.role || '').toUpperCase().includes('OFFICER') ||
		(data.user?.role || '').toUpperCase().includes('JUKIR') ||
		pathname.startsWith('/m/jukir')
	);

	// In Android, JukirBottomNavBar is only visible on main home and settings screen
	const showJukirNavBar = $derived(
		isUserJukir &&
		(pathname === '/m/jukir' || pathname === '/m/settings/profile')
	);

	const activeTab = $derived(
		pathname.startsWith('/m/settings') ? 'SETTINGS' :
		pathname.startsWith('/m/jukir/vehicle/scan') ? 'ACTIVITY' : 'HOME'
	);

	async function refreshPendingCount() {
		try {
			pendingOfflineCount = await offlineStorage.getPendingCount();
		} catch (e) {
			console.error('Error getting pending count:', e);
		}
	}

	async function triggerSync() {
		if (!isOnline || isSyncing || pendingOfflineCount === 0) return;
		isSyncing = true;
		try {
			const items = await offlineStorage.getPendingCheckIns();
			for (const item of items) {
				try {
					await offlineStorage.updateStatus(item.id, 'SYNCING');
					const res = await fetch(API_ENDPOINTS.PARKING.SESSIONS.CHECKIN, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-Idempotency-Key': item.idempotency_key
						},
						body: JSON.stringify({
							plate_number: item.plate_number,
							vehicle_type: item.vehicle_type,
							branch_id: item.branch_id,
							gate_id: item.gate_id
						})
					});
					if (res.ok) {
						await offlineStorage.removePendingCheckIn(item.id);
					} else {
						const err = await res.json().catch(() => ({}));
						await offlineStorage.updateStatus(item.id, 'FAILED', err.message || 'Gagal sinkron');
					}
				} catch (err: any) {
					await offlineStorage.updateStatus(item.id, 'FAILED', err.message);
				}
			}
			await refreshPendingCount();
		} catch (e) {
			console.error('Sync failed:', e);
		} finally {
			isSyncing = false;
		}
	}

	onMount(() => {
		isOnline = navigator.onLine;
		refreshPendingCount();

		const handleOnline = () => {
			isOnline = true;
			triggerSync();
		};
		const handleOffline = () => {
			isOnline = false;
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
		window.addEventListener('focus', refreshPendingCount);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
			window.removeEventListener('focus', refreshPendingCount);
		};
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
	<meta name="theme-color" content="#03045E" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<title>LineSpot Mobile</title>
</svelte:head>

{#if isLoginPage}
	<!-- Halaman Login Fullscreen Midnight Theme -->
	{@render children()}
{:else}
	<!-- Layout Daytime Liquid Glass Ambient Backdrop -->
	<LiquidGlassAmbientBackdrop>
		<div class="min-h-screen flex justify-center relative select-none">
			<div class="w-full max-w-md min-h-screen flex flex-col relative {showJukirNavBar ? 'pb-24' : 'pb-6'}">
				
				<!-- Offline Pending Sync Alert (If items queued offline) -->
				{#if pendingOfflineCount > 0}
					<div class="px-4 pt-3 z-30">
						<div class="bg-[#0077B6] text-white text-xs px-4 py-2 rounded-2xl flex items-center justify-between shadow-lg shadow-[#0077B6]/30">
							<span class="text-[11px] font-semibold">⚡ {pendingOfflineCount} antrean parkir tersimpan lokal</span>
							<button
								onclick={triggerSync}
								disabled={!isOnline || isSyncing}
								class="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl transition flex items-center gap-1 active:scale-95"
							>
								<RefreshCwIcon class="w-3 h-3 {isSyncing ? 'animate-spin' : ''}" />
								{isSyncing ? 'Sinkron...' : 'Kirim'}
							</button>
						</div>
					</div>
				{/if}

				<!-- Main Content View -->
				<main class="flex-1 flex flex-col p-4 overflow-y-auto">
					{@render children()}
				</main>

				<!-- ── Floating Liquid Glass Segmented Pill Dock (Identik JukirBottomNavBar.kt) ── -->
				{#if showJukirNavBar}
					<div class="fixed bottom-3 inset-x-0 flex justify-center z-40 px-6 pointer-events-none">
						<div class="w-full max-w-xs pointer-events-auto">
							<LiquidGlassCard variant="light" hasTopGloss={true} class="rounded-full shadow-2xl shadow-[#023E8A]/25 p-1 border-[1.5px] border-white/90">
								<div class="flex items-center justify-between relative">
									<!-- Tab 1: Home -->
									<a
										href="/m/jukir"
										class="flex-1 py-2 rounded-full text-center transition flex flex-col items-center justify-center {activeTab === 'HOME' ? 'bg-[#0077B6] text-white font-black shadow-md shadow-[#0077B6]/40' : 'text-[#64748B] hover:text-[#03045E] font-medium'}"
									>
										<HomeIcon class="w-4 h-4 mb-0.5" />
										<span class="text-[10px]">Home</span>
									</a>

									<!-- Tab 2: Activity (Camera OCR Scan - Identik JukirTab.ACTIVITY) -->
									<a
										href="/m/jukir/vehicle/scan"
										class="flex-1 py-2 rounded-full text-center transition flex flex-col items-center justify-center {activeTab === 'ACTIVITY' ? 'bg-[#0077B6] text-white font-black shadow-md shadow-[#0077B6]/40' : 'text-[#64748B] hover:text-[#03045E] font-medium'}"
									>
										<CameraIcon class="w-4 h-4 mb-0.5" />
										<span class="text-[10px]">Activity</span>
									</a>

									<!-- Tab 3: Settings (Identik JukirTab.SETTINGS) -->
									<a
										href="/m/settings/profile"
										class="flex-1 py-2 rounded-full text-center transition flex flex-col items-center justify-center {activeTab === 'SETTINGS' ? 'bg-[#0077B6] text-white font-black shadow-md shadow-[#0077B6]/40' : 'text-[#64748B] hover:text-[#03045E] font-medium'}"
									>
										<SettingsIcon class="w-4 h-4 mb-0.5" />
										<span class="text-[10px]">Settings</span>
									</a>
								</div>
							</LiquidGlassCard>
						</div>
					</div>
				{/if}

			</div>
		</div>
	</LiquidGlassAmbientBackdrop>
{/if}
