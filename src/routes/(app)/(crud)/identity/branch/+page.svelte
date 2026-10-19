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
	import type { Branch } from "$lib/types/identity/branch.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("branch_name");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<Branch | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: Branch) =>
				item.branch_name?.toLowerCase().includes(search.toLowerCase()) ||
				item.branch_code?.toLowerCase().includes(search.toLowerCase()) ||
				item.status?.toLowerCase().includes(search.toLowerCase()) ||
				item.address?.toLowerCase().includes(search.toLowerCase())
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
			toast.success("Operasi cabang berhasil");
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
			selectedIds = new Set(paginated.map((u) => String(u.branch_id)));
		}
	}

	function openEdit(item: Branch) {
		editItem = { ...item };
		editOpen = true;
	}

	function openDelete(id: string | number) {
		deleteId = String(id);
		deleteOpen = true;
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			branch_id: u.branch_id,
			branch_code: u.branch_code,
			branch_name: u.branch_name,
			zona: u.zona,
			status: u.status,
			address: u.address,
		}));
		if (format === "csv") exportToCSV(exportData, "branches");
		else exportToJSON(exportData, "branches");
	}

	const columns = [
		{ key: "branch_code", label: "Kode Cabang" },
		{ key: "branch_name", label: "Nama Cabang" },
		{ key: "zona", label: "Zona" },
		{ key: "branch_type", label: "Tipe" },
		{ key: "address", label: "Alamat" },
		{ key: "status", label: "Status" },
	];
</script>

<svelte:head>
	<title>Branches - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Branches</h1>
			<p class="text-muted-foreground">Kelola cabang lokasi parkir operasional.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Branch
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari nama atau kode cabang..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} cabang
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
				{#each paginated as item (item.branch_id)}
					<Table.Row class={selectedIds.has(String(item.branch_id)) ? "bg-muted/50" : ""}>
						<Table.Cell>
							<input
								type="checkbox"
								checked={selectedIds.has(String(item.branch_id))}
								onchange={() => toggleSelect(String(item.branch_id))}
								class="accent-primary size-4"
							/>
						</Table.Cell>
						<Table.Cell class="font-mono font-medium">{item.branch_code || `BR-${item.branch_id}`}</Table.Cell>
						<Table.Cell class="font-semibold text-foreground">{item.branch_name}</Table.Cell>
						<Table.Cell>
							<Badge variant="outline">{item.zona}</Badge>
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.branch_type}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.address || "—"}</Table.Cell>
						<Table.Cell>
							<Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
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
									onclick={() => openDelete(item.branch_id)}
								>
									<TrashIcon class="size-4" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={8} class="h-24 text-center">
							{search ? "Tidak ada cabang yang cocok." : "Belum ada data cabang."}
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
			<Dialog.Title>Add Branch</Dialog.Title>
			<Dialog.Description>Buat cabang lokasi parkir baru.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="branch_name">Branch Name</Label>
					<Input id="branch_name" name="branch_name" placeholder="Mall Senayan Park" required />
				</div>
				<div class="grid gap-2">
					<Label for="tenant_id">Tenant ID</Label>
					<Input id="tenant_id" name="tenant_id" type="number" placeholder="1" required />
				</div>
				<div class="grid gap-2">
					<Label for="zona">Zona Tarif</Label>
					<Select.Root name="zona" type="single" value="NORMAL">
						<Select.Trigger><span>NORMAL</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="BLUECHIP">BLUECHIP</Select.Item>
							<Select.Item value="NORMAL">NORMAL</Select.Item>
							<Select.Item value="MURAH">MURAH</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-2">
					<Label for="address">Address</Label>
					<Input id="address" name="address" placeholder="Jl. Sudirman No. 10" />
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
			<Dialog.Title>Edit Branch</Dialog.Title>
			<Dialog.Description>Perbarui informasi cabang lokasi.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.branch_id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_branch_name">Branch Name</Label>
					<Input id="edit_branch_name" name="branch_name" value={editItem?.branch_name} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_address">Address</Label>
					<Input id="edit_address" name="address" value={editItem?.address || ""} />
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

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="branch" />
