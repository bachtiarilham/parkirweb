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
	import type { Promo } from "$lib/types/parking/promo.dto.js";

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

	let editItem = $state<Promo | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: Promo) =>
				item.code?.toLowerCase().includes(search.toLowerCase()) ||
				item.description?.toLowerCase().includes(search.toLowerCase()) ||
				item.discount_type?.toLowerCase().includes(search.toLowerCase())
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
			toast.success("Operasi promo berhasil");
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

	function openEdit(item: Promo) {
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
			description: u.description,
			discount_type: u.discount_type,
			discount_value: u.discount_value,
			start_date: u.start_date,
			end_date: u.end_date,
			usage_limit: u.usage_limit,
		}));
		if (format === "csv") exportToCSV(exportData, "promos");
		else exportToJSON(exportData, "promos");
	}

	const columns = [
		{ key: "code", label: "Kode Promo" },
		{ key: "description", label: "Deskripsi" },
		{ key: "discount_type", label: "Tipe Diskon" },
		{ key: "discount_value", label: "Besar Diskon" },
		{ key: "usage_limit", label: "Kuota" },
		{ key: "end_date", label: "Berlaku Sampai" },
	];
</script>

<svelte:head>
	<title>Promo Codes - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Voucher & Promo</h1>
			<p class="text-muted-foreground">Kelola kode kupon promosi dan potongan tarif parkir.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Promo
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari kode promo..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} promo
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
						<Table.Cell class="font-mono font-bold text-primary">{item.code}</Table.Cell>
						<Table.Cell class="font-medium text-foreground">{item.description || "—"}</Table.Cell>
						<Table.Cell>
							<Badge variant="outline">{item.discount_type}</Badge>
						</Table.Cell>
						<Table.Cell class="font-semibold text-emerald-600 dark:text-emerald-400">
							{item.discount_type === "PERCENT" ? `${item.discount_value}%` : `Rp ${Number(item.discount_value).toLocaleString("id-ID")}`}
						</Table.Cell>
						<Table.Cell>{item.usage_limit} kuota</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.end_date}</Table.Cell>
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
							{search ? "Tidak ada voucher promo yang cocok." : "Belum ada kode promo."}
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
			<Dialog.Title>Add Promo Code</Dialog.Title>
			<Dialog.Description>Buat kode voucher promo baru.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="code">Kode Promo</Label>
					<Input id="code" name="code" placeholder="WEEKEND50" required />
				</div>
				<div class="grid gap-2">
					<Label for="description">Deskripsi</Label>
					<Input id="description" name="description" placeholder="Diskon akhir pekan 50%" />
				</div>
				<div class="grid gap-2">
					<Label for="discount_type">Tipe Diskon</Label>
					<Select.Root name="discount_type" type="single" value="PERCENT">
						<Select.Trigger><span>PERCENT (%)</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="PERCENT">PERCENT (%)</Select.Item>
							<Select.Item value="FLAT">FLAT (Nominal Rp)</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-2">
					<Label for="discount_value">Besar Diskon</Label>
					<Input id="discount_value" name="discount_value" type="number" placeholder="50" required />
				</div>
				<div class="grid gap-2">
					<Label for="start_date">Mulai</Label>
					<Input id="start_date" name="start_date" type="date" required />
				</div>
				<div class="grid gap-2">
					<Label for="end_date">Berakhir</Label>
					<Input id="end_date" name="end_date" type="date" required />
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
			<Dialog.Title>Edit Promo</Dialog.Title>
			<Dialog.Description>Perbarui data kode promo.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_description">Deskripsi</Label>
					<Input id="edit_description" name="description" value={editItem?.description || ""} />
				</div>
				<div class="grid gap-2">
					<Label for="edit_discount_value">Besar Diskon</Label>
					<Input id="edit_discount_value" name="discount_value" type="number" value={editItem?.discount_value} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_usage_limit">Limit Kuota Penggunaan</Label>
					<Input id="edit_usage_limit" name="usage_limit" type="number" value={editItem?.usage_limit} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_end_date">Berakhir</Label>
					<Input id="edit_end_date" name="end_date" type="date" value={editItem?.end_date?.split("T")[0] || editItem?.end_date} required />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="promo" />
