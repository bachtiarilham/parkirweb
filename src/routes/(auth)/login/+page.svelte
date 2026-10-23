<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthLiquidGlassBackdrop from '$lib/components/ui/liquid-glass/AuthLiquidGlassBackdrop.svelte';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import LockIcon from '@lucide/svelte/icons/lock';
	import UserIcon from '@lucide/svelte/icons/user';
	import FingerprintIcon from '@lucide/svelte/icons/fingerprint';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import BuildingIcon from '@lucide/svelte/icons/building-2';
	import ShieldIcon from '@lucide/svelte/icons/shield-check';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	let { form } = $props();

	let identity = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let selectedScopeId = $state<number | null>(null);

	// Reset mode jika user klik ganti akun
	let showPicker = $derived(Boolean(form?.requiresScopeSelection && form?.accessibleScopes?.length > 0));

	function fillDemo(user: 'jukir' | 'customer') {
		if (user === 'jukir') {
			identity = 'budi@parkirv5.com';
			password = 'password';
		} else {
			identity = 'jokowi@presiden.ri';
			password = 'password';
		}
	}

	function getRoleBadgeClass(role: string): string {
		const r = role.toUpperCase();
		if (r.includes('TENANT')) return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
		if (r.includes('BRANCH')) return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
		if (r.includes('OFFICER') || r.includes('JUKIR')) return 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
		if (r.includes('SYSTEM')) return 'bg-rose-500/20 text-rose-200 border-rose-400/30';
		return 'bg-amber-500/20 text-amber-200 border-amber-400/30';
	}

	function getRoleLabel(role: string): string {
		const r = role.toUpperCase();
		if (r === 'ADMIN-SYSTEM') return 'Administrator Sistem';
		if (r === 'ADMIN-TENANT') return 'Admin Tenant Pengelola';
		if (r === 'ADMIN-BRANCH') return 'Admin Cabang';
		if (r === 'OFFICER') return 'Petugas / Juru Parkir';
		if (r === 'CUSTOMER') return 'Customer Parkir';
		if (r === 'MEMBER') return 'Member Terdaftar';
		return role;
	}
</script>

<svelte:head>
	<title>LineSpot - Masuk ke Akun</title>
</svelte:head>

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

		<!-- 3. Liquid Glass Card Container -->
		<div class="w-full max-w-md">
			<LiquidGlassCard variant="dark" class="p-6">
				{#if form?.message}
					<div class="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 font-medium">
						⚠️ {form.message}
					</div>
				{/if}

				{#if showPicker}
					<!-- ========================================================= -->
					<!-- TAHAP 2: LIQUID GLASS WORKSPACE & BRANCH PICKER           -->
					<!-- ========================================================= -->
					<div class="space-y-4">
						<div class="text-center pb-2 border-b border-white/10">
							<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#00B4D8]/20 text-[#90E0EF] border border-[#00B4D8]/40 mb-2">
								<ShieldIcon class="w-3.5 h-3.5" />
								Kredensial Terverifikasi
							</span>
							<h2 class="text-base font-extrabold text-white">Pilih Ruang Kerja / Cabang</h2>
							<p class="text-xs text-[#90E0EF]/70 mt-0.5">
								Pilih cabang kerja yang ingin Anda operasikan saat ini.
							</p>
						</div>

						<form
							method="POST"
							action="?/selectScope"
							use:enhance={() => {
								isLoading = true;
								return async ({ update }) => {
									isLoading = false;
									update();
								};
							}}
							class="space-y-3"
						>
							<input type="hidden" name="preAuthToken" value={form?.preAuthToken} />
							<input type="hidden" name="scopeId" value={selectedScopeId} />

							<div class="space-y-2 max-h-72 overflow-y-auto pr-1">
								{#each form?.accessibleScopes || [] as scope}
									<button
										type="button"
										onclick={() => (selectedScopeId = scope.scope_id)}
										class="w-full text-left p-3.5 rounded-2xl border transition relative flex items-start gap-3 {selectedScopeId === scope.scope_id
											? 'bg-gradient-to-r from-[#0077B6]/40 to-[#023E8A]/50 border-[#00B4D8] shadow-lg shadow-[#00B4D8]/20'
											: 'bg-white/5 hover:bg-white/10 border-white/10'}"
									>
										<!-- Radio Indicator Dot -->
										<div class="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 {selectedScopeId === scope.scope_id
											? 'border-[#00B4D8] bg-[#00B4D8]'
											: 'border-white/30'}">
											{#if selectedScopeId === scope.scope_id}
												<div class="w-2 h-2 rounded-full bg-white"></div>
											{/if}
										</div>

										<!-- Scope Details -->
										<div class="flex-1 min-w-0">
											<div class="flex items-center gap-2 mb-1 flex-wrap">
												<span class="text-[10px] uppercase font-black px-2 py-0.5 rounded-md border {getRoleBadgeClass(scope.role)}">
													{getRoleLabel(scope.role)}
												</span>
											</div>
											<div class="text-sm font-bold text-white truncate">
												{scope.branch_name || scope.tenant_name || 'Akses Global Platform'}
											</div>
											{#if scope.branch_name && scope.tenant_name}
												<div class="text-[11px] text-[#90E0EF]/60 truncate mt-0.5 flex items-center gap-1">
													<BuildingIcon class="w-3 h-3 shrink-0" />
													<span>{scope.tenant_name}</span>
												</div>
											{/if}
										</div>
									</button>
								{/each}
							</div>

							<!-- Action Buttons -->
							<button
								type="submit"
								disabled={isLoading || selectedScopeId === null}
								class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B4D8] active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-[#0077B6]/30 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none mt-2"
							>
								{#if isLoading}
									<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
									<span>Menyiapkan Sesi...</span>
								{:else}
									<span>Masuk ke Ruang Kerja</span>
									<ArrowRightIcon class="w-4 h-4" />
								{/if}
							</button>

							<a
								href="/login"
								class="w-full py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#90E0EF] text-xs font-bold transition flex items-center justify-center gap-2"
							>
								<ArrowLeftIcon class="w-3.5 h-3.5" />
								<span>Ganti Akun Lain</span>
							</a>
						</form>
					</div>
				{:else}
					<!-- ========================================================= -->
					<!-- TAHAP 1: FORM LOGIN UTAMA (KREDENSIAL GLOBAL)             -->
					<!-- ========================================================= -->
					<form
						method="POST"
						action="?/login"
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
								Nama Pengguna, Email atau No. HP
							</label>
							<div class="relative rounded-2xl bg-gradient-to-b from-[#0F274E]/70 to-[#071A37]/85 border-[1.2px] border-[#48CAE4]/40 focus-within:border-[#00B4D8] transition shadow-inner">
								<UserIcon class="w-4 h-4 text-[#90E0EF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
								<input
									id="identity"
									name="identity"
									type="text"
									bind:value={identity}
									required
									placeholder="LineSpotUser / budi@parkir.com"
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
									placeholder="Password Anda"
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

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={isLoading}
							class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B4D8] active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-[#0077B6]/30 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
						>
							{#if isLoading}
								<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
								<span>Memeriksa Identitas...</span>
							{:else}
								<span>Lanjutkan</span>
								<ArrowRightIcon class="w-4 h-4" />
							{/if}
						</button>

						<!-- Demo Quick Switcher Button -->
						<div class="grid grid-cols-2 gap-2 pt-1">
							<button
								type="button"
								onclick={() => fillDemo('jukir')}
								class="py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#90E0EF] text-[11px] font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
							>
								<FingerprintIcon class="w-3.5 h-3.5 text-[#00B4D8]" />
								<span>Demo Jukir</span>
							</button>
							<button
								type="button"
								onclick={() => fillDemo('customer')}
								class="py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#90E0EF] text-[11px] font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
							>
								<UserIcon class="w-3.5 h-3.5 text-[#FF9F1C]" />
								<span>Demo Pelanggan</span>
							</button>
						</div>
					</form>
				{/if}
			</LiquidGlassCard>

			<!-- 4. Footer -->
			<div class="mt-6 text-center text-xs text-[#90E0EF]">
				<span>Belum punya akun?</span>
				<a href="/register" class="font-bold text-[#FF9F1C] hover:underline ml-1">
					Daftar Akun Baru
				</a>
			</div>
		</div>

	</div>
</AuthLiquidGlassBackdrop>
