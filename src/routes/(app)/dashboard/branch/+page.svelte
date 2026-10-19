<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import AnimatedCounter from "$lib/components/animated-counter.svelte";
	import DollarSignIcon from "@lucide/svelte/icons/dollar-sign";
	import CarIcon from "@lucide/svelte/icons/car";
	import ShieldAlertIcon from "@lucide/svelte/icons/shield-alert";
	import ArrowDownLeftIcon from "@lucide/svelte/icons/arrow-down-left";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import UserCheckIcon from "@lucide/svelte/icons/user-check";
	import LockIcon from "@lucide/svelte/icons/lock";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import BanknoteIcon from "@lucide/svelte/icons/banknote";
   import {formatCurrency} from "$lib/utils/format-currency"
   import {formatDate} from "$lib/utils/format-date"

	let { data } = $props();

	const d = $derived(data.dashboard);
	const gates = $derived(d?.identity_data || []);
	const fin = $derived(d?.financial_data);
	const park = $derived(d?.parking_data);
	const occupancy = $derived(park?.branch_occupancy);
	const traffic = $derived(park?.branch_traffic_flow);
	const shifts = $derived(park?.active_shift || []);
	const alarms = $derived(park?.gate_alarm_alert || []);
</script>

<svelte:head>
	<title>Branch & Gate Dashboard - LineSpot</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-3xl font-bold tracking-tight">Branch & Gate Dashboard</h1>
				{#if gates.length > 0}
					<Badge variant="outline" class="border-primary/40 bg-primary/10 text-primary">
						{gates[0].branch_name} ({gates[0].branch_code})
					</Badge>
				{/if}
			</div>
			<p class="text-muted-foreground mt-1">
				Monitoring operasional palang pintu gerbang, shift kasir, dan keterisian slot parkir real-time.
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
		<!-- Card 1: Shift Revenue -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Revenue Shift Ini</Card.Title>
				<DollarSignIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">
					{formatCurrency(fin?.total_revenue_this_shift)}
				</div>
				<p class="text-muted-foreground mt-1 text-xs">
					Shift ID: <span class="font-semibold">{fin?.shift_id || "-"}</span>
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Card 2: Cash vs Cashless -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Payment Split (Today)</Card.Title>
				<CreditCardIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="flex items-center justify-between text-sm">
					<span class="flex items-center gap-1.5 font-medium">
						<BanknoteIcon class="size-3.5 text-emerald-600 dark:text-emerald-400" /> Cash:
					</span>
					<span class="font-semibold">{formatCurrency(fin?.cash_collected_today)}</span>
				</div>
				<div class="mt-1.5 flex items-center justify-between text-sm">
					<span class="flex items-center gap-1.5 font-medium">
						<CreditCardIcon class="size-3.5 text-blue-600 dark:text-blue-400" /> Non-Tunai:
					</span>
					<span class="font-semibold">{formatCurrency(fin?.cashless_collected_today)}</span>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Card 3: Traffic In & Out -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Trafik Hari Ini</Card.Title>
				<CarIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
						<ArrowDownLeftIcon class="size-4" />
						<div>
							<div class="text-xl font-bold">{traffic?.total_in_today || 0}</div>
							<div class="text-[10px] uppercase tracking-wider text-muted-foreground">Masuk</div>
						</div>
					</div>
					<div class="flex items-center gap-1 text-blue-600 dark:text-blue-400">
						<ArrowUpRightIcon class="size-4" />
						<div>
							<div class="text-xl font-bold">{traffic?.total_out_today || 0}</div>
							<div class="text-[10px] uppercase tracking-wider text-muted-foreground">Keluar</div>
						</div>
					</div>
				</div>
				<p class="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
					<MoonIcon class="size-3" /> Menginap: <span class="font-semibold">{traffic?.overnight_stay_count || 0}</span>
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Card 4: Slot Occupancy -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Keterisian Slot</Card.Title>
				<CarIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="flex items-baseline justify-between">
					<div class="text-2xl font-bold">
						<AnimatedCounter value={occupancy?.currently_occupied || 0} />
						<span class="text-muted-foreground text-sm font-normal"> / {occupancy?.total_capacity || 0}</span>
					</div>
					<Badge variant="outline" class="font-semibold">
						{occupancy?.occupancy_percentage || 0}%
					</Badge>
				</div>
				<div class="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
					<div
						class="bg-primary h-full transition-all duration-500"
						style="width: {Math.min(occupancy?.occupancy_percentage || 0, 100)}%"
					></div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Row 2: Slot Breakdown (Mobil vs Motor) -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<!-- Mobil -->
		<Card.Root>
			<Card.Header class="pb-2">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base font-semibold">Kapasitas Slot Mobil</Card.Title>
					<Badge variant="outline">Tersedia: {occupancy?.car_available ?? 0}</Badge>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Terpakai / Total Kapasitas</span>
					<span class="font-semibold">{occupancy?.car_occupied ?? 0} / {occupancy?.car_total ?? 0}</span>
				</div>
				<div class="bg-muted mt-2 h-2.5 w-full overflow-hidden rounded-full">
					<div
						class="h-full bg-blue-500 transition-all duration-500"
						style="width: {occupancy?.car_total ? Math.min(Math.round(((occupancy.car_occupied || 0) / occupancy.car_total) * 100), 100) : 0}%"
					></div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Motor -->
		<Card.Root>
			<Card.Header class="pb-2">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base font-semibold">Kapasitas Slot Motor</Card.Title>
					<Badge variant="outline">Tersedia: {occupancy?.moto_available ?? 0}</Badge>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Terpakai / Total Kapasitas</span>
					<span class="font-semibold">{occupancy?.moto_occupied ?? 0} / {occupancy?.moto_total ?? 0}</span>
				</div>
				<div class="bg-muted mt-2 h-2.5 w-full overflow-hidden rounded-full">
					<div
						class="h-full bg-amber-500 transition-all duration-500"
						style="width: {occupancy?.moto_total ? Math.min(Math.round(((occupancy.moto_occupied || 0) / occupancy.moto_total) * 100), 100) : 0}%"
					></div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Row 3: Barrier Gates Status & Active Officers Shift -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Gates Status -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Status Barrier Gate</Card.Title>
					<Card.Description>Kondisi hardware palang pintu masuk & keluar</Card.Description>
				</div>
				<LockIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Pintu Gate</Table.Head>
							<Table.Head>Tipe</Table.Head>
							<Table.Head>IP Hardware</Table.Head>
							<Table.Head class="text-right">Status</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if gates && gates.length > 0}
							{#each gates as gate((gate.gate_id))}
								<Table.Row>
									<Table.Cell>
										<div class="font-medium">{gate.gate_name}</div>
										<div class="text-muted-foreground text-xs">{gate.gate_code}</div>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={gate.gate_type === "IN" ? "outline" : "secondary"}>
											{gate.gate_type === "IN" ? "Pintu Masuk" : "Pintu Keluar"}
										</Badge>
									</Table.Cell>
									<Table.Cell class="font-mono text-xs text-muted-foreground">
										{gate.hardware_ip || "127.0.0.1"}
									</Table.Cell>
									<Table.Cell class="text-right">
										<Badge variant={gate.gate_status === "ONLINE" ? "default" : "destructive"}>
											{gate.gate_status}
										</Badge>
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={4} class="text-muted-foreground py-6 text-center">
									Belum ada gate terdaftar pada cabang ini.
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<!-- Active Shifts & Operators -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Petugas Shift Aktif</Card.Title>
					<Card.Description>Kasir dan petugas lapangan yang sedang bertugas</Card.Description>
				</div>
				<UserCheckIcon class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Petugas</Table.Head>
							<Table.Head>Shift</Table.Head>
							<Table.Head>Mulai</Table.Head>
							<Table.Head class="text-right">Kas Awal</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if shifts && shifts.length > 0}
							{#each shifts as shift(shift.shift_id)}
								<Table.Row>
									<Table.Cell>
										<div class="font-medium">{shift.assigned_officer_name}</div>
										<div class="text-muted-foreground text-xs">NIK: {shift.assigned_officer_nik}</div>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={shift.status === "OPEN" ? "default" : "secondary"}>
											{shift.shift_code}
										</Badge>
									</Table.Cell>
									<Table.Cell class="text-xs text-muted-foreground">
										{formatDate(shift.start_time)}
									</Table.Cell>
									<Table.Cell class="text-right font-medium">
										{formatCurrency(shift.cash_float_start)}
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={4} class="text-muted-foreground py-6 text-center">
									Tidak ada shift petugas aktif saat ini.
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
