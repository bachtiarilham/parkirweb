<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import DataTablePagination from "$lib/components/data-table-pagination.svelte";
	import LogInIcon from "@lucide/svelte/icons/log-in";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import SearchIcon from "@lucide/svelte/icons/search";
	import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import { toast } from "svelte-sonner";
	import { enhance } from "$app/forms";
	import type { OfficerPresence } from "$lib/types/parking/officer_presence.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let clockInOpen = $state(false);
	let sortKey = $state<string>("clock_in_at");
	let sortDir = $state<"asc" | "desc">("desc");
	let pageSize = $state(10);
	let currentPage = $state(1);

	const filtered = $derived(
		(data.items || []).filter(
			(item: OfficerPresence) =>
				String(item.officer_user_id).includes(search) ||
				item.code?.toLowerCase().includes(search.toLowerCase()) ||
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
		if (form?.message) toast.error(form.message);
		if (form?.success) {
			toast.success("Operasi presensi berhasil");
			clockInOpen = false;
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

	function formatDate(date: string | null | undefined) {
		if (!date) return "—";
		return new Intl.DateTimeFormat("id-ID", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	}

	const columns = [
		{ key: "code", label: "Kode Presensi" },
		{ key: "officer_user_id", label: "Petugas (User ID)" },
		{ key: "shift_id", label: "Shift ID" },
		{ key: "clock_in_at", label: "Clock In" },
		{ key: "clock_out_at", label: "Clock Out" },
		{ key: "status", label: "Status" },
	];
</script>

<svelte:head>
	<title>Officer Attendance - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Officer Attendance</h1>
			<p class="text-muted-foreground">Presensi dan pemantauan kehadiran jam kerja petugas loket parkir.</p>
		</div>
		<Button onclick={() => (clockInOpen = true)}>
			<LogInIcon class="mr-2 size-4" />
			Clock In Presensi
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari ID petugas atau kode..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} riwayat presensi
		</p>
	</div>

	<!-- Table -->
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
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
					<Table.Head class="w-[120px]">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginated as item (item.id)}
					<Table.Row>
						<Table.Cell class="font-mono font-medium">{item.code || `PRS-${item.id}`}</Table.Cell>
						<Table.Cell class="font-semibold text-primary">Petugas #{item.officer_user_id}</Table.Cell>
						<Table.Cell class="text-muted-foreground">Shift #{item.shift_id}</Table.Cell>
						<Table.Cell class="text-emerald-600 font-medium">{formatDate(item.clock_in_at)}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.clock_out_at)}</Table.Cell>
						<Table.Cell>
							<Badge variant={item.status === "PRESENT" ? "default" : "secondary"}>
								{item.status}
							</Badge>
						</Table.Cell>
						<Table.Cell>
							{#if !item.clock_out_at}
								<form method="POST" action="?/clockOut" use:enhance>
									<input type="hidden" name="id" value={item.id} />
									<Button size="sm" variant="destructive" type="submit">
										<LogOutIcon class="mr-1.5 size-3.5" />
										Clock Out
									</Button>
								</form>
							{:else}
								<Badge variant="outline">Selesai</Badge>
							{/if}
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={7} class="h-24 text-center">
							{search ? "Tidak ada presensi yang cocok." : "Belum ada log presensi petugas aktif."}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<DataTablePagination totalItems={filtered.length} bind:pageSize bind:currentPage />
	</div>
</div>

<!-- Clock In Dialog -->
<Dialog.Root bind:open={clockInOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Clock In Presensi</Dialog.Title>
			<Dialog.Description>Catat kehadiran petugas operasional shift.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/clockIn" use:enhance>
			<input type="hidden" name="branch_id" value={data.currentBranchId} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="officer_user_id">Officer User ID</Label>
					<Input id="officer_user_id" name="officer_user_id" type="number" value={data.currentUserId} required />
				</div>
				<div class="grid gap-2">
					<Label for="shift_id">Shift ID</Label>
					<Input id="shift_id" name="shift_id" type="number" value="1" required />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Konfirmasi Clock In</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
