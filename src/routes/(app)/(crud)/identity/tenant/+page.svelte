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
	import type { Tenant } from "$lib/types/identity/tenant.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("tenant_name");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<Tenant | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: Tenant) =>
				item.tenant_name?.toLowerCase().includes(search.toLowerCase()) ||
				item.tenant_code?.toLowerCase().includes(search.toLowerCase()) ||
				item.bank_name?.toLowerCase().includes(search.toLowerCase()) ||
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
			toast.success("Operasi tenant berhasil");
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
			selectedIds = new Set(paginated.map((u) => String(u.tenant_id)));
		}
	}

	function openEdit(item: Tenant) {
		editItem = { ...item };
		editOpen = true;
	}

	function openDelete(id: string | number) {
		deleteId = String(id);
		deleteOpen = true;
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			tenant_id: u.tenant_id,
			tenant_code: u.tenant_code,
			tenant_name: u.tenant_name,
			bank_name: u.bank_name,
			bank_account_number: u.bank_account_number,
			package_active: u.package_active,
			status: u.status,
		}));
		if (format === "csv") exportToCSV(exportData, "tenants");
		else exportToJSON(exportData, "tenants");
	}

	const columns = [
		{ key: "tenant_code", label: "Kode Tenant" },
		{ key: "tenant_name", label: "Nama Tenant / Vendor" },
		{ key: "package_active", label: "Paket Langganan" },
		{ key: "bank_name", label: "Bank" },
		{ key: "bank_account_number", label: "No. Rekening" },
		{ key: "status", label: "Status" },
	];
</script>

<svelte:head>
	<title>Tenants - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Tenants</h1>
			<p class="text-muted-foreground">Kelola organisasi penyewa parkir dan mitra pemilik lahan.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Tenant
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari nama atau kode tenant..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} tenant
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
				{#each paginated as item (item.tenant_id)}
					<Table.Row class={selectedIds.has(String(item.tenant_id)) ? "bg-muted/50" : ""}>
						<Table.Cell>
							<input
								type="checkbox"
								checked={selectedIds.has(String(item.tenant_id))}
								onchange={() => toggleSelect(String(item.tenant_id))}
								class="accent-primary size-4"
							/>
						</Table.Cell>
						<Table.Cell class="font-mono font-medium">{item.tenant_code || `TNT-${item.tenant_id}`}</Table.Cell>
						<Table.Cell class="font-semibold text-foreground">{item.tenant_name}</Table.Cell>
						<Table.Cell>
							<Badge variant="outline">{item.package_active}</Badge>
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.bank_name}</Table.Cell>
						<Table.Cell class="font-mono text-sm">{item.bank_account_number}</Table.Cell>
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
									onclick={() => openDelete(item.tenant_id)}
								>
									<TrashIcon class="size-4" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={8} class="h-24 text-center">
							{search ? "Tidak ada tenant yang cocok." : "Belum ada data tenant."}
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
			<Dialog.Title>Add Tenant</Dialog.Title>
			<Dialog.Description>Daftarkan mitra organisasi tenant baru.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="name">Nama Tenant</Label>
					<Input id="name" name="name" placeholder="PT Senayan Park Makmur" required />
				</div>
				<div class="grid gap-2">
					<Label for="bank_name">Nama Bank</Label>
					<Input id="bank_name" name="bank_name" placeholder="BCA" required />
				</div>
				<div class="grid gap-2">
					<Label for="bank_account_number">Nomor Rekening</Label>
					<Input id="bank_account_number" name="bank_account_number" placeholder="1234567890" required />
				</div>
				<div class="grid gap-2">
					<Label for="bank_account_name">Nama Pemilik Rekening</Label>
					<Input id="bank_account_name" name="bank_account_name" placeholder="PT Senayan Park Makmur" required />
				</div>
				<div class="grid gap-2">
					<Label for="package_active">Paket Layanan</Label>
					<Select.Root name="package_active" type="single" value="ENTERPRISE">
						<Select.Trigger><span>ENTERPRISE</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="BASIC">BASIC</Select.Item>
							<Select.Item value="PRO">PRO</Select.Item>
							<Select.Item value="ENTERPRISE">ENTERPRISE</Select.Item>
						</Select.Content>
					</Select.Root>
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
			<Dialog.Title>Edit Tenant</Dialog.Title>
			<Dialog.Description>Perbarui data profil mitra tenant.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.tenant_id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_tenant_name">Nama Tenant</Label>
					<Input id="edit_tenant_name" name="tenant_name" value={editItem?.tenant_name} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_bank_name">Nama Bank</Label>
					<Input id="edit_bank_name" name="bank_name" value={editItem?.bank_name} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_bank_account_number">Nomor Rekening</Label>
					<Input id="edit_bank_account_number" name="bank_account_number" value={editItem?.bank_account_number} required />
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

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="tenant" />
