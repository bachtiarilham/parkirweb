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
	import type { Gate } from "$lib/types/identity/gate.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("gate_name");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<Gate | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: Gate) =>
				item.gate_name?.toLowerCase().includes(search.toLowerCase()) ||
				item.gate_code?.toLowerCase().includes(search.toLowerCase()) ||
				item.hardware_ip?.toLowerCase().includes(search.toLowerCase()) ||
				item.gate_type?.toLowerCase().includes(search.toLowerCase())
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
			toast.success("Operasi gerbang berhasil");
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
			selectedIds = new Set(paginated.map((u) => String(u.gate_id)));
		}
	}

	function openEdit(item: Gate) {
		editItem = { ...item };
		editOpen = true;
	}

	function openDelete(id: string | number) {
		deleteId = String(id);
		deleteOpen = true;
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			gate_id: u.gate_id,
			gate_code: u.gate_code,
			gate_name: u.gate_name,
			gate_type: u.gate_type,
			hardware_ip: u.hardware_ip,
			status: u.status,
		}));
		if (format === "csv") exportToCSV(exportData, "gates");
		else exportToJSON(exportData, "gates");
	}

	const columns = [
		{ key: "gate_code", label: "Kode Gerbang" },
		{ key: "gate_name", label: "Nama Gerbang" },
		{ key: "gate_type", label: "Tipe" },
		{ key: "hardware_ip", label: "Hardware IP" },
		{ key: "status", label: "Status" },
	];
</script>

<svelte:head>
	<title>Gates - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Barrier Gates</h1>
			<p class="text-muted-foreground">Kelola perangkat portal / barrier gate masuk & keluar.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Gate
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari gerbang atau IP..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} gerbang
		</p>
		<div class="ml-auto flex items-center gap-2">
			{#if selectedIds.size > 0}
				<form method="POST" action="?/bulkDelete" use:enhance>
					<input type="hidden" name="branch_id" value={data.currentBranchId} />
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
				{#each paginated as item (item.gate_id)}
					<Table.Row class={selectedIds.has(String(item.gate_id)) ? "bg-muted/50" : ""}>
						<Table.Cell>
							<input
								type="checkbox"
								checked={selectedIds.has(String(item.gate_id))}
								onchange={() => toggleSelect(String(item.gate_id))}
								class="accent-primary size-4"
							/>
						</Table.Cell>
						<Table.Cell class="font-mono font-medium">{item.gate_code || `GT-${item.gate_id}`}</Table.Cell>
						<Table.Cell class="font-semibold text-foreground">{item.gate_name}</Table.Cell>
						<Table.Cell>
							<Badge variant={item.gate_type === "IN" ? "default" : "secondary"}>
								{item.gate_type}
							</Badge>
						</Table.Cell>
						<Table.Cell class="font-mono text-xs">{item.hardware_ip}</Table.Cell>
						<Table.Cell>
							<Badge variant={item.status === "ACTIVE" ? "default" : "outline"}>
								{item.status || "ACTIVE"}
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
									onclick={() => openDelete(item.gate_id)}
								>
									<TrashIcon class="size-4" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={7} class="h-24 text-center">
							{search ? "Tidak ada gerbang yang cocok." : "Belum ada data barrier gate."}
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
			<Dialog.Title>Add Barrier Gate</Dialog.Title>
			<Dialog.Description>Daftarkan perangkat barrier gate baru.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<input type="hidden" name="branch_id" value={data.currentBranchId} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="gate_name">Gate Name</Label>
					<Input id="gate_name" name="gate_name" placeholder="Pintu Masuk Barat 01" required />
				</div>
				<div class="grid gap-2">
					<Label for="gate_type">Tipe Gerbang</Label>
					<Select.Root name="gate_type" type="single" value="IN">
						<Select.Trigger><span>IN (Masuk)</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="IN">IN (Masuk)</Select.Item>
							<Select.Item value="OUT">OUT (Keluar)</Select.Item>
							<Select.Item value="BIDIRECTIONAL">BIDIRECTIONAL</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-2">
					<Label for="hardware_ip">Hardware IP Address</Label>
					<Input id="hardware_ip" name="hardware_ip" placeholder="192.168.1.101" required />
				</div>
				<div class="grid gap-2">
					<Label for="status">Status</Label>
					<Select.Root name="status" type="single" value="ACTIVE">
						<Select.Trigger><span>ACTIVE</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="ACTIVE">ACTIVE</Select.Item>
							<Select.Item value="INACTIVE">INACTIVE</Select.Item>
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
			<Dialog.Title>Edit Gate</Dialog.Title>
			<Dialog.Description>Perbarui informasi gerbang.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.gate_id} />
			<input type="hidden" name="branch_id" value={data.currentBranchId} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_gate_name">Gate Name</Label>
					<Input id="edit_gate_name" name="gate_name" value={editItem?.gate_name} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_hardware_ip">Hardware IP Address</Label>
					<Input id="edit_hardware_ip" name="hardware_ip" value={editItem?.hardware_ip} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_status">Status</Label>
					<Input id="edit_status" name="status" value={editItem?.status || "ACTIVE"} />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="gate" />
