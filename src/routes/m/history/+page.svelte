<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import CarIcon from '@lucide/svelte/icons/car';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { formatCurrency } from '$lib/utils/format-currency';

	let { data } = $props();

	let filterTab = $state<'ALL' | 'PARKIR' | 'MEMBER'>('ALL');

	const filteredSessions = $derived(
		(data.sessions || []).filter((s: any) => {
			if (filterTab === 'ALL') return true;
			if (filterTab === 'PARKIR') return !s.is_membership;
			if (filterTab === 'MEMBER') return s.is_membership;
			return true;
		})
	);
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Header (Identik TransactionHistoryScreen.kt) ────────── -->
	<div class="flex items-center gap-3 pt-1">
		<button
			onclick={() => history.back()}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Riwayat Transaksi
		</h1>
	</div>

	<!-- ── 2. Tab Segment Bar ───────────────────────────────────────── -->
	<div class="p-1 rounded-2xl bg-slate-200/60 backdrop-blur-md flex items-center gap-1">
		<button
			type="button"
			onclick={() => (filterTab = 'ALL')}
			class="flex-1 py-2 rounded-xl text-xs font-bold transition text-center {filterTab === 'ALL' ? 'bg-white text-[#03045E] shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
		>
			Semua
		</button>
		<button
			type="button"
			onclick={() => (filterTab = 'PARKIR')}
			class="flex-1 py-2 rounded-xl text-xs font-bold transition text-center {filterTab === 'PARKIR' ? 'bg-white text-[#03045E] shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
		>
			Parkir
		</button>
		<button
			type="button"
			onclick={() => (filterTab = 'MEMBER')}
			class="flex-1 py-2 rounded-xl text-xs font-bold transition text-center {filterTab === 'MEMBER' ? 'bg-white text-[#03045E] shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
		>
			Membership
		</button>
	</div>

	<!-- ── 3. Transaction Items List ────────────────────────────────── -->
	{#if filteredSessions && filteredSessions.length > 0}
		<div class="space-y-2.5">
			{#each filteredSessions as item (item.id)}
				<a
					href="/m/history/detail/{item.id}"
					class="block group"
				>
					<LiquidGlassCard variant="light" hasTopGloss={false} class="p-4 group-hover:border-sky-400 transition">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="w-11 h-11 rounded-2xl bg-sky-50 text-[#0077B6] flex items-center justify-center border border-sky-100 font-bold">
									{#if (item.vehicle_type || '').toUpperCase().includes('MOTOR')}
										<BikeIcon class="w-5 h-5" />
									{:else if (item.vehicle_type || '').toUpperCase().includes('TRUK')}
										<TruckIcon class="w-5 h-5" />
									{:else}
										<CarIcon class="w-5 h-5" />
									{/if}
								</div>

								<div>
									<div class="font-black text-sm text-[#03045E] tracking-wider">
										{item.plate_number || 'B 1234 XYZ'}
									</div>
									<div class="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
										<span class="capitalize">{item.vehicle_type || 'Mobil'}</span>
										<span>•</span>
										<span>{item.check_in_time ? new Date(item.check_in_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Hari Ini'}</span>
									</div>
								</div>
							</div>

							<div class="text-right flex items-center gap-2">
								<div>
									<div class="text-xs font-black text-[#0077B6]">
										{formatCurrency(Number(item.amount) || 2000)}
									</div>
									<span class="text-[9px] font-bold px-2 py-0.5 rounded-full {item.status === 'COMPLETED' || item.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}">
										{item.status === 'COMPLETED' || item.status === 'PAID' ? 'Selesai' : 'Aktif'}
									</span>
								</div>
								<ChevronRightIcon class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
							</div>
						</div>
					</LiquidGlassCard>
				</a>
			{/each}
		</div>
	{:else}
		<LiquidGlassCard variant="light" class="p-10 text-center">
			<CalendarIcon class="w-10 h-10 text-slate-300 mx-auto mb-2" />
			<div class="text-xs font-bold text-[#64748B]">Belum ada riwayat transaksi</div>
			<div class="text-[11px] text-slate-400 mt-0.5">Transaksi parkir Anda akan dicatat di sini</div>
		</LiquidGlassCard>
	{/if}
</div>
