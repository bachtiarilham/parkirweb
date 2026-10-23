<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import CarIcon from '@lucide/svelte/icons/car';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import FilterIcon from '@lucide/svelte/icons/filter';
	import { formatCurrency } from '$lib/utils/format-currency';
	import DateRangeFilterModal, { type RangePreset } from '$lib/components/m/DateRangeFilterModal.svelte';

	let { data } = $props();

	let selectedRange = $state<RangePreset>('TODAY');
	let isFilterModalOpen = $state(false);
	let customStartDate = $state('');
	let customEndDate = $state('');

	// Simulated daily bar chart
	const chartDays = [
		{ day: 'Sen', amount: 140000, height: '40%' },
		{ day: 'Sel', amount: 190000, height: '55%' },
		{ day: 'Rab', amount: 160000, height: '48%' },
		{ day: 'Kam', amount: 220000, height: '65%' },
		{ day: 'Jum', amount: 280000, height: '80%' },
		{ day: 'Sab', amount: 350000, height: '100%' },
		{ day: 'Min', amount: 240000, height: '70%' }
	];

	function handleDownload() {
		alert('Laporan berhasil diunduh dalam format PDF.');
	}

	function handleApplyFilter(preset: RangePreset, start?: string, end?: string) {
		selectedRange = preset;
		if (start) customStartDate = start;
		if (end) customEndDate = end;
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. SimpleHeader (Identik TransactionReportScreen.kt) ───────── -->
	<div class="flex items-center justify-between pt-1">
		<div class="flex items-center gap-3">
			<button
				onclick={() => goto('/m/jukir')}
				class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
				aria-label="Kembali"
			>
				<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
			</button>
			<h1 class="text-lg font-black text-[#03045E] tracking-tight">
				Laporan
			</h1>
		</div>

		<!-- Filter Button -->
		<button
			type="button"
			onclick={() => (isFilterModalOpen = true)}
			class="w-10 h-10 rounded-full border border-slate-200 bg-white/80 hover:bg-white flex items-center justify-center text-[#0077B6] shadow-2xs active:scale-95 transition cursor-pointer"
			aria-label="Filter Tanggal"
		>
			<FilterIcon class="w-4 h-4" />
		</button>
	</div>

	<!-- ── 2. FilterCard (Date Range Selector) ───────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3">
		<div class="flex items-center justify-between mb-2">
			<div class="flex items-center gap-1.5 text-xs font-bold text-[#03045E]">
				<CalendarIcon class="w-3.5 h-3.5 text-[#0077B6]" />
				<span>Periode Laporan</span>
			</div>
			<button
				type="button"
				onclick={() => (isFilterModalOpen = true)}
				class="text-[10px] text-[#0077B6] font-bold hover:underline"
			>
				Pilih Tanggal ▾
			</button>
		</div>

		<div class="grid grid-cols-4 gap-1.5">
			<button
				type="button"
				onclick={() => (selectedRange = 'TODAY')}
				class="py-1.5 px-2 rounded-xl text-xs font-bold transition text-center {selectedRange === 'TODAY' ? 'bg-[#0077B6] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
			>
				Hari Ini
			</button>
			<button
				type="button"
				onclick={() => (selectedRange = '7DAYS')}
				class="py-1.5 px-2 rounded-xl text-xs font-bold transition text-center {selectedRange === '7DAYS' ? 'bg-[#0077B6] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
			>
				7 Hari
			</button>
			<button
				type="button"
				onclick={() => (selectedRange = '30DAYS')}
				class="py-1.5 px-2 rounded-xl text-xs font-bold transition text-center {selectedRange === '30DAYS' ? 'bg-[#0077B6] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
			>
				30 Hari
			</button>
			<button
				type="button"
				onclick={() => (isFilterModalOpen = true)}
				class="py-1.5 px-2 rounded-xl text-xs font-bold transition text-center {selectedRange === 'CUSTOM' ? 'bg-[#0077B6] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
			>
				Kustom
			</button>
		</div>
	</LiquidGlassCard>

	<!-- ── 3. ChartCard (Financial Summary & Daily Bar Chart) ────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-5">
		<div class="mb-4">
			<div class="text-[11px] text-[#64748B] font-semibold">Total Pendapatan</div>
			<div class="text-3xl font-black text-[#0077B6] tracking-tight mt-0.5">
				{formatCurrency(data.totalAmount || 350000)}
			</div>
			<div class="text-xs text-[#64748B] mt-0.5">
				{data.totalTransactions || 42} Total Transaksi Tercatat
			</div>
		</div>

		<!-- Bar Chart Bars -->
		<div class="h-36 pt-6 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
			{#each chartDays as item}
				<div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
					<div
						class="w-full max-w-[28px] bg-gradient-to-t from-[#0077B6] to-[#00B4D8] rounded-t-lg transition-all group-hover:brightness-110 shadow-sm"
						style="height: {item.height};"
					></div>
					<span class="text-[10px] font-bold text-slate-500">{item.day}</span>
				</div>
			{/each}
		</div>
	</LiquidGlassCard>

	<!-- ── 4. SummaryMetric 3 Cards Row ─────────────────────────────── -->
	<div class="grid grid-cols-3 gap-2.5">
		<!-- 1. Parking Metric -->
		<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3 text-center">
			<div class="w-8 h-8 rounded-lg bg-sky-50 text-[#0077B6] flex items-center justify-center mx-auto mb-1.5 border border-sky-100">
				<CarIcon class="w-4 h-4" />
			</div>
			<div class="text-[10px] text-[#64748B] font-medium">Parking</div>
			<div class="text-sm font-bold text-[#03045E] mt-0.5">{data.parkingCount || 38}</div>
		</LiquidGlassCard>

		<!-- 2. Transfer Metric -->
		<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3 text-center">
			<div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 border border-emerald-100">
				<ArrowUpIcon class="w-4 h-4" />
			</div>
			<div class="text-[10px] text-[#64748B] font-medium">Transfer</div>
			<div class="text-sm font-bold text-[#03045E] mt-0.5">{data.transferCount || 4}</div>
		</LiquidGlassCard>

		<!-- 3. Top Up Metric -->
		<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3 text-center">
			<div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1.5 border border-amber-100">
				<ArrowDownIcon class="w-4 h-4" />
			</div>
			<div class="text-[10px] text-[#64748B] font-medium">Top Up</div>
			<div class="text-sm font-bold text-[#03045E] mt-0.5">{data.topUpCount || 0}</div>
		</LiquidGlassCard>
	</div>

	<!-- ── 5. Vehicle Breakdown Card (Motor / Mobil / Truk) ──────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={false} class="p-4 space-y-3">
		<h3 class="text-xs font-black text-[#03045E] uppercase tracking-wider">
			Distribusi Kendaraan
		</h3>

		<div class="space-y-2 text-xs">
			<div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
				<div class="flex items-center gap-2">
					<BikeIcon class="w-4 h-4 text-[#0077B6]" />
					<span class="font-bold text-[#03045E]">Sepeda Motor</span>
				</div>
				<span class="font-black text-slate-800">28 Unit</span>
			</div>

			<div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
				<div class="flex items-center gap-2">
					<CarIcon class="w-4 h-4 text-[#023E8A]" />
					<span class="font-bold text-[#03045E]">Mobil Pribadi</span>
				</div>
				<span class="font-black text-slate-800">12 Unit</span>
			</div>

			<div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
				<div class="flex items-center gap-2">
					<TruckIcon class="w-4 h-4 text-amber-600" />
					<span class="font-bold text-[#03045E]">Truk / Bus</span>
				</div>
				<span class="font-black text-slate-800">2 Unit</span>
			</div>
		</div>
	</LiquidGlassCard>

	<!-- ── 6. Download Button ────────────────────────────────────────── -->
	<button
		type="button"
		onclick={handleDownload}
		class="w-full py-3.5 rounded-2xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/30 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
	>
		<DownloadIcon class="w-4 h-4" />
		<span>Unduh Laporan Shift (PDF)</span>
	</button>

	<!-- Date Filter Modal -->
	<DateRangeFilterModal
		isOpen={isFilterModalOpen}
		selectedPreset={selectedRange}
		startDate={customStartDate}
		endDate={customEndDate}
		onClose={() => (isFilterModalOpen = false)}
		onApply={handleApplyFilter}
	/>
</div>
