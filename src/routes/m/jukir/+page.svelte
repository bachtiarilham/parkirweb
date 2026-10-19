<script lang="ts">
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import BellIcon from '@lucide/svelte/icons/bell';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import CarIcon from '@lucide/svelte/icons/car';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { formatCurrency } from '$lib/utils/format-currency';

	let { data } = $props();

	function getDuration(checkInTimeStr: string): string {
		try {
			const checkIn = new Date(checkInTimeStr).getTime();
			const now = Date.now();
			const diffMinutes = Math.max(0, Math.floor((now - checkIn) / 60000));
			const hours = Math.floor(diffMinutes / 60);
			const mins = diffMinutes % 60;
			if (hours > 0) return `${hours} jam ${mins} m`;
			return `${mins} menit`;
		} catch {
			return '-';
		}
	}
</script>

<div class="space-y-4 pb-12">
	<!-- ── 1. Top Header Bar (Notifikasi & Menu) ─────────────────────── -->
	<div class="flex items-center justify-between pt-1">
		<!-- Notification Button: Circle #2C2C2E with badge count -->
		<a
			href="/m/settings/notification"
			class="relative w-11 h-11 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white shadow-md active:scale-95 transition"
			aria-label="Notifikasi"
		>
			<BellIcon class="w-5 h-5 text-white" />
		</a>

		<!-- Menu Burger Button -->
		<a
			href="/m/settings/profile"
			class="w-11 h-11 flex items-center justify-center text-[#1E1E1E] hover:bg-slate-200/50 rounded-full active:scale-95 transition"
			aria-label="Menu Profil & Pengaturan"
		>
			<MenuIcon class="w-7 h-7" />
		</a>
	</div>

	<!-- ── 2. Officer Profile Section (Identik JukirDashboardScreen.kt) ─ -->
	<div class="flex flex-col items-center text-center">
		<!-- 92px Avatar with Liquid Glass Border -->
		<div class="relative mb-2.5">
			<div class="w-[92px] h-[92px] rounded-full p-1 bg-gradient-to-tr from-[#00B4D8] via-white to-[#0077B6] shadow-xl shadow-sky-600/20">
				<div class="w-full h-full rounded-full bg-gradient-to-br from-[#03045E] to-[#0077B6] text-white font-black text-3xl flex items-center justify-center border-2 border-white/60">
					{(data.user?.full_name || 'J').charAt(0).toUpperCase()}
				</div>
			</div>
			<!-- Pill Badge Petugas -->
			<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#0077B6] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border border-white shadow-md text-nowrap">
				PETUGAS PARKIR
			</div>
		</div>

		<!-- Officer Name -->
		<h1 class="text-lg font-bold text-[#1E1E1E] mt-1 tracking-tight">
			{data.user?.full_name || 'Petugas LineSpot'}
		</h1>

		<!-- Location Chip -->
		<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF1F4] text-[#64748B] text-xs font-medium mt-1">
			<MapPinIcon class="w-3.5 h-3.5 text-[#0077B6]" />
			<span>{data.user?.branchCode || 'Zona A - Malioboro Utara'}</span>
		</div>
	</div>

	<!-- ── 3. Operational Status Bar (Liquid Glass Chips) ───────────── -->
	<div class="grid grid-cols-2 gap-3">
		<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3 text-center">
			<div class="flex items-center justify-center gap-2">
				<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
				<span class="text-xs font-bold text-[#1E1E1E]">Status: Online</span>
			</div>
			<div class="text-[10px] text-[#64748B] mt-0.5 font-medium">Terhubung Cloud Core</div>
		</LiquidGlassCard>

		<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3 text-center">
			<div class="flex items-center justify-center gap-1.5 text-xs font-bold text-[#1E1E1E]">
				<RefreshCwIcon class="w-3.5 h-3.5 text-[#0077B6]" />
				<span>Antrean Sync</span>
			</div>
			<div class="text-[10px] text-emerald-600 font-semibold mt-0.5">0 Antrean Tertunda</div>
		</LiquidGlassCard>
	</div>

	<!-- ── 4. Financial Summary Card (Pendapatan Shift Ini) ─────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-5">
		<div class="flex items-center justify-between mb-3">
			<div class="border border-[#CBD5E1] rounded-full px-3 py-0.5 text-[11px] text-[#475569] font-medium">
				Ringkasan Shift
			</div>
			<span class="bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
				Aktif
			</span>
		</div>

		<div class="text-center my-3">
			<div class="text-xs text-[#64748B] font-medium">Pendapatan Shift Ini</div>
			<div class="text-3xl font-extrabold text-[#0077B6] tracking-tight mt-0.5">
				{formatCurrency(data.stats?.totalCashToday || 0)}
			</div>
			<div class="text-xs text-[#64748B] mt-1 font-medium">
				{data.stats?.totalActive || 0} Kendaraan Parkir • {data.stats?.totalCompleted || 0} Transaksi Keluar
			</div>
		</div>

		<div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80">
			<!-- Button Riwayat -->
			<a
				href="/m/history"
				class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/70 hover:bg-white text-[#03045E] text-xs font-bold border border-slate-200 shadow-sm active:scale-95 transition"
			>
				<ReceiptIcon class="w-4 h-4 text-[#0077B6]" />
				<span>Riwayat</span>
			</a>

			<!-- Button Laporan Shift -->
			<a
				href="/m/jukir/report"
				class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white text-xs font-bold shadow-md shadow-[#0077B6]/30 active:scale-95 transition"
			>
				<FileTextIcon class="w-4 h-4 text-white" />
				<span>Laporan Shift</span>
			</a>
		</div>
	</LiquidGlassCard>

	<!-- ── 5. Recent Transactions Section (Aktivitas Parkir Terkini) ── -->
	<div>
		<div class="flex items-center justify-between mb-3 px-1">
			<h2 class="text-sm font-bold text-[#1E1E1E]">Aktivitas Parkir Terkini</h2>
			<a href="/m/history" class="text-xs font-bold text-[#0077B6] hover:underline">
				Lihat Semua
			</a>
		</div>

		{#if data.activeSessions && data.activeSessions.length > 0}
			<div class="space-y-2.5">
				{#each data.activeSessions.slice(0, 10) as session (session.id)}
					<a
						href="/m/jukir/session/detail/{session.id}"
						class="block group"
					>
						<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3.5 group-hover:border-sky-400 transition">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-xl bg-sky-50 text-[#0077B6] flex items-center justify-center border border-sky-100 font-bold">
										{#if (session.vehicle_type || '').toUpperCase().includes('MOTOR')}
											<BikeIcon class="w-5 h-5" />
										{:else if (session.vehicle_type || '').toUpperCase().includes('TRUK')}
											<TruckIcon class="w-5 h-5" />
										{:else}
											<CarIcon class="w-5 h-5" />
										{/if}
									</div>

									<div>
										<div class="font-black text-sm text-[#03045E] tracking-wider">
											{session.plate_number}
										</div>
										<div class="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
											<span class="capitalize">{session.vehicle_type || 'Mobil'}</span>
											<span>•</span>
											<span>{getDuration(session.check_in_time)}</span>
										</div>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200/60">
										Sedang Parkir
									</span>
									<ChevronRightIcon class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
								</div>
							</div>
						</LiquidGlassCard>
					</a>
				{/each}
			</div>
		{:else}
			<LiquidGlassCard variant="light" class="p-8 text-center">
				<CarIcon class="w-8 h-8 text-slate-300 mx-auto mb-2" />
				<div class="text-xs font-bold text-[#64748B]">Belum ada kendaraan parkir</div>
				<div class="text-[11px] text-slate-400 mt-0.5">Ketuk tombol Activity di bawah untuk memindai plat</div>
			</LiquidGlassCard>
		{/if}
	</div>
</div>
