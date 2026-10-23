<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthLiquidGlassBackdrop from '$lib/components/ui/liquid-glass/AuthLiquidGlassBackdrop.svelte';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import LockIcon from '@lucide/svelte/icons/lock';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import KeyIcon from '@lucide/svelte/icons/key';

	let { data, form } = $props();
	let password = $state('');
	let isLoading = $state(false);

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<svelte:head>
	<title>LineSpot - Layar Terkunci</title>
</svelte:head>

<AuthLiquidGlassBackdrop>
	<div class="min-h-screen flex flex-col justify-center items-center px-5 py-8 relative z-10">
		<!-- 1. Avatar User Badge -->
		<div class="relative mb-4 group">
			<div class="w-24 h-24 rounded-full bg-[#0F274E]/80 backdrop-blur-xl border-[1.5px] border-[#90E0EF]/50 shadow-2xl shadow-[#00B4D8]/30 flex items-center justify-center p-1 transition transform duration-500 hover:scale-105">
				<div class="absolute inset-x-2 top-0 h-10 rounded-t-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"></div>

				<div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#0096C7] to-[#023E8A] flex items-center justify-center shadow-inner border border-white/30 text-white font-black text-xl tracking-wider">
					{getInitials(data.user?.name || 'LineSpot')}
				</div>
			</div>
		</div>

		<!-- 2. User Name & Status -->
		<div class="text-center mb-6">
			<h1 class="text-2xl font-black text-white tracking-wider">{data.user?.name || 'Pengguna'}</h1>
			<p class="text-xs text-[#90E0EF] mt-1 font-medium">{data.user?.email || 'Sesi diamankan'}</p>
		</div>

		<!-- 3. Liquid Glass Card Container -->
		<div class="w-full max-w-md">
			<LiquidGlassCard variant="dark" class="p-6">
				{#if form?.message}
					<div class="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 font-medium">
						⚠️ {form.message}
					</div>
				{/if}

				<form
					method="POST"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							isLoading = false;
							await update();
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="password" class="block text-xs font-bold text-[#90E0EF] mb-1.5 tracking-wide">
							Kata Sandi Akun
						</label>
						<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
							<LockIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="password"
								name="password"
								type="password"
								bind:value={password}
								required
								placeholder="Masukkan sandi untuk membuka"
								class="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-white placeholder-[#90E0EF]/40 font-medium focus:outline-none"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B4D8] active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-[#0077B6]/30 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
					>
						{#if isLoading}
							<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
							<span>Membuka Kunci...</span>
						{:else}
							<KeyIcon class="w-4 h-4" />
							<span>Buka Kunci Layar</span>
						{/if}
					</button>
				</form>
			</LiquidGlassCard>

			<!-- 4. Footer: Logout -->
			<div class="mt-6 text-center text-xs text-[#90E0EF]">
				<span>Bukan akun Anda?</span>
				<a href="/logout" class="inline-flex items-center gap-1 font-bold text-[#FF9F1C] hover:underline ml-1">
					<LogOutIcon class="w-3.5 h-3.5" />
					<span>Keluar dari Akun</span>
				</a>
			</div>
		</div>
	</div>
</AuthLiquidGlassBackdrop>
