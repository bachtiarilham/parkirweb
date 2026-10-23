<script lang="ts">
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';

	let {
		isOpen = false,
		currentLang = 'ID',
		onClose = () => {},
		onSelectLang = (lang: string) => {}
	} = $props<{
		isOpen?: boolean;
		currentLang?: string;
		onClose?: () => void;
		onSelectLang?: (lang: string) => void;
	}>();

	function select(lang: string) {
		onSelectLang(lang);
		onClose();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
		<div class="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
			<!-- Header Icon -->
			<div class="text-center space-y-1.5">
				<div class="w-14 h-14 rounded-full bg-[#E0F2FE] text-[#0077B6] flex items-center justify-center mx-auto">
					<GlobeIcon class="w-7 h-7" />
				</div>
				<h3 class="text-lg font-black text-[#03045E]">Pilih Bahasa</h3>
				<p class="text-xs text-[#64748B]">Tentukan bahasa utama antarmuka aplikasi</p>
			</div>

			<!-- Options -->
			<div class="space-y-2 pt-2">
				<!-- Bahasa Indonesia -->
				<button
					type="button"
					onclick={() => select('ID')}
					class="w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition {currentLang === 'ID' ? 'border-[#0077B6] bg-sky-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}"
				>
					<div>
						<div class="text-sm font-bold {currentLang === 'ID' ? 'text-[#0077B6]' : 'text-[#03045E]'}">
							Bahasa Indonesia
						</div>
						<div class="text-[11px] text-[#64748B]">Indonesian (ID)</div>
					</div>
					{#if currentLang === 'ID'}
						<div class="w-6 h-6 rounded-full bg-[#0077B6] text-white flex items-center justify-center">
							<CheckIcon class="w-4 h-4 stroke-[2.5]" />
						</div>
					{/if}
				</button>

				<!-- English US -->
				<button
					type="button"
					onclick={() => select('EN')}
					class="w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition {currentLang === 'EN' ? 'border-[#0077B6] bg-sky-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}"
				>
					<div>
						<div class="text-sm font-bold {currentLang === 'EN' ? 'text-[#0077B6]' : 'text-[#03045E]'}">
							English (US)
						</div>
						<div class="text-[11px] text-[#64748B]">United States</div>
					</div>
					{#if currentLang === 'EN'}
						<div class="w-6 h-6 rounded-full bg-[#0077B6] text-white flex items-center justify-center">
							<CheckIcon class="w-4 h-4 stroke-[2.5]" />
						</div>
					{/if}
				</button>
			</div>

			<!-- Cancel Button -->
			<div class="pt-2">
				<button
					type="button"
					onclick={onClose}
					class="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
