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
	import type { MemberRiderPlan } from "$lib/types/membership/rider_plan.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let createOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let sortKey = $state<string>("member_rider_plan_name");
	let sortDir = $state<"asc" | "desc">("asc");
	let pageSize = $state(10);
	let currentPage = $state(1);
	let selectedIds = $state(new Set<string>());

	let editItem = $state<MemberRiderPlan | null>(null);
	let deleteId = $state("");

	const filtered = $derived(
		(data.items || []).filter(
			(item: MemberRiderPlan) =>
				item.member_rider_plan_name?.toLowerCase().includes(search.toLowerCase()) ||
				item.member_rider_plan_code?.toLowerCase().includes(search.toLowerCase())
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
			toast.success("Operasi paket rider berhasil");
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
			selectedIds = new Set(paginated.map((u) => String(u.member_rider_plan_id)));
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

	function openEdit(item: MemberRiderPlan) {
		editItem = { ...item };
		editOpen = true;
	}

	function openDelete(id: string | number) {
		deleteId = String(id);
		deleteOpen = true;
	}

	function handleExport(format: "csv" | "json") {
		const exportData = filtered.map((u) => ({
			id: u.member_rider_plan_id,
			code: u.member_rider_plan_code,
			name: u.member_rider_plan_name,
			price: u.member_rider_plan_price,
			duration_days: u.duration_days,
			vehicle_limit: u.vehicle_limit,
			is_active: u.is_active,
		}));
		if (format === "csv") exportToCSV(exportData, "rider_plans");
		else exportToJSON(exportData, "rider_plans");
	}

	const columns = [
		{ key: "member_rider_plan_code", label: "Kode Paket" },
		{ key: "member_rider_plan_name", label: "Nama Paket Langganan" },
		{ key: "member_rider_plan_price", label: "Harga" },
		{ key: "duration_days", label: "Durasi (Hari)" },
		{ key: "vehicle_limit", label: "Limit Kendaraan" },
		{ key: "is_active", label: "Status" },
	];
</script>

<svelte:head>
	<title>Rider Plans - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Rider Membership Plans</h1>
			<p class="text-muted-foreground">Konfigurasi paket tarif langganan bulanan pengendara/member.</p>
		</div>
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="mr-2 size-4" />
			Add Rider Plan
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari nama atau kode paket..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} paket
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
				{#each paginated as item (item.member_rider_plan_id)}
					<Table.Row class={selectedIds.has(String(item.member_rider_plan_id)) ? "bg-muted/50" : ""}>
						<Table.Cell>
							<input
								type="checkbox"
								checked={selectedIds.has(String(item.member_rider_plan_id))}
								onchange={() => toggleSelect(String(item.member_rider_plan_id))}
								class="accent-primary size-4"
							/>
						</Table.Cell>
						<Table.Cell class="font-mono font-medium">{item.member_rider_plan_code}</Table.Cell>
						<Table.Cell class="font-semibold text-foreground">{item.member_rider_plan_name}</Table.Cell>
						<Table.Cell class="font-semibold text-emerald-600 dark:text-emerald-400">
							{formatCurrency(item.member_rider_plan_price)}
						</Table.Cell>
						<Table.Cell>{item.duration_days} hari</Table.Cell>
						<Table.Cell>{item.vehicle_limit} kendaraan</Table.Cell>
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
									onclick={() => openDelete(item.member_rider_plan_id)}
								>
									<TrashIcon class="size-4" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={8} class="h-24 text-center">
							{search ? "Tidak ada paket yang cocok." : "Belum ada paket rider."}
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
			<Dialog.Title>Add Rider Plan</Dialog.Title>
			<Dialog.Description>Buat penawaran paket member bulanan baru.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="member_rider_plan_code">Kode Paket</Label>
					<Input id="member_rider_plan_code" name="member_rider_plan_code" placeholder="PLAN-MOBIL-1BLN" required />
				</div>
				<div class="grid gap-2">
					<Label for="member_rider_plan_name">Nama Paket</Label>
					<Input id="member_rider_plan_name" name="member_rider_plan_name" placeholder="Langganan Mobil 1 Bulan" required />
				</div>
				<div class="grid gap-2">
					<Label for="member_rider_plan_price">Harga (Rp)</Label>
					<Input id="member_rider_plan_price" name="member_rider_plan_price" type="number" placeholder="250000" required />
				</div>
				<div class="grid gap-2">
					<Label for="duration_days">Durasi (Hari)</Label>
					<Input id="duration_days" name="duration_days" type="number" value="30" required />
				</div>
				<div class="grid gap-2">
					<Label for="vehicle_limit">Limit Kendaraan Terdaftar</Label>
					<Input id="vehicle_limit" name="vehicle_limit" type="number" value="1" required />
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
			<Dialog.Title>Edit Rider Plan</Dialog.Title>
			<Dialog.Description>Perbarui data paket member.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="id" value={editItem?.member_rider_plan_id} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit_member_rider_plan_name">Nama Paket</Label>
					<Input id="edit_member_rider_plan_name" name="member_rider_plan_name" value={editItem?.member_rider_plan_name} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_member_rider_plan_price">Harga (Rp)</Label>
					<Input id="edit_member_rider_plan_price" name="member_rider_plan_price" type="number" value={editItem?.member_rider_plan_price} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_duration_days">Durasi (Hari)</Label>
					<Input id="edit_duration_days" name="duration_days" type="number" value={editItem?.duration_days} required />
				</div>
				<div class="grid gap-2">
					<Label for="edit_vehicle_limit">Limit Kendaraan</Label>
					<Input id="edit_vehicle_limit" name="vehicle_limit" type="number" value={editItem?.vehicle_limit} required />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<DeleteConfirmDialog bind:open={deleteOpen} action="?/delete" id={deleteId} itemName="rider plan" />
