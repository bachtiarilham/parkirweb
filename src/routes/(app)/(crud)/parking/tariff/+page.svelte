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
	import type { ParkingTariff } from "$lib/types/parking/tariff.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("tariff_code");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<ParkingTariff | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: ParkingTariff) =>
				item.tariff_code?.toLowerCase().includes(search.toLowerCase()) ||
				item.vehicle_type?.toLowerCase().includes(search.toLowerCase()) ||
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
			toast.success("Operasi konfigurasi tarif berhasil");
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
			selectedIds = new Set(paginated.map((u) => String(u.tariff_id)));
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

	function openEdit(item: ParkingTariff) {
		editItem = { ...item };
		editOpen = true;
	}

	function openDelete(id: string | number) {
		deleteId = String(id);
		deleteOpen = true;
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			tariff_id: u.tariff_id,
			tariff_code: u.tariff_code,
			branch_id: u.branch_id,
			vehicle_type: u.vehicle_type,
			base_fare: u.base_fare,
			hourly_fare: u.hourly_fare,
			grace_period_minutes: u.grace_period_minutes,
			is_active: u.is_active,
		}));
		if (format === "csv") exportToCSV(exportData, "tariffs");
		else exportToJSON(exportData, "tariffs");
	}

	const columns = [
		{ key: "tariff_code", label: "Kode Tarif" },
		{ key: "branch_id", label: "Cabang" },
		{ key: "vehicle_type", label: "Jenis Kendaraan" },
		{ key: "base_fare", label: "Tarif Awal (Jam 1)" },
		{ key: "hourly_fare", label: "Tarif Per Jam" },
		{ key: "grace_period_minutes", label: "Grace Period" },
		{ key: "is_active", label: "Status" },
	];
</script>

<svelte:head>
	<title>Parking Tariffs - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Parking Tariffs</h1>
			<p class="text-muted-foreground">Konfigurasi skema tarif parkir, grace period, dan biaya progresif.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Tariff
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari kode tarif atau jenis kendaraan..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} skema tarif
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
				{#each paginated as item (item.tariff_id)}
					<Table.Row class={selectedIds.has(String(item.tariff_id)) ? "bg-muted/50" : ""}>
						<Table.Cell>
							<input
								type="checkbox"
								checked={selectedIds.has(String(item.tariff_id))}
								onchange={() => toggleSelect(String(item.tariff_id))}
								class="accent-primary size-4"
							/>
						</Table.Cell>
						<Table.Cell class="font-mono font-bold text-primary">{item.tariff_code}</Table.Cell>
						<Table.Cell class="text-muted-foreground">Cabang #{item.branch_id}</Table.Cell>
						<Table.Cell>
							<Badge variant="outline">{item.vehicle_type}</Badge>
						</Table.Cell>
						<Table.Cell class="font-semibold">{formatCurrency(item.base_fare)}</Table.Cell>
						<Table.Cell class="font-medium text-emerald-600 dark:text-emerald-400">
							{formatCurrency(item.hourly_fare)}
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{item.grace_period_minutes} menit</Table.Cell>
						<Table.Cell>
							<Badge variant={item.is_active ? "default" : "secondary"}>
								{item.is_active ? "Aktif" : "Non-aktif"}
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
									onclick={() => openDelete(item.tariff_id)}
								>
									<TrashIcon class="size-4" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={9} class="h-24 text-center">
							{search ? "Tidak ada skema tarif yang cocok." : "Belum ada skema tarif parkir."}
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
			<Dialog.Title>Add Parking Tariff</Dialog.Title>
			<Dialog.Description>Buat skema penetapan tarif parkir baru.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="tariff_code">Kode Tarif</Label>
					<Input id="tariff_code" name="tariff_code" placeholder="TRF-MOBIL-NORMAL" required />
				</div>
				<div class="grid gap-2">
					<Label for="branch_id">Branch ID</Label>
					<Input id="branch_id" name="branch_id" type="number" placeholder="1" required />
				</div>
				<div class="grid gap-2">
					<Label for="vehicle_type">Jenis Kendaraan</Label>
					<Select.Root name="vehicle_type" type="single" value="CAR">
						<Select.Trigger><span>CAR (Mobil)</span></Select.Trigger>
						<Select.Content>
							<Select.Item value="CAR">CAR (Mobil)</Select.Item>
							<Select.Item value="MOTORCYCLE">MOTORCYCLE (Motor)</Select.Item>
							<Select.Item value="TRUCK">TRUCK (Truk)</Select.Item>
							<Select.Item value="BUS">BUS (Bus)</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-2">
					<Label for="base_fare">Tarif Jam Pertama (Rp)</Label>
					<Input id="base_fare" name="base_fare" type="number" placeholder="5000" required />
				</div>
				<div class="grid gap-2">
					<Label for="hourly_fare">Tarif Per Jam Berikutnya (Rp)</Label>
					<Input id="hourly_fare" name="hourly_fare" type="number" placeholder="3000" required />
				</div>
				<div class="grid gap-2">
					<Label for="grace_period_minutes">Grace Period Bebas Biaya (Menit)</Label>
					<Input id="grace_period_minutes" name="grace_period_minutes" type="number" value="10" required />
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
			<Dialog.Title>Edit Tariff</Dialog.Title>
			<Dialog.Description>Perbarui tarif parkir.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.tariff_id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_base_fare">Tarif Jam Pertama (Rp)</Label>
					<Input id="edit_base_fare" name="base_fare" type="number" value={editItem?.base_fare} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_hourly_fare">Tarif Per Jam Berikutnya (Rp)</Label>
					<Input id="edit_hourly_fare" name="hourly_fare" type="number" value={editItem?.hourly_fare} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_grace_period_minutes">Grace Period (Menit)</Label>
					<Input id="edit_grace_period_minutes" name="grace_period_minutes" type="number" value={editItem?.grace_period_minutes} required />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="tariff" />
