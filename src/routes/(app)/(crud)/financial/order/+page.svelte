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
	import type { PayOrder } from "$lib/types/financial/order.dto.js";

	let { data } = $props();

	let search = $state("");
	let sortKey = $state<string>("created_at");
	let sortDir = $state<"asc" | "desc">("desc");
	let pageSize = $state(10);
	let currentPage = $state(1);

	const filtered = $derived(
		(data.items || []).filter(
			(item: PayOrder) =>
				item.payment_order_code?.toLowerCase().includes(search.toLowerCase()) ||
				item.trx_code?.toLowerCase().includes(search.toLowerCase()) ||
				item.status?.toLowerCase().includes(search.toLowerCase()) ||
				item.reference_code?.toLowerCase().includes(search.toLowerCase())
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

	function formatDate(date: Date | string | null | undefined) {
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
			case "SUCCESS":
			case "PAID":
			case "COMPLETED":
				return "default" as const;
			case "FAILED":
			case "CANCELLED":
				return "destructive" as const;
			case "PENDING":
				return "secondary" as const;
			default:
				return "outline" as const;
		}
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			order_code: u.payment_order_code,
			trx_code: u.trx_code,
			amount: u.amount,
			status: u.status,
			tax_amount: u.tax_amount,
			platform_share: u.platform_share_amount,
			tenant_share: u.tenant_share_amount,
			created_at: formatDate(u.created_at),
		}));
		if (format === "csv") exportToCSV(exportData, "payment_orders");
		else exportToJSON(exportData, "payment_orders");
	}

	const columns = [
		{ key: "payment_order_code", label: "Order Code" },
		{ key: "trx_code", label: "Trx Code" },
		{ key: "amount", label: "Amount" },
		{ key: "status", label: "Status" },
		{ key: "platform_share_amount", label: "Bagi Hasil Sistem" },
		{ key: "tenant_share_amount", label: "Bagi Hasil Tenant" },
		{ key: "created_at", label: "Waktu Order" },
	];
</script>

<svelte:head>
	<title>Payment Orders - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Payment Orders</h1>
			<p class="text-muted-foreground">Riwayat pesanan pembayaran & komisi transaksi (Read-Only).</p>
		</div>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari order code atau trx code..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} order
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
						<Table.Cell class="font-medium font-mono">{item.payment_order_code}</Table.Cell>
						<Table.Cell class="text-muted-foreground font-mono">{item.trx_code || "—"}</Table.Cell>
						<Table.Cell class="font-semibold text-foreground">{formatCurrency(item.amount)}</Table.Cell>
						<Table.Cell>
							<Badge variant={statusVariant(item.status)}>
								{item.status}
							</Badge>
						</Table.Cell>
						<Table.Cell>{formatCurrency(item.platform_share_amount)}</Table.Cell>
						<Table.Cell>{formatCurrency(item.tenant_share_amount)}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.created_at)}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={7} class="h-24 text-center">
							{search ? "Tidak ada pesanan yang cocok." : "Belum ada pesanan pembayaran."}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<DataTablePagination totalItems={filtered.length} bind:pageSize bind:currentPage />
	</div>
</div>
