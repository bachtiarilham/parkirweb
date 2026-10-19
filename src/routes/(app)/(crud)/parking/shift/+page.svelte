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
	import type { Shift } from "$lib/types/parking/shift.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("start_time");
	let sortDir = $state<"asc" | "desc">("desc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<Shift | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: Shift) =>
				item.code?.toLowerCase().includes(search.toLowerCase()) ||
				String(item.user_id).includes(search) ||
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
			toast.success("Operasi shift berhasil");
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

	function formatDate(date: string | null | undefined) {
		if (!date) return "—";
		return new Intl.DateTimeFormat("id-ID", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	}

	function statusVariant(status: string) {
		switch (status?.toUpperCase()) {
			case "OPEN":
				return "default" as const;
			case "CLOSED":
			case "BALANCED":
				return "secondary" as const;
			case "UNBALANCED":
				return "destructive" as const;
			default:
				return "outline" as const;
		}
	}

	function openEdit(item: Shift) {
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
			branch_id: u.branch_id,
			user_id: u.user_id,
			start_time: formatDate(u.start_time),
			end_time: formatDate(u.end_time),
			cash_float_start: u.cash_float_start,
			cash_collected: u.cash_collected,
			status: u.status,
		}));
		if (format === "csv") exportToCSV(exportData, "shifts");
		else exportToJSON(exportData, "shifts");
	}

	const columns = [
		{ key: "code", label: "Kode Shift" },
		{ key: "user_id", label: "Petugas Loket" },
		{ key: "branch_id", label: "Cabang" },
		{ key: "start_time", label: "Mulai Shift" },
		{ key: "end_time", label: "Selesai Shift" },
		{ key: "cash_float_start", label: "Kas Awal (Modal)" },
		{ key: "cash_collected", label: "Kas Terkumpul" },
		{ key: "status", label: "Status" },
	];
</script>

<svelte:head>
	<title>Work Shifts - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Work Shifts</h1>
			<p class="text-muted-foreground">Kelola pembagian giliran shift loket dan modal kas awal.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Buka Shift Baru
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari kode shift atau petugas..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} shift
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
						<Table.Cell class="font-mono font-medium">{item.code || `SHF-${item.id}`}</Table.Cell>
						<Table.Cell class="font-semibold text-primary">Petugas #{item.user_id}</Table.Cell>
						<Table.Cell class="text-muted-foreground">Cabang #{item.branch_id}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.start_time)}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.end_time)}</Table.Cell>
						<Table.Cell>{formatCurrency(item.cash_float_start)}</Table.Cell>
						<Table.Cell class="font-semibold text-emerald-600 dark:text-emerald-400">
							{formatCurrency(item.cash_collected)}
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
						<Table.Cell colspan={10} class="h-24 text-center">
							{search ? "Tidak ada data shift yang cocok." : "Belum ada riwayat shift kerja."}
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
			<Dialog.Title>Buka Shift Baru</Dialog.Title>
			<Dialog.Description>Catat pembukaan giliran shift dan modal kas awal.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="user_id">User ID Petugas</Label>
					<Input id="user_id" name="user_id" type="number" placeholder="1" required />
				</div>
				<div class="grid gap-2">
					<Label for="branch_id">Branch ID Cabang</Label>
					<Input id="branch_id" name="branch_id" type="number" placeholder="1" required />
				</div>
				<div class="grid gap-2">
					<Label for="cash_float_start">Modal Kas Awal (Rp)</Label>
					<Input id="cash_float_start" name="cash_float_start" type="number" placeholder="100000" required />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Buka Shift</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Edit Dialog -->
<Dialog.Root bind:open={editOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Tutup / Perbarui Shift</Dialog.Title>
			<Dialog.Description>Catat penyelesaian shift dan kas fisik yang terkumpul.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_cash_collected">Total Kas Terkumpul (Rp)</Label>
					<Input id="edit_cash_collected" name="cash_collected" type="number" value={editItem?.cash_collected} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_status">Status</Label>
					<Select.Root name="status" type="single" value={editItem?.status || "CLOSED"}>
						<Select.Trigger><span>{editItem?.status || "CLOSED"}</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="CLOSED">CLOSED (Tutup)</Select.Item>
							<Select.Item value="BALANCED">BALANCED (Sesuai)</Select.Item>
							<Select.Item value="UNBALANCED">UNBALANCED (Selisih)</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Simpan & Tutup Shift</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="shift" />
