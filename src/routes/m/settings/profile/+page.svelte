<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import BellIcon from '@lucide/svelte/icons/bell';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import HelpCircleIcon from '@lucide/svelte/icons/help-circle';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CrownIcon from '@lucide/svelte/icons/crown';

	let { data } = $props();

	let showLogoutModal = $state(false);
	const isJukir = $derived((data.user?.role || '').toUpperCase().includes('OFFICER') || (data.user?.role || '').toUpperCase().includes('JUKIR'));
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Top Header ────────────────────────────────────────────── -->
	<div class="flex items-center gap-3 pt-1">
		<button
			onclick={() => history.back()}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Pengaturan & Profil
		</h1>
	</div>

	<!-- ── 2. Profile Card ──────────────────────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-5">
		<div class="flex items-center gap-4">
			<div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-md">
				{(data.user?.full_name || 'U').charAt(0).toUpperCase()}
			</div>

			<div class="flex-1 min-w-0">
				<h2 class="text-base font-bold text-[#03045E] truncate">
					{data.user?.full_name || 'Pengguna LineSpot'}
				</h2>
				<p class="text-xs text-[#64748B] font-mono truncate">
					{data.user?.email || 'user@linespot.id'}
				</p>
				<span class="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-[#0077B6]">
					{isJukir ? 'PETUGAS PARKIR' : 'PELANGGAN (CUSTOMER)'}
				</span>
			</div>
		</div>
	</LiquidGlassCard>

	<!-- ── 3. Menu Navigation List (Identik SettingsProfileScreen.kt) ── -->
	<div class="space-y-2">
		<!-- Keamanan Akun -->
		<a
			href="/m/settings/security"
			class="block group"
		>
			<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3.5 group-hover:border-sky-400 transition">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-xl bg-sky-50 text-[#0077B6] flex items-center justify-center border border-sky-100">
							<ShieldCheckIcon class="w-5 h-5" />
						</div>
						<div>
							<div class="text-xs font-bold text-[#03045E]">Keamanan & PIN</div>
							<div class="text-[10px] text-[#64748B]">Kata sandi dan keamanan akun</div>
						</div>
					</div>
					<ChevronRightIcon class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
				</div>
			</LiquidGlassCard>
		</a>

		<!-- Notifikasi -->
		<a
			href="/m/settings/notification"
			class="block group"
		>
			<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3.5 group-hover:border-sky-400 transition">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-xl bg-sky-50 text-[#0077B6] flex items-center justify-center border border-sky-100">
							<BellIcon class="w-5 h-5" />
						</div>
						<div>
							<div class="text-xs font-bold text-[#03045E]">Notifikasi</div>
							<div class="text-[10px] text-[#64748B]">Pengaturan pesan dan suara</div>
						</div>
					</div>
					<ChevronRightIcon class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
				</div>
			</LiquidGlassCard>
		</a>

		<!-- Bantuan & Support -->
		<button
			type="button"
			onclick={() => alert('Hubungi supervisor atau admin LineSpot: support@linespot.id')}
			class="w-full text-left group"
		>
			<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3.5 group-hover:border-sky-400 transition">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
							<HelpCircleIcon class="w-5 h-5" />
						</div>
						<div>
							<div class="text-xs font-bold text-[#03045E]">Pusat Bantuan</div>
							<div class="text-[10px] text-[#64748B]">Pertanyaan umum dan kontak</div>
						</div>
					</div>
					<ChevronRightIcon class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
				</div>
			</LiquidGlassCard>
		</button>

		<!-- Keluar (Logout) -->
		<button
			type="button"
			onclick={() => (showLogoutModal = true)}
			class="w-full text-left group pt-2"
		>
			<div class="p-3.5 rounded-2xl bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200 transition flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
						<LogOutIcon class="w-5 h-5" />
					</div>
					<div class="text-xs font-bold text-rose-700">Keluar dari Akun</div>
				</div>
				<ChevronRightIcon class="w-4 h-4 text-rose-400" />
			</div>
		</button>
	</div>

	<!-- Logout Confirmation Modal -->
	{#if showLogoutModal}
		<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
			<div class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4">
				<div class="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
					<LogOutIcon class="w-7 h-7" />
				</div>
				<div>
					<h3 class="text-base font-bold text-[#03045E]">Yakin ingin keluar?</h3>
					<p class="text-xs text-[#64748B] mt-1">Anda perlu masuk kembali untuk mengakses sesi parkir.</p>
				</div>
				<div class="grid grid-cols-2 gap-3 pt-2">
					<button
						onclick={() => (showLogoutModal = false)}
						class="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
					>
						Batal
					</button>
					<form action="/logout" method="POST">
						<button
							type="submit"
							class="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30"
						>
							Ya, Keluar
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
