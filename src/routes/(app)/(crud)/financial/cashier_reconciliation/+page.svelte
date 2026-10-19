<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import DataTablePagination from "$lib/components/data-table-pagination.svelte";
	import DeleteConfirmDialog from "$lib/components/delete-confirm-dialog.svelte";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import TrashIcon from "@lucide/svelte/icons/trash-2";
	import SearchIcon from "@lucide/svelte/icons/search";
	import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import { toast } from "svelte-sonner";
	import { enhance } from "$app/forms";
	import { exportToCSV, exportToJSON } from "$lib/utils/export.js";
	import type { PayCashierReconciliation } from "$lib/types/financial/cashier_reconciliation.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("code");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<PayCashierReconciliation | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: PayCashierReconciliation) =>
				item.code?.toLowerCase().includes(search.toLowerCase()) ||
				item.status?.toLowerCase().includes(search.toLowerCase()) ||
				String(item.officer_user_id).includes(search)
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

	$effect(() => {
		if (form?.message) toast.error(form.message);
		if (form?.success) {
			toast.success("Operasi rekonsiliasi kasir berhasil");
			selectedIds = new Set();
			createOpen = false;
			editOpen = false;
		}
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

	function toggleSelect(id: string) {
		const next = new Set(selectedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedIds = next;
	}

	function toggleSelectAll() {
		if (selectedIds.size === paginated.length) {
			selectedIds = new Set();
		} else {
			selectedIds = new Set(paginated.map((u) => String(u.id)));
		}
	}

	function formatCurrency(val: number | string | null | undefined) {
		if (val == null) return "—";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		}).format(Number(val));
	}

	function openEdit(item: PayCashierReconciliation) {
		editItem = { ...item };
		editOpen = true;
	}

	function openDelete(id: string | number) {
		deleteId = String(id);
		deleteOpen = true;
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			id: u.id,
			code: u.code,
			shift_id: u.shift_id,
			officer_user_id: u.officer_user_id,
			expected_cash_revenue: u.expected_cash_revenue,
			actual_cash_reported: u.actual_cash_reported,
			leakage_amount: u.leakage_amount,
			status: u.status,
		}));
		if (format === "csv") exportToCSV(exportData, "cashier_reconciliations");
		else exportToJSON(exportData, "cashier_reconciliations");
	}

	function statusVariant(status: string) {
		switch (status?.toUpperCase()) {
			case "SETTLED":
			case "CLOSED":
				return "default" as const;
			case "DISCREPANCY":
				return "destructive" as const;
			case "PENDING":
				return "secondary" as const;
			default:
				return "outline" as const;
		}
	}

	const columns = [
		{ key: "code", label: "Kode" },
		{ key: "shift_id", label: "Shift ID" },
		{ key: "officer_user_id", label: "Petugas ID" },
		{ key: "expected_cash_revenue", label: "Target Kas" },
		{ key: "actual_cash_reported", label: "Kas Dilaporkan" },
		{ key: "leakage_amount", label: "Selisih (Leakage)" },
		{ key: "status", label: "Status" },
	];
</script>

<svelte:head>
	<title>Cashier Reconciliation - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Cashier Reconciliation</h1>
			<p class="text-muted-foreground">Rekonsiliasi penerimaan kas manual oleh petugas loket per shift.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Reconciliation
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari kode atau petugas..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} rekonsiliasi
		</p>
		<div class="ml-auto flex items-center gap-2">
			{#if selectedIds.size > 0}
				<form method="POST" action="?/bulkDelete" use:enhance>
					<input type="hidden" name="ids" value={[...selectedIds].join(",")} />
					<Button variant="destructive" size="sm" type="submit">
						<TrashIcon class="mr-2 size-4" />
						Delete {selectedIds.size}
					</Button>
				</form>
			{/if}
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
					<Table.Head class="w-[40px]">
						<input
							type="checkbox"
							checked={paginated.length > 0 && selectedIds.size === paginated.length}
							onchange={toggleSelectAll}
							class="accent-primary size-4"
						/>
					</Table.Head>
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
					<Table.Head class="w-[100px]">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginated as item (item.id)}
					<Table.Row class={selectedIds.has(String(item.id)) ? "bg-muted/50" : ""}>
						<Table.Cell>
							<input
								type="checkbox"
								checked={selectedIds.has(String(item.id))}
								onchange={() => toggleSelect(String(item.id))}
								class="accent-primary size-4"
							/>
						</Table.Cell>
						<Table.Cell class="font-medium">{item.code || `CR-${item.id}`}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.shift_id}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.officer_user_id}</Table.Cell>
						<Table.Cell>{formatCurrency(item.expected_cash_revenue)}</Table.Cell>
						<Table.Cell>{formatCurrency(item.actual_cash_reported)}</Table.Cell>
						<Table.Cell class={Number(item.leakage_amount) !== 0 ? "font-semibold text-destructive" : ""}>
							{formatCurrency(item.leakage_amount)}
						</Table.Cell>
						<Table.Cell>
							<Badge variant={statusVariant(item.status)}>
								{item.status}
							</Badge>
						</Table.Cell>
						<Table.Cell>
							<div class="flex items-center gap-1">
								<Button variant="ghost" size="icon" class="size-8" onclick={() => openEdit(item)}>
									<PencilIcon class="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									class="text-destructive size-8"
									onclick={() => openDelete(item.id)}
								>
									<TrashIcon class="size-4" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={9} class="h-24 text-center">
							{search ? "Tidak ada rekonsiliasi kasir yang cocok." : "Belum ada data rekonsiliasi kasir."}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<DataTablePagination totalItems={filtered.length} bind:pageSize bind:currentPage />
	</div>
</div>

<!-- Create Dialog -->
<Dialog.Root bind:open={createOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Cashier Reconciliation</Dialog.Title>
			<Dialog.Description>Catat rekonsiliasi penerimaan kasir loket.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="code">Reconciliation Code</Label>
					<Input id="code" name="code" placeholder="CR-2026-001" />
				</div>
				<div class="grid gap-2">
					<Label for="shift_id">Shift ID</Label>
					<Input id="shift_id" name="shift_id" type="number" placeholder="1" required />
				</div>
				<div class="grid gap-2">
					<Label for="officer_user_id">Officer User ID</Label>
					<Input id="officer_user_id" name="officer_user_id" type="number" placeholder="1" required />
				</div>
				<div class="grid gap-2">
					<Label for="expected_cash_revenue">Expected Cash Revenue</Label>
					<Input id="expected_cash_revenue" name="expected_cash_revenue" type="number" placeholder="100000" required />
				</div>
				<div class="grid gap-2">
					<Label for="actual_cash_reported">Actual Cash Reported</Label>
					<Input id="actual_cash_reported" name="actual_cash_reported" type="number" placeholder="100000" required />
				</div>
				<div class="grid gap-2">
					<Label for="status">Status</Label>
					<Select.Root name="status" type="single" value="PENDING">
						<Select.Trigger><span>PENDING</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="PENDING">PENDING</Select.Item>
							<Select.Item value="SETTLED">SETTLED</Select.Item>
							<Select.Item value="DISCREPANCY">DISCREPANCY</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Edit Dialog -->
<Dialog.Root bind:open={editOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Cashier Reconciliation</Dialog.Title>
			<Dialog.Description>Perbarui data rekonsiliasi kasir.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_code">Reconciliation Code</Label>
					<Input id="edit_code" name="code" value={editItem?.code || ""} />
				</div>
				<div class="grid gap-2">
					<Label for="edit_shift_id">Shift ID</Label>
					<Input id="edit_shift_id" name="shift_id" type="number" value={editItem?.shift_id} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_officer_user_id">Officer User ID</Label>
					<Input id="edit_officer_user_id" name="officer_user_id" type="number" value={editItem?.officer_user_id} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_expected_cash_revenue">Expected Cash</Label>
					<Input id="edit_expected_cash_revenue" name="expected_cash_revenue" type="number" value={editItem?.expected_cash_revenue} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_actual_cash_reported">Actual Cash</Label>
					<Input id="edit_actual_cash_reported" name="actual_cash_reported" type="number" value={editItem?.actual_cash_reported} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_status">Status</Label>
					<Input id="edit_status" name="status" value={editItem?.status || "PENDING"} />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="reconciliation" />
