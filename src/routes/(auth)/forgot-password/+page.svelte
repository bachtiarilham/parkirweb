<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthLiquidGlassBackdrop from '$lib/components/ui/liquid-glass/AuthLiquidGlassBackdrop.svelte';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import MailIcon from '@lucide/svelte/icons/mail';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle-2';
	import SendIcon from '@lucide/svelte/icons/send';

	let { form } = $props();
	let email = $state('');
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>LineSpot - Lupa Kata Sandi</title>
</svelte:head>

<AuthLiquidGlassBackdrop>
	<div class="min-h-screen flex flex-col justify-center items-center px-5 py-8 relative z-10">
		<!-- 1. Liquid Glass Logo Emblem -->
		<div class="relative mb-4 group">
			<div class="w-20 h-20 rounded-full bg-[#0F274E]/80 backdrop-blur-xl border-[1.5px] border-[#90E0EF]/50 shadow-2xl shadow-[#00B4D8]/30 flex items-center justify-center p-1 transition transform duration-500 hover:scale-105">
				<!-- Specular Top Gloss -->
				<div class="absolute inset-x-2 top-0 h-8 rounded-t-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"></div>

				<!-- Mail Icon Inside Emblem -->
				<div class="w-13 h-13 rounded-full bg-gradient-to-br from-[#0096C7] to-[#023E8A] flex items-center justify-center shadow-inner border border-white/30 text-white">
					<MailIcon class="w-6 h-6 text-[#CAF0F8]" />
				</div>
			</div>
		</div>

		<!-- 2. Brand Title & Subtitle -->
		<div class="text-center mb-6">
			<h1 class="text-2xl font-black text-white tracking-wider">Lupa Kata Sandi?</h1>
			<p class="text-xs text-[#90E0EF] mt-1 font-medium max-w-xs mx-auto">
				Masukkan email akun Anda. Kami akan mengirimkan tautan reset kata sandi ke kotak masuk Anda.
			</p>
		</div>

		<!-- 3. Liquid Glass Card Form -->
		<div class="w-full max-w-md">
			<LiquidGlassCard variant="dark" class="p-6">
				{#if form?.message && !form?.success}
					<div class="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 font-medium">
						⚠️ {form.message}
					</div>
				{/if}

				{#if form?.success}
					<div class="text-center space-y-3 py-3 animate-in fade-in duration-200">
						<div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
							<CheckCircleIcon class="w-6 h-6" />
						</div>
						<h3 class="text-sm font-bold text-white">Tautan Terkirim!</h3>
						<p class="text-xs text-[#90E0EF] leading-relaxed">
							Jika akun dengan email tersebut terdaftar, kami telah mengirimkan instruksi pemulihan kata sandi. Silakan periksa inbox atau spam.
						</p>
						<div class="pt-3">
							<a
								href="/login"
								class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
							>
								<ArrowLeftIcon class="w-4 h-4" />
								<span>Kembali ke Halaman Masuk</span>
							</a>
						</div>
					</div>
				{:else}
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
							<label for="email" class="block text-xs font-bold text-[#90E0EF] mb-1.5 tracking-wide">
								Alamat Email
							</label>
							<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
								<MailIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
								<input
									id="email"
									name="email"
									type="email"
									bind:value={email}
									required
									placeholder="nama@domain.com"
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
								<span>Mengirim Permintaan...</span>
							{:else}
								<span>Kirim Tautan Reset</span>
								<SendIcon class="w-4 h-4" />
							{/if}
						</button>
					</form>
				{/if}
			</LiquidGlassCard>

			<!-- 4. Back to Login Footer -->
			<div class="mt-6 text-center text-xs text-[#90E0EF]">
				<a href="/login" class="inline-flex items-center gap-1.5 font-bold text-[#48CAE4] hover:text-white transition">
					<ArrowLeftIcon class="w-3.5 h-3.5" />
					<span>Kembali ke Halaman Masuk</span>
				</a>
			</div>
		</div>
	</div>
</AuthLiquidGlassBackdrop>
