<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import DataTablePagination from "$lib/components/data-table-pagination.svelte";
	import SearchIcon from "@lucide/svelte/icons/search";
	import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import { exportToCSV, exportToJSON } from "$lib/utils/export.js";
	import type { ParkingSession } from "$lib/types/parking/parking_session.dto.js";

	let { data } = $props();

	let search = $state("");
	let sortKey = $state<string>("check_in_time");
	let sortDir = $state<"asc" | "desc">("desc");
	let pageSize = $state(10);
	let currentPage = $state(1);

	const filtered = $derived(
		(data.items || []).filter(
			(item: ParkingSession) =>
				item.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
				item.code?.toLowerCase().includes(search.toLowerCase()) ||
				item.vehicle_type?.toLowerCase().includes(search.toLowerCase()) ||
				item.status?.toLowerCase().includes(search.toLowerCase())
		)
	);

	const sorted = $derived(() => {
		const arr = [...filtered];
		arr.sort((a, b) => {
			const aVal = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
			const bVal = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
			const cmp = aVal.localeCompare(bVal);
			return sortDir === "asc" ? cmp : -cmp;
		});
		return arr;
	});

	const paginated = $derived(sorted().slice((currentPage - 1) * pageSize, currentPage * pageSize));

	$effect(() => {
		search;
		currentPage = 1;
	});

	function toggleSort(key: string) {
		if (sortKey === key) {
			sortDir = sortDir === "asc" ? "desc" : "asc";
		} else {
			sortKey = key;
			sortDir = "asc";
		}
	}

	function sortIcon(key: string) {
		if (sortKey !== key) return ArrowUpDownIcon;
		return sortDir === "asc" ? ArrowUpIcon : ArrowDownIcon;
	}

	function formatCurrency(val: number | string | null | undefined) {
		if (val == null) return "—";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		}).format(Number(val));
	}

	function formatDate(date: string | null | undefined) {
		if (!date) return "—";
		return new Intl.DateTimeFormat("id-ID", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	}

	function statusVariant(status: string) {
		switch (status?.toUpperCase()) {
			case "ACTIVE":
			case "CHECKED_IN":
				return "default" as const;
			case "COMPLETED":
			case "PAID":
				return "secondary" as const;
			case "CANCELLED":
				return "destructive" as const;
			default:
				return "outline" as const;
		}
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			code: u.code,
			plate_number: u.plate_number,
			vehicle_type: u.vehicle_type,
			check_in: formatDate(u.check_in_time),
			check_out: formatDate(u.check_out_time),
			duration_minutes: u.duration_minutes,
			amount: u.amount,
			status: u.status,
		}));
		if (format === "csv") exportToCSV(exportData, "parking_sessions");
		else exportToJSON(exportData, "parking_sessions");
	}

	const columns = [
		{ key: "code", label: "No. Tiket" },
		{ key: "plate_number", label: "Plat Nomor" },
		{ key: "vehicle_type", label: "Jenis Kendaraan" },
		{ key: "check_in_time", label: "Masuk (Check In)" },
		{ key: "check_out_time", label: "Keluar (Check Out)" },
		{ key: "duration_minutes", label: "Durasi (Mnt)" },
		{ key: "amount", label: "Tarif" },
		{ key: "status", label: "Status" },
	];
</script>

<svelte:head>
	<title>Parking Sessions - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Parking Sessions</h1>
			<p class="text-muted-foreground">Monitoring sesi parkir kendaraan masuk dan keluar real-time (Read-Only).</p>
		</div>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari plat nomor, tiket, jenis..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} sesi
		</p>
		<div class="ml-auto flex items-center gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="sm" {...props}>
							<DownloadIcon class="mr-2 size-4" />
							Export
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item onclick={() => handleExport("csv")}>Export as CSV</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => handleExport("json")}>Export as JSON</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<!-- Table -->
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as col (col.key)}
						{@const SortIcon = sortIcon(col.key)}
						<Table.Head>
							<button
								class="flex items-center gap-1 text-left font-medium"
								onclick={() => toggleSort(col.key)}
							>
								{col.label}
								<SortIcon class="text-muted-foreground size-3" />
							</button>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginated as item (item.id)}
					<Table.Row>
						<Table.Cell class="font-mono font-medium">{item.code || `SES-${item.id}`}</Table.Cell>
						<Table.Cell class="font-mono font-bold text-foreground">{item.plate_number}</Table.Cell>
						<Table.Cell>
							<Badge variant="outline">{item.vehicle_type}</Badge>
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.check_in_time)}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.check_out_time)}</Table.Cell>
						<Table.Cell>{item.duration_minutes ? `${item.duration_minutes} mnt` : "—"}</Table.Cell>
						<Table.Cell class="font-semibold text-emerald-600 dark:text-emerald-400">
							{formatCurrency(item.amount)}
						</Table.Cell>
						<Table.Cell>
							<Badge variant={statusVariant(item.status)}>
								{item.status}
							</Badge>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={8} class="h-24 text-center">
							{search ? "Tidak ada sesi parkir yang cocok." : "Belum ada riwayat sesi parkir."}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<DataTablePagination totalItems={filtered.length} bind:pageSize bind:currentPage />
	</div>
</div>
