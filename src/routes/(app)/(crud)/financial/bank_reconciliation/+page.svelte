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
	import type { PayBankReconciliation } from "$lib/types/financial/bank_reconciliation.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("payment_order_code");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<PayBankReconciliation | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: PayBankReconciliation) =>
				item.payment_order_code?.toLowerCase().includes(search.toLowerCase()) ||
				item.psp_reference_id?.toLowerCase().includes(search.toLowerCase()) ||
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

	$effect(() => {
		if (form?.message) toast.error(form.message);
		if (form?.success) {
			toast.success("Operasi rekonsiliasi berhasil");
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

	function openEdit(item: PayBankReconciliation) {
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
			payment_order_code: u.payment_order_code,
			psp_reference_id: u.psp_reference_id,
			internal_amount: u.internal_amount,
			external_amount: u.external_amount,
			status: u.status,
			notes: u.notes,
		}));
		if (format === "csv") exportToCSV(exportData, "bank_reconciliations");
		else exportToJSON(exportData, "bank_reconciliations");
	}

	function statusVariant(status: string) {
		switch (status?.toUpperCase()) {
			case "MATCHED":
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
		{ key: "payment_order_code", label: "Order Code" },
		{ key: "psp_reference_id", label: "Ref ID (PSP)" },
		{ key: "internal_amount", label: "Internal Amount" },
		{ key: "external_amount", label: "External Amount" },
		{ key: "status", label: "Status" },
		{ key: "notes", label: "Catatan" },
	];
</script>

<svelte:head>
	<title>Bank Reconciliation - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Bank Reconciliation</h1>
			<p class="text-muted-foreground">Pencocokan mutasi kas masuk perbankan/PSP dengan transaksi sistem.</p>
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
			<Input placeholder="Cari kode order atau ref ID..." class="pl-9" bind:value={search} />
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
						<Table.Cell class="font-medium">{item.payment_order_code}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.psp_reference_id || "—"}</Table.Cell>
						<Table.Cell>{formatCurrency(item.internal_amount)}</Table.Cell>
						<Table.Cell>{formatCurrency(item.external_amount)}</Table.Cell>
						<Table.Cell>
							<Badge variant={statusVariant(item.status)}>
								{item.status}
							</Badge>
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.notes || "—"}</Table.Cell>
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
						<Table.Cell colspan={8} class="h-24 text-center">
							{search ? "Tidak ada rekonsiliasi yang cocok." : "Belum ada data rekonsiliasi bank."}
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
			<Dialog.Title>Add Bank Reconciliation</Dialog.Title>
			<Dialog.Description>Catat rekonsiliasi pembayaran dengan PSP / Bank.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="payment_order_code">Payment Order Code</Label>
					<Input id="payment_order_code" name="payment_order_code" placeholder="ORD-XXXXX" required />
				</div>
				<div class="grid gap-2">
					<Label for="psp_reference_id">PSP Reference ID</Label>
					<Input id="psp_reference_id" name="psp_reference_id" placeholder="REF-XXXXX" />
				</div>
				<div class="grid gap-2">
					<Label for="internal_amount">Internal Amount</Label>
					<Input id="internal_amount" name="internal_amount" type="number" placeholder="50000" required />
				</div>
				<div class="grid gap-2">
					<Label for="external_amount">External Amount</Label>
					<Input id="external_amount" name="external_amount" type="number" placeholder="50000" />
				</div>
				<div class="grid gap-2">
					<Label for="status">Status</Label>
					<Select.Root name="status" type="single" value="MATCHED">
						<Select.Trigger><span>MATCHED</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="MATCHED">MATCHED</Select.Item>
							<Select.Item value="DISCREPANCY">DISCREPANCY</Select.Item>
							<Select.Item value="PENDING">PENDING</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-2">
					<Label for="notes">Notes</Label>
					<Input id="notes" name="notes" placeholder="Catatan opsional" />
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
			<Dialog.Title>Edit Bank Reconciliation</Dialog.Title>
			<Dialog.Description>Perbarui data rekonsiliasi pembayaran.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_payment_order_code">Payment Order Code</Label>
					<Input id="edit_payment_order_code" name="payment_order_code" value={editItem?.payment_order_code} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_psp_reference_id">PSP Reference ID</Label>
					<Input id="edit_psp_reference_id" name="psp_reference_id" value={editItem?.psp_reference_id || ""} />
				</div>
				<div class="grid gap-2">
					<Label for="edit_internal_amount">Internal Amount</Label>
					<Input id="edit_internal_amount" name="internal_amount" type="number" value={editItem?.internal_amount} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_external_amount">External Amount</Label>
					<Input id="edit_external_amount" name="external_amount" type="number" value={editItem?.external_amount || ""} />
				</div>
				<div class="grid gap-2">
					<Label for="edit_notes">Notes</Label>
					<Input id="edit_notes" name="notes" value={editItem?.notes || ""} />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="reconciliation" />
