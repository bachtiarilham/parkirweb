<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import CrownIcon from '@lucide/svelte/icons/crown';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import CarIcon from '@lucide/svelte/icons/car';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { formatCurrency } from '$lib/utils/format-currency';

	let { data } = $props();

	const contract = $derived(data.contract);
	const isActive = $derived((contract?.status || '').toUpperCase() === 'ACTIVE');

	let showAddPlateModal = $state(false);
	let newPlate = $state('');

	function handleAddPlate() {
		if (newPlate.trim()) {
			contract.license_plates.push(newPlate.trim().toUpperCase());
			newPlate = '';
			showAddPlateModal = false;
		}
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Top Header ────────────────────────────────────────────── -->
	<div class="flex items-center gap-3 pt-1">
		<button
			onclick={() => history.back()}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Detail Membership
		</h1>
	</div>

	<!-- ── 2. VIP Gold Status Card ──────────────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-6 border-amber-300/80 bg-gradient-to-b from-amber-50/50 via-white to-sky-50/30">
		<div class="flex items-start justify-between">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFB300] to-[#FFD54F] text-slate-950 flex items-center justify-center shadow-md shadow-amber-400/20">
					<CrownIcon class="w-7 h-7 stroke-[2.2]" />
				</div>
				<div>
					<span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-900 border border-amber-300/60 inline-block mb-1">
						{contract.plan_code}
					</span>
					<h2 class="text-base font-black text-[#03045E] leading-tight">
						{contract.plan_name}
					</h2>
				</div>
			</div>

			<span class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase {isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
				{isActive ? 'Aktif' : 'Kedaluwarsa'}
			</span>
		</div>

		<!-- Countdown & Validity -->
		<div class="my-5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2 text-xs text-[#64748B]">
					<CalendarIcon class="w-4 h-4 text-[#0077B6]" />
					<span>Masa Berlaku</span>
				</div>
				<div class="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
					{contract.days_remaining} Hari Tersisa
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
				<div>
					<div class="text-[10px] text-slate-400">Tanggal Mulai</div>
					<div class="font-bold text-slate-800 mt-0.5">
						{new Date(contract.started_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
					</div>
				</div>
				<div>
					<div class="text-[10px] text-slate-400">Jatuh Tempo</div>
					<div class="font-bold text-slate-800 mt-0.5">
						{new Date(contract.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
					</div>
				</div>
			</div>
		</div>

		<!-- Card No & Tag -->
		<div class="flex items-center justify-between text-xs text-[#64748B] pt-1">
			<span class="flex items-center gap-1.5 font-mono">
				<CreditCardIcon class="w-4 h-4 text-[#0077B6]" />
				<span>{contract.rfid_card_no}</span>
			</span>
			<span class="font-black text-[#0077B6]">{formatCurrency(contract.price)} / bln</span>
		</div>
	</LiquidGlassCard>

	<!-- ── 3. Registered Vehicles ────────────────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={false} class="p-5 space-y-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<CarIcon class="w-4 h-4 text-[#0077B6]" />
				<h3 class="text-xs font-black text-[#03045E] uppercase tracking-wider">
					Kendaraan Terdaftar ({contract.license_plates.length})
				</h3>
			</div>

			<button
				type="button"
				onclick={() => (showAddPlateModal = true)}
				class="text-xs font-bold text-[#0077B6] hover:underline flex items-center gap-1 cursor-pointer"
			>
				<PlusIcon class="w-3.5 h-3.5" />
				<span>Tambah Plat</span>
			</button>
		</div>

		<div class="space-y-2">
			{#each contract.license_plates as plate}
				<div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
					<div class="flex items-center gap-2.5">
						<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
						<span class="font-mono font-black text-sm text-[#03045E] tracking-wider">{plate}</span>
					</div>
					<span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
						Terverifikasi
					</span>
				</div>
			{/each}
		</div>
	</LiquidGlassCard>

	<!-- ── 4. Membership Benefits ────────────────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={false} class="p-5 space-y-3">
		<div class="flex items-center gap-2">
			<ShieldCheckIcon class="w-4 h-4 text-emerald-600" />
			<h3 class="text-xs font-black text-[#03045E] uppercase tracking-wider">
				Keuntungan Paket Aktif
			</h3>
		</div>

		<ul class="space-y-2 text-xs text-[#64748B]">
			{#each contract.features as feat}
				<li class="flex items-center gap-2.5">
					<CheckCircleIcon class="w-4 h-4 text-emerald-500 shrink-0" />
					<span class="leading-relaxed">{feat}</span>
				</li>
			{/each}
		</ul>
	</LiquidGlassCard>

	<!-- ── 5. Action Buttons ─────────────────────────────────────────── -->
	<div class="pt-2 space-y-2">
		<a
			href="/m/customer/membership/purchase?renew=true"
			class="w-full py-4 rounded-2xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-black text-xs shadow-xl shadow-[#0077B6]/30 active:scale-98 transition flex items-center justify-center gap-2"
		>
			<span>Perpanjang Paket Sekarang</span>
			<ArrowRightIcon class="w-4 h-4" />
		</a>

		<a
			href="/m/customer/membership"
			class="w-full py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#03045E] font-bold text-xs flex items-center justify-center transition"
		>
			Lihat Pilihan Paket Lainnya
		</a>
	</div>
</div>

<!-- Modal Tambah Plat Nomor -->
{#if showAddPlateModal}
	<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
			<div class="text-center space-y-1">
				<h3 class="text-base font-black text-[#03045E]">Tambah Plat Kendaraan</h3>
				<p class="text-xs text-[#64748B]">Masukkan nomor polisi kendaraan yang ingin didaftarkan ke paket membership ini.</p>
			</div>

			<div>
				<label for="modal-plate" class="text-[11px] font-bold text-slate-600 block mb-1">Nomor Polisi</label>
				<input
					id="modal-plate"
					type="text"
					bind:value={newPlate}
					placeholder="B 1234 XYZ"
					class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-black uppercase text-center focus:outline-none focus:border-[#0077B6]"
				/>
			</div>

			<div class="grid grid-cols-2 gap-2 pt-2">
				<button
					type="button"
					onclick={() => (showAddPlateModal = false)}
					class="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
				>
					Batal
				</button>
				<button
					type="button"
					onclick={handleAddPlate}
					disabled={!newPlate.trim()}
					class="py-3 rounded-xl bg-[#0077B6] text-white font-bold text-xs shadow-md shadow-[#0077B6]/30 disabled:opacity-50"
				>
					Simpan Plat
				</button>
			</div>
		</div>
	</div>
{/if}
