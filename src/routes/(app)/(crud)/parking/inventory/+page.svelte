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
	import type { ParkSlotsInventory } from "$lib/types/parking/inventory.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("date");
	let sortDir = $state<"asc" | "desc">("desc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<ParkSlotsInventory | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: ParkSlotsInventory) =>
				item.vehicle_type?.toLowerCase().includes(search.toLowerCase()) ||
				item.date?.includes(search) ||
				String(item.branch_id).includes(search)
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
			toast.success("Operasi inventaris slot berhasil");
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

	function openEdit(item: ParkSlotsInventory) {
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
			branch_id: u.branch_id,
			vehicle_type: u.vehicle_type,
			date: u.date,
			total_slots: u.total_slots,
			total_reserved: u.total_reserved,
			available_slots: u.total_slots - u.total_reserved,
		}));
		if (format === "csv") exportToCSV(exportData, "slot_inventory");
		else exportToJSON(exportData, "slot_inventory");
	}

	const columns = [
		{ key: "branch_id", label: "Cabang" },
		{ key: "vehicle_type", label: "Tipe Kendaraan" },
		{ key: "date", label: "Tanggal" },
		{ key: "total_slots", label: "Kapasitas Total" },
		{ key: "total_reserved", label: "Terisi / Reserved" },
		{ key: "available", label: "Sisa Tersedia" },
	];
</script>

<svelte:head>
	<title>Slot Inventory - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Slot Inventory</h1>
			<p class="text-muted-foreground">Kapasitas kuota slot ruang parkir per jenis kendaraan.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Inventory Slot
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari tipe kendaraan atau tanggal..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} alokasi slot
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
					{@const available = item.total_slots - item.total_reserved}
					<Table.Row class={selectedIds.has(String(item.id)) ? "bg-muted/50" : ""}>
						<Table.Cell>
							<input
								type="checkbox"
								checked={selectedIds.has(String(item.id))}
								onchange={() => toggleSelect(String(item.id))}
								class="accent-primary size-4"
							/>
						</Table.Cell>
						<Table.Cell class="font-semibold text-primary">Cabang #{item.branch_id}</Table.Cell>
						<Table.Cell>
							<Badge variant="outline">{item.vehicle_type}</Badge>
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.date}</Table.Cell>
						<Table.Cell class="font-medium">{item.total_slots} slot</Table.Cell>
						<Table.Cell class="text-amber-600 dark:text-amber-400 font-medium">{item.total_reserved} slot</Table.Cell>
						<Table.Cell class="font-semibold text-emerald-600 dark:text-emerald-400">{available} slot</Table.Cell>
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
							{search ? "Tidak ada alokasi slot yang cocok." : "Belum ada inventaris slot."}
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
			<Dialog.Title>Add Inventory Slot</Dialog.Title>
			<Dialog.Description>Alokasikan kuota slot parkir baru.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="branch_id">Branch ID</Label>
					<Input id="branch_id" name="branch_id" type="number" placeholder="1" required />
				</div>
				<div class="grid gap-2">
					<Label for="vehicle_type">Tipe Kendaraan</Label>
					<Select.Root name="vehicle_type" type="single" value="MOBIL">
						<Select.Trigger><span>MOBIL</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="MOBIL">MOBIL</Select.Item>
							<Select.Item value="MOTOR">MOTOR</Select.Item>
							<Select.Item value="TRUK">TRUK</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-2">
					<Label for="date">Tanggal</Label>
					<Input id="date" name="date" type="date" required />
				</div>
				<div class="grid gap-2">
					<Label for="total_slots">Total Slot Kapasitas</Label>
					<Input id="total_slots" name="total_slots" type="number" placeholder="100" required />
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
			<Dialog.Title>Edit Inventory Slot</Dialog.Title>
			<Dialog.Description>Perbarui kapasitas slot parkir.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_total_slots">Total Slot Kapasitas</Label>
					<Input id="edit_total_slots" name="total_slots" type="number" value={editItem?.total_slots} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_total_reserved">Total Terisi / Reserved</Label>
					<Input id="edit_total_reserved" name="total_reserved" type="number" value={editItem?.total_reserved} required />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="slot inventory" />
