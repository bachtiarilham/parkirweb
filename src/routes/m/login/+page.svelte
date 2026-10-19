<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthLiquidGlassBackdrop from '$lib/components/ui/liquid-glass/AuthLiquidGlassBackdrop.svelte';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import LockIcon from '@lucide/svelte/icons/lock';
	import UserIcon from '@lucide/svelte/icons/user';
	import FingerprintIcon from '@lucide/svelte/icons/fingerprint';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	let { form } = $props();

	let identity = $state('');
	let password = $state('');
	let isLoading = $state(false);

	function fillDemo(user: 'jukir' | 'customer') {
		if (user === 'jukir') {
			identity = 'budi@parkirv5.com';
			password = 'password';
		} else {
			identity = 'jokowi@presiden.ri';
			password = 'password';
		}
	}
</script>

<AuthLiquidGlassBackdrop>
	<div class="min-h-screen flex flex-col justify-center items-center px-5 py-8 relative z-10">
		
		<!-- 1. Liquid Glass Logo Badge (92dp circular glass badge) -->
		<div class="relative mb-4 group">
			<div class="w-24 h-24 rounded-full bg-[#0F274E]/80 backdrop-blur-xl border-[1.5px] border-[#90E0EF]/50 shadow-2xl shadow-[#00B4D8]/30 flex items-center justify-center p-1 transition transform duration-500 hover:scale-105">
				<!-- Specular Top Gloss -->
				<div class="absolute inset-x-2 top-0 h-10 rounded-t-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"></div>

				<!-- Center Parking Emblem Icon -->
				<div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#0096C7] to-[#023E8A] flex items-center justify-center shadow-inner border border-white/30 text-white font-black text-2xl tracking-tighter">
					P
				</div>
			</div>
		</div>

		<!-- 2. Brand Title & Subtitle -->
		<div class="text-center mb-6">
			<h1 class="text-3xl font-black text-white tracking-wider">LineSpot</h1>
			<p class="text-xs text-[#90E0EF] mt-1 font-medium tracking-wide">
				Solusi Cerdas Parkir Anda
			</p>
		</div>

		<!-- 3. Liquid Glass Form Card (Exact Midnight Card of Android LoginScreen) -->
		<div class="w-full max-w-sm">
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
							update();
						};
					}}
					class="space-y-4"
				>
					<!-- Username / Phone Input Field -->
					<div>
						<label for="identity" class="block text-xs font-bold text-[#90E0EF] mb-1.5 tracking-wide">
							Nama Pengguna atau No. HP
						</label>
						<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
							<UserIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="identity"
								name="identity"
								type="text"
								bind:value={identity}
								required
								placeholder="LineSpotUser / 0812..."
								class="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-white placeholder-[#90E0EF]/40 font-medium focus:outline-none"
							/>
						</div>
					</div>

					<!-- Password Input Field -->
					<div>
						<label for="password" class="block text-xs font-bold text-[#90E0EF] mb-1.5 tracking-wide">
							Kata Sandi
						</label>
						<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
							<LockIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="password"
								name="password"
								type="password"
								bind:value={password}
								required
								placeholder="Password / PIN"
								class="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-white placeholder-[#90E0EF]/40 font-medium focus:outline-none"
							/>
						</div>

						<!-- Forgot Password Link -->
						<div class="text-right mt-1.5">
							<a href="/forgot-password" class="text-xs text-[#48CAE4] hover:text-[#90E0EF] font-medium transition">
								Lupa kata sandi?
							</a>
						</div>
					</div>

					<!-- Submit Button (Electric Cobalt Gradient) -->
					<button
						type="submit"
						disabled={isLoading}
						class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B4D8] active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-[#0077B6]/30 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
					>
						{#if isLoading}
							<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
							<span>Memproses...</span>
						{:else}
							<span>Masuk</span>
							<ArrowRightIcon class="w-4 h-4" />
						{/if}
					</button>

					<!-- Biometric Quick Button (Glass Pill) -->
					<button
						type="button"
						onclick={() => fillDemo('jukir')}
						class="w-full py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#90E0EF] text-xs font-bold transition flex items-center justify-center gap-2 active:scale-98"
					>
						<FingerprintIcon class="w-4 h-4 text-[#00B4D8]" />
						<span>Masuk Cepat Jukir (Demo)</span>
					</button>
				</form>
			</LiquidGlassCard>

			<!-- 4. Footer: Belum punya akun? Daftar -->
			<div class="mt-6 text-center text-xs text-[#90E0EF]">
				<span>Belum punya akun?</span>
				<button
					type="button"
					onclick={() => fillDemo('customer')}
					class="font-bold text-[#FF9F1C] hover:underline ml-1"
				>
					Daftar Akun Baru
				</button>
			</div>
		</div>

	</div>
</AuthLiquidGlassBackdrop>
