<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import RotatingPrismaticRing from '$lib/components/ui/liquid-glass/RotatingPrismaticRing.svelte';
	import BellIcon from '@lucide/svelte/icons/bell';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import CrownIcon from '@lucide/svelte/icons/crown';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { formatCurrency } from '$lib/utils/format-currency';

	let { data } = $props();

	const isMember = $derived(!!data.activeContract);

	const availablePlans = [
		{
			id: 'plan_monthly',
			name: 'VIP Bulanan On-Street',
			price: 150000,
			period: '/ bulan',
			badge: 'TERPOPULER',
			features: [
				'Parkir bebas tanpa karcis di seluruh zona',
				'Prioritas check-in otomatis kamera OCR',
				'Garansi slot parkir jam sibuk'
			]
		},
		{
			id: 'plan_weekly',
			name: 'Mingguan Reguler',
			price: 45000,
			period: '/ minggu',
			badge: null,
			features: [
				'Akses seluruh kantong parkir kota',
				'Pembayaran non-tunai otomatis'
			]
		}
	];
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. TopHeaderBar (Identik CustomerDashboardScreen.kt) ──────── -->
	<div class="flex items-center justify-between pt-1">
		<!-- Notification Bell: Circle #2C2C2E -->
		<a
			href="/m/settings/notification"
			class="w-11 h-11 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white shadow-md active:scale-95 transition"
			aria-label="Notifikasi"
		>
			<BellIcon class="w-5 h-5 text-white" />
		</a>

		<!-- Burger Menu -->
		<a
			href="/m/settings/profile"
			class="w-11 h-11 flex items-center justify-center text-[#1E1E1E] hover:bg-slate-200/50 rounded-full active:scale-95 transition"
			aria-label="Menu Profil"
		>
			<MenuIcon class="w-7 h-7" />
		</a>
	</div>

	<!-- ── 2. CustomerProfileSection (Avatar with RotatingPrismaticRing)  -->
	<div class="flex flex-col items-center text-center">
		<div class="relative mb-2.5">
			{#if isMember}
				<RotatingPrismaticRing ringWidth={3.5} class="w-[94px] h-[94px]">
					<div class="w-[84px] h-[84px] rounded-full bg-gradient-to-tr from-[#FFD700] via-[#FF9100] to-[#FF6B00] text-white font-black text-3xl flex items-center justify-center shadow-lg">
						{(data.user?.full_name || 'U').charAt(0).toUpperCase()}
					</div>
				</RotatingPrismaticRing>
			{:else}
				<div class="w-[84px] h-[84px] rounded-full bg-gradient-to-tr from-[#007AFF] to-[#0056B3] text-white font-black text-3xl flex items-center justify-center shadow-lg border-2 border-white/60">
					{(data.user?.full_name || 'U').charAt(0).toUpperCase()}
				</div>
			{/if}

			<!-- Role Pill Badge (VIP Member / Customer) -->
			<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 {isMember ? 'bg-[#FFB300] text-slate-950 shadow-amber-400/30' : 'bg-[#007AFF] text-white'} text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border border-white shadow-md text-nowrap flex items-center gap-1">
				{#if isMember}
					<CrownIcon class="w-3 h-3 text-slate-950" />
					<span>VIP Member</span>
				{:else}
					<span>Customer</span>
				{/if}
			</div>
		</div>

		<!-- Customer Full Name -->
		<h1 class="text-lg font-bold text-[#1E1E1E] mt-1 tracking-tight">
			{data.user?.full_name || 'Pelanggan LineSpot'}
		</h1>

		<!-- Verified Email Chip -->
		<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF1F4] text-[#64748B] text-xs font-medium mt-1">
			<CheckCircleIcon class="w-3.5 h-3.5 text-emerald-500" />
			<span>{data.user?.email || 'rider@linespot.id'}</span>
		</div>
	</div>

	<!-- ── 3. MembershipStatusCard (Identik CustomerDashboardScreen.kt) ─ -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-5">
		<div class="flex items-center justify-between mb-3">
			<div class="border border-[#CBD5E1] rounded-full px-3 py-0.5 text-[11px] text-[#475569] font-medium">
				Status Membership
			</div>
			<span class="{isMember ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#EFF6FF] text-[#2563EB]'} text-[11px] font-bold px-2.5 py-0.5 rounded-full">
				{isMember ? 'Terdaftar' : 'Bukan Member'}
			</span>
		</div>

		<div class="text-center my-3">
			<div class="text-2xl font-bold {isMember ? 'text-[#D97706]' : 'text-[#007AFF]'} tracking-tight">
				{isMember ? 'Member Aktif On-Street' : 'Reguler Basic'}
			</div>
			<div class="text-xs text-[#64748B] mt-1 max-w-xs mx-auto leading-relaxed">
				{#if isMember}
					Plat: B 1234 XYZ • Sisa 28 hari aktif
				{:else}
					Nikmati tarif parkir hemat tanpa antre dengan paket membership
				{/if}
			</div>
		</div>

		<!-- Row 3 Quick Action Buttons (Beli Paket, Riwayat, Scan QR) -->
		<div class="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/80">
			<!-- 1. Beli / Kelola Paket -->
			<a
				href="/m/customer/membership/purchase"
				class="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#03045E] transition active:scale-95 text-center"
			>
				<CrownIcon class="w-5 h-5 text-[#FFB300] mb-1" />
				<span class="text-[11px] font-bold leading-tight">{isMember ? 'Kelola' : 'Beli Paket'}</span>
			</a>

			<!-- 2. Riwayat -->
			<a
				href="/m/history"
				class="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#03045E] transition active:scale-95 text-center"
			>
				<ReceiptIcon class="w-5 h-5 text-[#0077B6] mb-1" />
				<span class="text-[11px] font-bold leading-tight">Riwayat</span>
			</a>

			<!-- 3. Scan QR Masuk (Identik CustomerDashboardScreen.kt) -->
			<button
				type="button"
				onclick={() => alert('Fitur Scan QR Masuk akan segera hadir.')}
				class="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#03045E] transition active:scale-95 text-center"
			>
				<QrCodeIcon class="w-5 h-5 text-[#0077B6] mb-1" />
				<span class="text-[11px] font-bold leading-tight">Scan QR</span>
			</button>
		</div>
	</LiquidGlassCard>

	<!-- ── 4. PackageMembershipSection (Pilihan Paket Berlangganan) ──── -->
	<div>
		<div class="flex items-center justify-between mb-3 px-1">
			<h2 class="text-sm font-bold text-[#1E1E1E]">Paket Berlangganan</h2>
			<a href="/m/customer/membership/purchase" class="text-xs font-bold text-[#0077B6] hover:underline">
				Lihat Semua
			</a>
		</div>

		<div class="space-y-3">
			{#each availablePlans as plan}
				<div class="group">
					<LiquidGlassCard variant="light" hasTopGloss={false} class="p-4 group-hover:border-sky-400 transition">
						<div class="flex items-start justify-between mb-2">
							<div>
								<h3 class="text-sm font-bold text-[#03045E]">{plan.name}</h3>
								<div class="text-lg font-black text-[#0077B6] mt-0.5">
									{formatCurrency(plan.price)}
									<span class="text-xs font-normal text-slate-500">{plan.period}</span>
								</div>
							</div>

							{#if plan.badge}
								<span class="bg-[#FF9F1C] text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
									{plan.badge}
								</span>
							{/if}
						</div>

						<ul class="space-y-1.5 my-3 text-xs text-[#64748B]">
							{#each plan.features as feat}
								<li class="flex items-center gap-2">
									<CheckIcon class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
									<span>{feat}</span>
								</li>
							{/each}
						</ul>

						<a
							href="/m/customer/membership/purchase?planId={plan.id}"
							class="w-full py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/20 active:scale-95 transition flex items-center justify-center gap-1.5"
						>
							<span>Pilih Paket</span>
							<ArrowRightIcon class="w-3.5 h-3.5" />
						</a>
					</LiquidGlassCard>
				</div>
			{/each}
		</div>
	</div>
</div>
