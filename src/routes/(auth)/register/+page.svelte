<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthLiquidGlassBackdrop from '$lib/components/ui/liquid-glass/AuthLiquidGlassBackdrop.svelte';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import UserIcon from '@lucide/svelte/icons/user';
	import MailIcon from '@lucide/svelte/icons/mail';
	import LockIcon from '@lucide/svelte/icons/lock';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import { onMount } from 'svelte';

	let { form } = $props();

	let name = $state('');
	let email = $state('');
	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);

	let deviceId = $state('');
	let deviceName = $state('');

	onMount(() => {
		let savedId = localStorage.getItem('deviceId');
		if (!savedId) {
			savedId = crypto.randomUUID();
			localStorage.setItem('deviceId', savedId);
		}
		deviceId = savedId;

		let savedName = localStorage.getItem('deviceName');
		if (!savedName) {
			savedName = 'Web Browser';
			localStorage.setItem('deviceName', savedName);
		}
		deviceName = savedName;
	});
</script>

<svelte:head>
	<title>LineSpot - Daftar Akun Baru</title>
</svelte:head>

<AuthLiquidGlassBackdrop>
	<div class="min-h-screen flex flex-col justify-center items-center px-5 py-8 relative z-10">
		<!-- 0. Top Back to Home Button -->
		<a
			href="/"
			class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-[#90E0EF] hover:text-white transition backdrop-blur-md mb-5 shadow-sm group cursor-pointer"
		>
			<ArrowLeftIcon class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
			<span>Kembali ke Beranda</span>
		</a>

		<!-- 1. Liquid Glass Logo Emblem (clickable to home) -->
		<a href="/" aria-label="Kembali ke Beranda" class="relative mb-4 group block cursor-pointer" title="Kembali ke Beranda">
			<div class="w-20 h-20 rounded-full bg-[#0F274E]/80 backdrop-blur-xl border-[1.5px] border-[#90E0EF]/50 shadow-2xl shadow-[#00B4D8]/30 flex items-center justify-center p-1 transition transform duration-500 group-hover:scale-105 group-hover:border-[#00B4D8]">
				<!-- Specular Top Gloss -->
				<div class="absolute inset-x-2 top-0 h-8 rounded-t-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"></div>

				<div class="w-13 h-13 rounded-full bg-gradient-to-br from-[#0096C7] to-[#023E8A] flex items-center justify-center shadow-inner border border-white/30 text-white">
					<UserPlusIcon class="w-6 h-6 text-[#CAF0F8]" />
				</div>
			</div>
		</a>

		<!-- 2. Brand Title & Subtitle -->
		<div class="text-center mb-6">
			<h1 class="text-2xl font-black text-white tracking-wider">Daftar Akun Baru</h1>
			<p class="text-xs text-[#90E0EF] mt-1 font-medium max-w-xs mx-auto">
				Bergabung bersama LineSpot untuk kemudahan akses dan manajemen parkir pintar.
			</p>
		</div>

		<!-- 3. Liquid Glass Card Form -->
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
					class="space-y-3.5"
				>
					<input type="hidden" name="deviceId" value={deviceId} />
					<input type="hidden" name="deviceName" value={deviceName} />

					<!-- Nama Lengkap -->
					<div>
						<label for="name" class="block text-xs font-bold text-[#90E0EF] mb-1.5 tracking-wide">
							Nama Lengkap
						</label>
						<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
							<UserIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="name"
								name="name"
								type="text"
								bind:value={name}
								required
								placeholder="Misal: Budi Santoso"
								class="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-white placeholder-[#90E0EF]/40 font-medium focus:outline-none"
							/>
						</div>
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="block text-xs font-bold text-[#90E0EF] mb-1.5 tracking-wide">
							Email
						</label>
						<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
							<MailIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="email"
								name="email"
								type="email"
								bind:value={email}
								required
								placeholder="budi@example.com"
								class="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-white placeholder-[#90E0EF]/40 font-medium focus:outline-none"
							/>
						</div>
					</div>

					<!-- Username -->
					<div>
						<label for="username" class="block text-xs font-bold text-[#90E0EF] mb-1.5 tracking-wide">
							Nama Pengguna (Username)
						</label>
						<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
							<UserIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="username"
								name="username"
								type="text"
								bind:value={username}
								required
								placeholder="budisantoso"
								class="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-white placeholder-[#90E0EF]/40 font-medium focus:outline-none"
							/>
						</div>
					</div>

					<!-- Password -->
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
								placeholder="Minimal 6 karakter"
								class="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-white placeholder-[#90E0EF]/40 font-medium focus:outline-none"
							/>
						</div>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isLoading}
						class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B4D8] active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-[#0077B6]/30 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer"
					>
						{#if isLoading}
							<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
							<span>Mendaftarkan Akun...</span>
						{:else}
							<span>Daftar Sekarang</span>
							<ArrowRightIcon class="w-4 h-4" />
						{/if}
					</button>
				</form>
			</LiquidGlassCard>

			<!-- 4. Footer: Link back to login & landing page -->
			<div class="mt-6 text-center text-xs text-[#90E0EF] space-y-2.5">
				<div>
					<span>Sudah punya akun?</span>
					<a href="/login" class="font-bold text-[#FF9F1C] hover:underline ml-1">
						Masuk di sini
					</a>
				</div>
				<div class="pt-2 border-t border-white/10">
					<a href="/" class="inline-flex items-center gap-1.5 text-xs text-[#90E0EF]/70 hover:text-white transition font-medium">
						<ArrowLeftIcon class="w-3 h-3" />
						<span>Kembali ke Halaman Utama LineSpot</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</AuthLiquidGlassBackdrop>
