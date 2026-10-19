<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import AnimatedCounter from "$lib/components/animated-counter.svelte";
	import DollarSignIcon from "@lucide/svelte/icons/dollar-sign";
	import CarIcon from "@lucide/svelte/icons/car";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import WalletIcon from "@lucide/svelte/icons/wallet";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
   import {formatCurrency} from "$lib/utils/format-currency"
   import {formatDate} from "$lib/utils/format-date"

	let { data } = $props();

	const d = $derived(data.dashboard);
	const identity = $derived(d?.identity_data);
	const financial = $derived(d?.financial_data);
	const parking = $derived(d?.parking_data);

	
</script>

<svelte:head>
	<title>Tenant Dashboard - LineSpot</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header with Tenant Profile badge & date -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-3xl font-bold tracking-tight">Tenant Dashboard</h1>
				{#if identity?.tenant}
					<Badge variant="outline" class="border-primary/40 bg-primary/10 text-primary">
						{identity.tenant.tenant_name} ({identity.tenant.tenant_code})
					</Badge>
				{/if}
			</div>
			<p class="text-muted-foreground mt-1">
				Ringkasan pendapatan, performa cabang, dan kapasitas parkir tenant Anda hari ini.
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

	<!-- Row 1: KPI Cards -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<!-- Card 1: Gross Revenue Today -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Gross Revenue Today</Card.Title>
				<DollarSignIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{formatCurrency(financial?.revenue_overview?.total_gross_revenue_today)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Net Share: <span class="font-semibold text-emerald-600 dark:text-emerald-400">
						{formatCurrency(financial?.revenue_overview?.tenant_net_share_revenue_today)}
					</span>
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Card 2: This Month Gross -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Gross Revenue (Month)</Card.Title>
				<TrendingUpIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{formatCurrency(financial?.revenue_overview?.total_gross_revenue_this_month)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Net Bulan Ini: <span class="font-semibold text-emerald-600 dark:text-emerald-400">
						{formatCurrency(financial?.revenue_overview?.tenant_net_share_revenue_this_month)}
					</span>
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Card 3: Vehicles Served Today -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Vehicles Served Today</Card.Title>
				<CarIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					<AnimatedCounter value={parking?.vehicle_stats?.total_vehicles_served_today || 0} />
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Mobil: <span class="font-semibold">{parking?.vehicle_stats?.cars_count || 0}</span> | 
					Motor: <span class="font-semibold">{parking?.vehicle_stats?.motorcycles_count || 0}</span>
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Card 4: Withdrawable Balance -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Withdrawable Balance</Card.Title>
				<WalletIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">
					{formatCurrency(financial?.balance?.withdrawable_balance)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Lifetime: {formatCurrency(financial?.balance?.total_revenue_lifetime)}
				</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Row 2: Secondary Quick Stats (Utilisation & Duration) -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Avg Capacity Utilisation</Card.Title>
				<Building2Icon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{parking?.capacity_utilisation?.average_capacity_utilisation ?? 0}%
				</div>
				<div class="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
					<div
						class="bg-primary h-full transition-all duration-500"
						style="width: {Math.min(parking?.capacity_utilisation?.average_capacity_utilisation ?? 0, 100)}%"
					></div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Avg Duration per Vehicle</Card.Title>
				<ClockIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{parking?.vehicle_stats?.average_parking_duration_minutes ?? 0} <span class="text-sm font-normal text-muted-foreground">menit</span>
				</div>
				<p class="text-muted-foreground mt-1 text-xs">Rata-rata waktu inap kendaraan</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Bank Account Info</Card.Title>
				<CheckCircle2Icon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-base font-semibold">
					{identity?.tenant?.bank_name || "-"}
				</div>
				<p class="text-sm font-mono text-muted-foreground">
					{identity?.tenant?.bank_account_number || "-"}
				</p>
				<p class="text-xs text-muted-foreground">
					a/n {identity?.tenant?.bank_account_name || "-"}
				</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Row 3: Tables (Branch Operations & Recent Settlements) -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Branch Financials & Operations -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Branch Performance</Card.Title>
					<Card.Description>Status dan pendapatan per cabang parkir</Card.Description>
				</div>
				<Badge variant="outline">{identity?.branches?.length || 0} Cabang</Badge>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Cabang</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Kendaraan</Table.Head>
							<Table.Head class="text-right">Pendapatan</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if identity?.branches && identity.branches.length > 0}
							{#each identity.branches as branch((branch.branch_id))}
								{@const op = parking?.branch_operations?.find((b) => String(b.branch_id) === String(branch.branch_id))}
								{@const fin = financial?.branch_financials?.find((b) => String(b.branch_id) === String(branch.branch_id))}
								<Table.Row>
									<Table.Cell>
										<div class="font-medium">{branch.branch_name}</div>
										<div class="text-muted-foreground text-xs">{branch.branch_code} &bull; {branch.branch_type}</div>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={branch.branch_status === "ACTIVE" || branch.branch_status === "ONLINE" ? "default" : "secondary"}>
											{branch.branch_status}
										</Badge>
									</Table.Cell>
									<Table.Cell class="text-right font-medium">
										{op?.total_vehicles_today || 0}
									</Table.Cell>
									<Table.Cell class="text-right font-semibold text-emerald-600 dark:text-emerald-400">
										{formatCurrency(fin?.gross_revenue)}
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={4} class="text-muted-foreground py-6 text-center">
									Belum ada cabang terdaftar.
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<!-- Recent Settlements -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Recent Settlements</Card.Title>
					<Card.Description>Penyelesaian dana pembayaran terbaru</Card.Description>
				</div>
				<ArrowUpRightIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Order Code</Table.Head>
							<Table.Head>Tanggal</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Net Payout</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if financial?.recent_settlements && financial.recent_settlements.length > 0}
							{#each financial.recent_settlements as item((item.order_id))}
								<Table.Row>
									<Table.Cell>
										<div class="font-mono text-xs font-semibold">{item.payment_order_code || item.order_id}</div>
										<div class="text-muted-foreground text-[10px]">
											Fee: {formatCurrency(item.platform_fee_deducted)}
										</div>
									</Table.Cell>
									<Table.Cell class="text-xs text-muted-foreground">
										{formatDate(item.processed_at)}
									</Table.Cell>
									<Table.Cell>
										<Badge variant={item.payout_status === "SUCCESS" ? "default" : item.payout_status === "FAILED" ? "destructive" : "outline"}>
											{item.payout_status}
										</Badge>
									</Table.Cell>
									<Table.Cell class="text-right font-semibold text-primary">
										{formatCurrency(item.net_payout_amount)}
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={4} class="text-muted-foreground py-6 text-center">
									Belum ada settlement tercatat.
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>