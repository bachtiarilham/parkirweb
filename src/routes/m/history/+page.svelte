<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import CarIcon from '@lucide/svelte/icons/car';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import FilterIcon from '@lucide/svelte/icons/filter';
	import { formatCurrency } from '$lib/utils/format-currency';
	import DateRangeFilterModal, { type RangePreset } from '$lib/components/m/DateRangeFilterModal.svelte';

	let { data } = $props();

	let filterTab = $state<'ALL' | 'PARKIR' | 'MEMBER'>('ALL');
	let isFilterModalOpen = $state(false);
	let selectedDatePreset = $state<RangePreset>('ALL');
	let customStartDate = $state('');
	let customEndDate = $state('');

	function safeParseTime(timeVal: any): number {
		if (!timeVal) return 0;
		try {
			const str = String(timeVal).replace(' ', 'T');
			const parsed = new Date(str).getTime();
			return isNaN(parsed) ? 0 : parsed;
		} catch {
			return 0;
		}
	}

	function formatDisplayDate(timeVal: any): string {
		if (!timeVal) return 'Hari Ini';
		try {
			const str = String(timeVal).replace(' ', 'T');
			const d = new Date(str);
			if (isNaN(d.getTime())) return 'Hari Ini';
			return d.toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return 'Hari Ini';
		}
	}

	const filteredSessions = $derived.by(() => {
		const raw = (data.sessions || []) as any[];
		const now = Date.now();

		return raw.filter((s: any) => {
			if (!s) return false;

			// Tab filter
			if (filterTab === 'PARKIR' && s.is_membership) return false;
			if (filterTab === 'MEMBER' && !s.is_membership) return false;

			// Date preset filter
			const itemTime = safeParseTime(s.check_in_time);

			if (selectedDatePreset === 'TODAY') {
				if (!itemTime) return true;
				const todayStr = new Date().toISOString().slice(0, 10);
				const itemDateStr = new Date(itemTime).toISOString().slice(0, 10);
				return itemDateStr === todayStr;
			}

			if (selectedDatePreset === '7DAYS') {
				if (!itemTime) return true;
				const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
				return itemTime >= sevenDaysAgo;
			}

			if (selectedDatePreset === '30DAYS') {
				if (!itemTime) return true;
				const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
				return itemTime >= thirtyDaysAgo;
			}

			if (selectedDatePreset === 'CUSTOM' && customStartDate && customEndDate) {
				if (!itemTime) return true;
				const startMs = new Date(customStartDate).getTime();
				const endMs = new Date(customEndDate + 'T23:59:59').getTime();
				return itemTime >= startMs && itemTime <= endMs;
			}

			return true;
		});
	});

	function handleApplyFilter(preset: RangePreset, start?: string, end?: string) {
		selectedDatePreset = preset;
		if (start) customStartDate = start;
		if (end) customEndDate = end;
	}

	function handleBack() {
		if (typeof window !== 'undefined' && window.history.length > 1) {
			window.history.back();
		} else {
			goto('/m/jukir');
		}
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Header (Identik TransactionHistoryScreen.kt) ────────── -->
	<div class="flex items-center justify-between pt-1">
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={handleBack}
				class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition cursor-pointer"
				aria-label="Kembali"
			>
				<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
			</button>
			<h1 class="text-lg font-black text-[#03045E] tracking-tight">
				Riwayat Transaksi
			</h1>
		</div>

		<!-- Date Filter Button -->
		<button
			type="button"
			onclick={() => (isFilterModalOpen = true)}
			class="w-10 h-10 rounded-full border border-slate-200 bg-white/80 hover:bg-white flex items-center justify-center text-[#0077B6] shadow-sm active:scale-95 transition cursor-pointer {selectedDatePreset !== 'ALL' ? 'ring-2 ring-[#0077B6] bg-sky-50' : ''}"
			aria-label="Filter Tanggal"
		>
			<FilterIcon class="w-4 h-4" />
		</button>
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
			{#each filteredSessions as item (item.unique_id || item.id)}
				<a
					href={item.item_type === 'PARKING' ? `/m/jukir/session/detail/${item.id}` : `/m/history/detail/${item.id}`}
					class="block group"
				>
					<LiquidGlassCard variant="light" hasTopGloss={false} class="p-4 group-hover:border-sky-400 transition">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="w-11 h-11 rounded-2xl bg-sky-50 text-[#0077B6] flex items-center justify-center border border-sky-100 font-bold shrink-0">
									{#if (item.vehicle_type || '').toUpperCase().includes('MOTOR')}
										<BikeIcon class="w-5 h-5" />
									{:else if (item.vehicle_type || '').toUpperCase().includes('TRUK') || (item.vehicle_type || '').toUpperCase().includes('TRUCK')}
										<TruckIcon class="w-5 h-5" />
									{:else}
										<CarIcon class="w-5 h-5" />
									{/if}
								</div>

								<div class="min-w-0">
									<div class="font-black text-sm text-[#03045E] tracking-wider truncate">
										{item.plate_number || 'KENDARAAN'}
									</div>
									<div class="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5 truncate">
										<span class="capitalize">{item.vehicle_type || 'Mobil'}</span>
										<span>•</span>
										<span>{formatDisplayDate(item.check_in_time)}</span>
									</div>
								</div>
							</div>

							<div class="text-right flex items-center gap-2 shrink-0">
								<div>
									<div class="text-xs font-black text-[#0077B6]">
										{formatCurrency(Number(item.amount) || 0)}
									</div>
									<span class="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 {item.status === 'COMPLETED' || item.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}">
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
			<div class="text-[11px] text-slate-400 mt-0.5">
				{selectedDatePreset !== 'ALL' ? 'Tidak ada data untuk rentang filter ini' : 'Transaksi parkir Anda akan dicatat di sini'}
			</div>
		</LiquidGlassCard>
	{/if}

	<!-- Date Filter Modal -->
	<DateRangeFilterModal
		isOpen={isFilterModalOpen}
		selectedPreset={selectedDatePreset}
		startDate={customStartDate}
		endDate={customEndDate}
		onClose={() => (isFilterModalOpen = false)}
		onApply={handleApplyFilter}
	/>
</div>
