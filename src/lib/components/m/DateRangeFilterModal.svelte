<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import XIcon from '@lucide/svelte/icons/x';
	import CheckIcon from '@lucide/svelte/icons/check';

	export type RangePreset = 'ALL' | 'TODAY' | '7DAYS' | '30DAYS' | 'CUSTOM';

	let {
		isOpen = false,
		selectedPreset = 'ALL' as RangePreset,
		startDate = '',
		endDate = '',
		onClose = () => {},
		onApply = (preset: RangePreset, start?: string, end?: string) => {}
	} = $props<{
		isOpen?: boolean;
		selectedPreset?: RangePreset;
		startDate?: string;
		endDate?: string;
		onClose?: () => void;
		onApply?: (preset: RangePreset, start?: string, end?: string) => void;
	}>();

	let tempPreset = $state<RangePreset>('ALL');
	let tempStart = $state('');
	let tempEnd = $state('');

	$effect(() => {
		if (isOpen) {
			tempPreset = selectedPreset;
			tempStart = startDate;
			tempEnd = endDate;
		}
	});

	function handleSave() {
		onApply(tempPreset, tempStart, tempEnd);
		onClose();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
		<div class="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
			<!-- Header -->
			<div class="flex items-center justify-between pb-2 border-b border-slate-100">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 rounded-xl bg-sky-50 text-[#0077B6] flex items-center justify-center">
						<CalendarIcon class="w-4 h-4" />
					</div>
					<h3 class="text-sm font-black text-[#03045E]">Filter Rentang Tanggal</h3>
				</div>
				<button type="button" onclick={onClose} class="p-1 text-slate-400 hover:text-slate-700">
					<XIcon class="w-5 h-5" />
				</button>
			</div>

			<!-- Quick Presets -->
			<div class="space-y-1.5">
				<span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pilihan Cepat</span>
				<div class="grid grid-cols-2 gap-2">
					<button
						type="button"
						onclick={() => (tempPreset = 'ALL')}
						class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between {tempPreset === 'ALL' ? 'border-[#0077B6] bg-sky-50 text-[#0077B6]' : 'border-slate-200 text-slate-600'}"
					>
						<span>Semua Waktu</span>
						{#if tempPreset === 'ALL'}<CheckIcon class="w-4 h-4" />{/if}
					</button>

					<button
						type="button"
						onclick={() => (tempPreset = 'TODAY')}
						class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between {tempPreset === 'TODAY' ? 'border-[#0077B6] bg-sky-50 text-[#0077B6]' : 'border-slate-200 text-slate-600'}"
					>
						<span>Hari Ini</span>
						{#if tempPreset === 'TODAY'}<CheckIcon class="w-4 h-4" />{/if}
					</button>

					<button
						type="button"
						onclick={() => (tempPreset = '7DAYS')}
						class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between {tempPreset === '7DAYS' ? 'border-[#0077B6] bg-sky-50 text-[#0077B6]' : 'border-slate-200 text-slate-600'}"
					>
						<span>7 Hari Terakhir</span>
						{#if tempPreset === '7DAYS'}<CheckIcon class="w-4 h-4" />{/if}
					</button>

					<button
						type="button"
						onclick={() => (tempPreset = '30DAYS')}
						class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between {tempPreset === '30DAYS' ? 'border-[#0077B6] bg-sky-50 text-[#0077B6]' : 'border-slate-200 text-slate-600'}"
					>
						<span>30 Hari Terakhir</span>
						{#if tempPreset === '30DAYS'}<CheckIcon class="w-4 h-4" />{/if}
					</button>
				</div>
			</div>

			<!-- Custom Date Picker -->
			<div class="space-y-2 pt-2 border-t border-slate-100">
				<button
					type="button"
					onclick={() => (tempPreset = 'CUSTOM')}
					class="text-left text-xs font-bold {tempPreset === 'CUSTOM' ? 'text-[#0077B6]' : 'text-slate-700'}"
				>
					• Rentang Tanggal Kustom
				</button>

				{#if tempPreset === 'CUSTOM'}
					<div class="grid grid-cols-2 gap-2 animate-in fade-in duration-150">
						<div>
							<label for="start-dt" class="text-[10px] text-slate-500 font-bold block mb-1">Dari Tanggal</label>
							<input
								id="start-dt"
								type="date"
								bind:value={tempStart}
								class="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0077B6]"
							/>
						</div>
						<div>
							<label for="end-dt" class="text-[10px] text-slate-500 font-bold block mb-1">Sampai Tanggal</label>
							<input
								id="end-dt"
								type="date"
								bind:value={tempEnd}
								class="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0077B6]"
							/>
						</div>
					</div>
				{/if}
			</div>

			<!-- Action Buttons -->
			<div class="grid grid-cols-2 gap-2 pt-2">
				<button
					type="button"
					onclick={onClose}
					class="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
				>
					Batal
				</button>
				<button
					type="button"
					onclick={handleSave}
					class="py-3 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/30 cursor-pointer"
				>
					Terapkan Filter
				</button>
			</div>
		</div>
	</div>
{/if}
