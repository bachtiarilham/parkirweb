<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import AnimatedCounter from "$lib/components/animated-counter.svelte";
	import ShieldIcon from "@lucide/svelte/icons/shield";
	import DollarSignIcon from "@lucide/svelte/icons/dollar-sign";
	import ActivityIcon from "@lucide/svelte/icons/activity";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import LockIcon from "@lucide/svelte/icons/lock";
	import WalletIcon from "@lucide/svelte/icons/wallet";
	import ScaleIcon from "@lucide/svelte/icons/scale";
	import ZapIcon from "@lucide/svelte/icons/zap";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
   import {formatCurrency} from "$lib/utils/format-currency"

	let { data } = $props();

	const d = $derived(data.dashboard);
	const identity = $derived(d?.identity_data);
	const fin = $derived(d?.financial_data);
	const rev = $derived(fin?.revenue_stats);
	const recon = $derived(fin?.reconciliation);
	const escrow = $derived(fin?.escrow_fund);
	const fund = $derived(fin?.platform_fund);
	const throughput = $derived(fin?.live_throughput);

</script>

<svelte:head>
	<title>System & Platform Dashboard - LineSpot</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-3xl font-bold tracking-tight">System & Platform Dashboard</h1>
				<Badge variant="outline" class="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
					Superadmin
				</Badge>
			</div>
			<p class="text-muted-foreground mt-1">
				Visibilitas ekosistem nasional: GTV total, penampungan dana escrow, rekonsiliasi bank, dan status throughput.
			</p>
		</div>
		<p class="text-muted-foreground hidden text-sm sm:block">
			{new Date().toLocaleDateString("id-ID", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			})}
		</p>
	</div>

	<!-- Row 1: KPI Platform Financials -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<!-- GTV Today -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">GTV Hari Ini (Gross)</Card.Title>
				<DollarSignIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{formatCurrency(rev?.total_gtv_today)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Platform Net Today: <span class="font-semibold text-emerald-600 dark:text-emerald-400">
						{formatCurrency(rev?.platform_net_revenue_today)}
					</span>
				</p>
			</Card.Content>
		</Card.Root>

		<!-- GTV This Month -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">GTV Bulan Ini</Card.Title>
				<ActivityIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{formatCurrency(rev?.total_gtv_this_month)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Lifetime: {formatCurrency(rev?.total_gtv_lifetime)}
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Platform Net Withdrawable -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Platform Fee Withdrawable</Card.Title>
				<WalletIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">
					{formatCurrency(fund?.platform_net_revenue_withdrawable)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Net Lifetime: {formatCurrency(rev?.platform_net_revenue_lifetime)}
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Escrow Pool Balance -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Saldo Escrow Penampungan</Card.Title>
				<ShieldIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
					{formatCurrency(escrow?.total_escrow_balance)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">Dana mengendap menanti payout</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Row 2: Ecosystem Identity Counts -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
		<!-- Active Tenants -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Tenants</Card.Title>
				<Building2Icon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					<AnimatedCounter value={identity?.total_active_tenants || 0} />
				</div>
				<p class="text-muted-foreground mt-1 text-xs">Mitra pengelola parkir aktif</p>
			</Card.Content>
		</Card.Root>

		<!-- Active Branches -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Branches</Card.Title>
				<Building2Icon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					<AnimatedCounter value={identity?.total_active_branches || 0} />
				</div>
				<p class="text-muted-foreground mt-1 text-xs">Lokasi titik cabang on & offstreet</p>
			</Card.Content>
		</Card.Root>

		<!-- Active Gates -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Barrier Gates</Card.Title>
				<LockIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					<AnimatedCounter value={identity?.total_active_gates || 0} />
				</div>
				<p class="text-muted-foreground mt-1 text-xs">Palang pintu gerbang terhubung</p>
			</Card.Content>
		</Card.Root>

		<!-- Live TPS Throughput -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Live Throughput</Card.Title>
				<ZapIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-amber-500">
					{throughput?.transactions_per_second ?? 0} <span class="text-xs font-normal text-muted-foreground">TPS</span>
				</div>
				<p class="text-muted-foreground mt-1 text-xs">Transaksi per detik saat ini</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Row 3: Reconciliation & Settlement Integrity -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Nightly Reconciliation Rate -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<div>
						<Card.Title>Nightly Auto-Reconciliation</Card.Title>
						<Card.Description>Tingkat kecocokan settlement perbankan otomatis</Card.Description>
					</div>
					<Badge variant="outline" class="font-semibold text-emerald-600 dark:text-emerald-400">
						{recon?.nightly_match_success_rate ?? 100}% Sukses
					</Badge>
				</div>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Match Success Rate:</span>
					<span class="font-semibold">{recon?.nightly_match_success_rate ?? 100}%</span>
				</div>
				<div class="bg-muted h-3 w-full overflow-hidden rounded-full">
					<div
						class="h-full bg-emerald-500 transition-all duration-500"
						style="width: {recon?.nightly_match_success_rate ?? 100}%"
					></div>
				</div>
				<p class="text-muted-foreground text-xs">
					Dijalankan setiap tengah malam untuk mencocokkan mutasi rekening koran bank dengan log gerbang parkir.
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Discrepancy & Unreconciled Items -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<div>
						<Card.Title>Status Selisih (Discrepancy)</Card.Title>
						<Card.Description>Transaksi yang membutuhkan penyesuaian manual</Card.Description>
					</div>
					<ScaleIcon class="text-muted-foreground size-4" />
				</div>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground text-sm">Item Belum Rekonsiliasi:</span>
					<span class="font-semibold">
						{recon?.unreconciled_items_count ?? 0} Transaksi
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground text-sm">Nominal Selisih:</span>
					<span class="font-semibold text-destructive">
						{formatCurrency(recon?.unreconciled_discrepancy_amount)}
					</span>
				</div>
				<div class="bg-muted/50 rounded-lg p-3 text-xs">
					{#if (recon?.unreconciled_items_count ?? 0) === 0}
						<div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
							<CheckCircle2Icon class="size-4" />
							<span>Semua transaksi telah lunas terekonsiliasi dengan rekening bank.</span>
						</div>
					{:else}
						<div class="flex items-center gap-2 text-amber-600 dark:text-amber-400">
							<AlertTriangleIcon class="size-4" />
							<span>Terdapat item selisih yang perlu dicek di menu Rekonsiliasi Bank.</span>
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
