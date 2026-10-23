<script lang="ts">
	import InfoIcon from '@lucide/svelte/icons/info';

	let {
		isOpen = false,
		featureName = 'Fitur Ini',
		onClose = () => {}
	} = $props<{
		isOpen?: boolean;
		featureName?: string;
		onClose?: () => void;
	}>();
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
		<div class="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-center space-y-4">
			<!-- Info Icon in Blue Halo Circle -->
			<div class="w-16 h-16 rounded-full bg-[#E0F2FE] text-[#0077B6] flex items-center justify-center mx-auto shadow-inner">
				<InfoIcon class="w-9 h-9 stroke-[2.2]" />
			</div>

			<!-- Title & Message -->
			<div class="space-y-1.5">
				<h2 class="text-xl font-bold text-[#03045E] tracking-tight">Fitur Belum Tersedia</h2>
				<p class="text-xs text-[#64748B] leading-relaxed max-w-xs mx-auto">
					Maaf, fitur <strong class="text-[#03045E]">{featureName}</strong> saat ini masih dalam tahap pengembangan dan akan segera aktif pada pembaruan mendatang.
				</p>
			</div>

			<!-- Confirm Button -->
			<div class="pt-2">
				<button
					type="button"
					onclick={onClose}
					class="w-full py-3.5 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/30 active:scale-98 transition cursor-pointer"
				>
					Mengerti
				</button>
			</div>
		</div>
	</div>
{/if}
