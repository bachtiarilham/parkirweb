<script lang="ts">
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import CarIcon from '@lucide/svelte/icons/car';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import { formatCurrency } from '$lib/utils/format-currency';
	import { API_ENDPOINTS } from '$lib/api/endpoints.js';

	let { data } = $props();

	let selectedPlan = $state<any>(null);
	let licensePlate = $state('');
	let isCheckingOut = $state(false);
	let errorMessage = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	async function handleBuyPlan(plan: any) {
		selectedPlan = plan;
		errorMessage = null;
		successMessage = null;
	}

	async function submitCheckout() {
		if (!selectedPlan) return;
		if (!licensePlate.trim()) {
			errorMessage = 'Nomor plat kendaraan wajib diisi untuk mengaktifkan kartu membership.';
			return;
		}

		isCheckingOut = true;
		errorMessage = null;

		try {
			const res = await fetch(API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.BASE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					plan_id: selectedPlan.member_rider_plan_id || selectedPlan.id,
					rfid_card_no: licensePlate.toUpperCase().trim()
				})
			});

			const result = await res.json();
			if (!res.ok || !result.success) {
				throw new Error(result.message || 'Gagal memproses checkout paket');
			}

			const { snap_token, snap_redirect_url } = result.data || {};

			if (typeof window !== 'undefined' && (window as any).snap && snap_token) {
				(window as any).snap.pay(snap_token, {
					onSuccess: () => {
						successMessage = 'Pembayaran berhasil! Paket membership Anda telah aktif.';
						selectedPlan = null;
					},
					onPending: () => {
						successMessage = 'Menunggu pembayaran selesai. Silakan periksa instruksi di layar.';
					},
					onError: () => {
						errorMessage = 'Pembayaran gagal atau dibatalkan.';
					},
					onClose: () => {
						isCheckingOut = false;
					}
				});
			} else if (snap_redirect_url) {
				window.location.href = snap_redirect_url;
			} else {
				successMessage = 'Permintaan berhasil didaftarkan. Silakan selesaikan pembayaran.';
				selectedPlan = null;
			}
		} catch (err: any) {
			errorMessage = err.message || 'Terjadi kesalahan saat memproses langganan';
		} finally {
			isCheckingOut = false;
		}
	}
</script>

<svelte:head>
	<script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-client-demo"></script>
</svelte:head>

<div class="space-y-4">
	<!-- Top Bar -->
	<div class="flex items-center justify-between">
		<a href="/m/customer" class="inline-flex items-center text-xs font-bold text-[#0077B6] hover:text-[#03045E]">
			<ArrowLeftIcon class="w-4 h-4 mr-1" /> Kembali ke Home
		</a>
		<h1 class="text-xs font-black text-[#03045E] uppercase tracking-wider">Paket Langganan Parkir</h1>
		<div class="w-8"></div>
	</div>

	{#if successMessage}
		<LiquidGlassCard variant="light" class="p-4 border-emerald-300 bg-emerald-50/70 text-xs text-emerald-900 space-y-1">
			<div class="font-black flex items-center gap-1.5 text-emerald-800">
				<CheckCircleIcon class="w-4 h-4 text-emerald-600" />
				<span>Berhasil!</span>
			</div>
			<p>{successMessage}</p>
		</LiquidGlassCard>
	{/if}

	{#if errorMessage}
		<div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
			⚠️ {errorMessage}
		</div>
	{/if}

	<!-- Modal / Form Aktivasi Paket (Cobalt Card) -->
	{#if selectedPlan}
		<LiquidGlassCard variant="cobalt" class="p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
			<div class="flex items-start justify-between">
				<div>
					<span class="text-[10px] font-black uppercase text-[#03045E] bg-[#FF9F1C] px-2.5 py-0.5 rounded-full shadow-sm">
						KONFIRMASI PEMBELIAN
					</span>
					<h3 class="text-base font-black text-white mt-1.5">{selectedPlan.member_rider_plan_name}</h3>
					<p class="text-xs text-[#CAF0F8]">{selectedPlan.member_rider_plan_code}</p>
				</div>
				<button
					type="button"
					onclick={() => (selectedPlan = null)}
					class="text-xs text-[#ADE8F4] hover:text-white font-bold"
				>
					Batal
				</button>
			</div>

			<div class="bg-black/20 p-3 rounded-2xl flex items-center justify-between text-xs text-white border border-white/20">
				<span class="text-[#ADE8F4]">Harga ({selectedPlan.duration_days} Hari):</span>
				<span class="font-black text-base text-white">{formatCurrency(selectedPlan.member_rider_plan_price)}</span>
			</div>

			<div>
				<label for="plate" class="block text-xs font-bold text-[#CAF0F8] mb-1.5">
					Nomor Plat Kendaraan yang Didaftarkan
				</label>
				<input
					id="plate"
					type="text"
					bind:value={licensePlate}
					placeholder="B 1234 XYZ"
					class="w-full bg-white/20 border border-white/40 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-white placeholder-white/40 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-white"
				/>
				<span class="text-[10px] text-[#ADE8F4] mt-1 block">
					Kartu digital membership akan terhubung langsung ke nomor plat ini.
				</span>
			</div>

			<button
				type="button"
				onclick={submitCheckout}
				disabled={isCheckingOut || !licensePlate.trim()}
				class="w-full py-3.5 rounded-2xl bg-white text-[#03045E] font-black text-xs shadow-lg shadow-black/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 transition"
			>
				{#if isCheckingOut}
					<span class="w-4 h-4 border-2 border-[#03045E]/40 border-t-[#03045E] rounded-full animate-spin"></span>
					<span>Menyiapkan Pembayaran...</span>
				{:else}
					<span>Bayar Sekarang (Midtrans Snap / QRIS)</span>
				{/if}
			</button>
		</LiquidGlassCard>
	{/if}

	<!-- Available Plans List -->
	<div class="space-y-3">
		<h2 class="text-xs font-black text-[#03045E] uppercase tracking-wider px-1">
			Pilihan Paket Tersedia
		</h2>

		{#each data.plans as plan (plan.member_rider_plan_id)}
			<LiquidGlassCard variant="light" class="p-4 space-y-3">
				<div class="flex items-start justify-between">
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<span class="text-sm font-black text-[#03045E]">{plan.member_rider_plan_name}</span>
							{#if (plan.member_rider_plan_code || '').toUpperCase().includes('MTR') || (plan.member_rider_plan_code || '').toUpperCase().includes('MOTOR')}
								<span class="p-1 rounded-lg bg-[#CAF0F8] text-[#0077B6]" title="Motor">
									<BikeIcon class="w-3.5 h-3.5" />
								</span>
							{:else}
								<span class="p-1 rounded-lg bg-[#CAF0F8] text-[#023E8A]" title="Mobil">
									<CarIcon class="w-3.5 h-3.5" />
								</span>
							{/if}
						</div>
						<p class="text-xs text-[#64748B]">{plan.member_rider_plan_code}</p>
					</div>

					<div class="text-right shrink-0">
						<div class="text-sm font-black text-[#0077B6]">
							{formatCurrency(plan.member_rider_plan_price)}
						</div>
						<div class="text-[10px] text-[#64748B] font-bold">{plan.duration_days} Hari</div>
					</div>
				</div>

				<div class="border-t border-black/5 pt-3 flex items-center justify-between">
					<span class="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
						<ShieldCheckIcon class="w-3.5 h-3.5 text-emerald-600" />
						Akses Bebas Semua Titik
					</span>

					<button
						type="button"
						onclick={() => handleBuyPlan(plan)}
						class="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] text-white font-bold text-xs transition active:scale-95 shadow-md shadow-sky-600/20"
					>
						Pilih Paket
					</button>
				</div>
			</LiquidGlassCard>
		{/each}
	</div>
</div>
