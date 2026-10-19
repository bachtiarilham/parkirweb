<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import DataTablePagination from "$lib/components/data-table-pagination.svelte";
	import SearchIcon from "@lucide/svelte/icons/search";
	import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import { exportToCSV, exportToJSON } from "$lib/utils/export.js";
	import type { PayTenantBalance } from "$lib/types/financial/tenant_balances.dto.js";

	let { data } = $props();

	let search = $state("");
	let sortKey = $state<string>("tenant_id");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);

	const filtered = $derived(
		(data.items || []).filter(
			(item: PayTenantBalance) =>
				String(item.tenant_id).includes(search) ||
				String(item.withdrawable_balance).includes(search) ||
				String(item.total_revenue_lifetime).includes(search)
		)
	);

	const sorted = $derived(() => {
		const arr = [...filtered];
		arr.sort((a, b) => {
			const aVal = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
			const bVal = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
			const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
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

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			id: u.id,
			tenant_id: u.tenant_id,
			withdrawable_balance: u.withdrawable_balance,
			total_revenue_lifetime: u.total_revenue_lifetime,
			updated_at: formatDate(u.updated_at),
		}));
		if (format === "csv") exportToCSV(exportData, "tenant_balances");
		else exportToJSON(exportData, "tenant_balances");
	}

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "tenant_id", label: "Tenant ID" },
		{ key: "withdrawable_balance", label: "Saldo Dapat Ditarik" },
		{ key: "total_revenue_lifetime", label: "Total Pendapatan Lifetime" },
		{ key: "updated_at", label: "Terakhir Diperbarui" },
	];
</script>

<svelte:head>
	<title>Tenant Balances - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Tenant Balances</h1>
			<p class="text-muted-foreground">Monitoring saldo dompet dan komisi operasional tenant (Read-Only).</p>
		</div>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari ID tenant atau saldo..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} data saldo tenant
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
						<Table.Cell class="font-medium">#{item.id}</Table.Cell>
						<Table.Cell class="font-semibold text-primary">Tenant #{item.tenant_id}</Table.Cell>
						<Table.Cell class="font-medium text-emerald-600 dark:text-emerald-400">
							{formatCurrency(item.withdrawable_balance)}
						</Table.Cell>
						<Table.Cell class="font-medium">{formatCurrency(item.total_revenue_lifetime)}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.updated_at)}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={5} class="h-24 text-center">
							{search ? "Tidak ada saldo tenant yang cocok." : "Belum ada data saldo tenant."}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<DataTablePagination totalItems={filtered.length} bind:pageSize bind:currentPage />
	</div>
</div>
