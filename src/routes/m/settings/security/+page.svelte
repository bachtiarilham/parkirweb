<script lang="ts">
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import LockIcon from '@lucide/svelte/icons/lock';
	import KeyIcon from '@lucide/svelte/icons/key';

	let currentPass = $state('');
	let newPass = $state('');
	let isSaved = $state(false);

	function handleSave() {
		if (!currentPass || !newPass) {
			alert('Mohon isi kata sandi saat ini dan kata sandi baru');
			return;
		}
		isSaved = true;
		setTimeout(() => (isSaved = false), 3000);
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- Top Header -->
	<div class="flex items-center gap-3 pt-1">
		<button
			onclick={() => history.back()}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Keamanan & PIN
		</h1>
	</div>

	<!-- Form Keamanan -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-5 space-y-4">
		<div class="flex items-center gap-3 mb-2">
			<div class="w-10 h-10 rounded-xl bg-sky-50 text-[#0077B6] flex items-center justify-center border border-sky-100">
				<KeyIcon class="w-5 h-5" />
			</div>
			<div>
				<h3 class="text-xs font-bold text-[#03045E]">Ubah Kata Sandi</h3>
				<p class="text-[10px] text-[#64748B]">Perbarui kata sandi Anda secara berkala</p>
			</div>
		</div>

		<div class="space-y-3">
			<div>
				<label for="cur-pass" class="text-[11px] font-bold text-[#64748B] block mb-1">Kata Sandi Saat Ini</label>
				<input
					id="cur-pass"
					type="password"
					bind:value={currentPass}
					class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0077B6]"
					placeholder="••••••••"
				/>
			</div>

			<div>
				<label for="new-pass" class="text-[11px] font-bold text-[#64748B] block mb-1">Kata Sandi Baru</label>
				<input
					id="new-pass"
					type="password"
					bind:value={newPass}
					class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0077B6]"
					placeholder="Minimal 8 karakter"
				/>
			</div>
		</div>

		{#if isSaved}
			<div class="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-700 font-bold text-center">
				Kata sandi berhasil diperbarui!
			</div>
		{/if}

		<button
			type="button"
			onclick={handleSave}
			class="w-full py-3 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/20 active:scale-95 transition"
		>
			Simpan Perubahan
		</button>
	</LiquidGlassCard>
</div>
