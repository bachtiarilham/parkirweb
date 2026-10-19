<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import DataTablePagination from "$lib/components/data-table-pagination.svelte";
	import BellRingIcon from "@lucide/svelte/icons/bell-ring";
	import CheckCircleIcon from "@lucide/svelte/icons/check-circle";
	import SearchIcon from "@lucide/svelte/icons/search";
	import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import { toast } from "svelte-sonner";
	import { enhance } from "$app/forms";
	import type { GateAlarm } from "$lib/types/parking/alarm.dto.js";

	let { data, form } = $props();

	let search = $state("");
	let triggerOpen = $state(false);
	let sortKey = $state<string>("triggered_at");
	let sortDir = $state<"asc" | "desc">("desc");
	let pageSize = $state(10);
	let currentPage = $state(1);

	const filtered = $derived(
		(data.items || []).filter(
			(item: GateAlarm) =>
				item.code?.toLowerCase().includes(search.toLowerCase()) ||
				String(item.gate_id).includes(search)
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
			toast.success("Operasi alarm berhasil");
			triggerOpen = false;
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
			second: "2-digit",
		}).format(new Date(date));
	}

	const columns = [
		{ key: "code", label: "Kode Alarm" },
		{ key: "gate_id", label: "Gate ID" },
		{ key: "triggered_at", label: "Waktu Trigger" },
		{ key: "acknowledged_at", label: "Waktu Direspons" },
		{ key: "latency_seconds", label: "Respon (Detik)" },
	];
</script>

<svelte:head>
	<title>Gate Alarms - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Gate Alarms</h1>
			<p class="text-muted-foreground">Monitoring dan penanganan alarm insiden barrier gate darurat.</p>
		</div>
		<Button variant="destructive" onclick={() => (triggerOpen = true)}>
			<BellRingIcon class="mr-2 size-4" />
			Trigger Manual Alarm
		</Button>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2">
		<div class="relative max-w-sm flex-1">
			<SearchIcon class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input placeholder="Cari alarm..." class="pl-9" bind:value={search} />
		</div>
		<p class="text-muted-foreground text-sm">
			{filtered.length} log alarm
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
						<Table.Cell class="font-mono font-medium text-destructive">{item.code || `ALM-${item.id}`}</Table.Cell>
						<Table.Cell class="font-semibold">Gerbang #{item.gate_id}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.triggered_at)}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(item.acknowledged_at)}</Table.Cell>
						<Table.Cell>{item.latency_seconds ? `${item.latency_seconds}s` : "—"}</Table.Cell>
						<Table.Cell>
							{#if !item.acknowledged_at}
								<form method="POST" action="?/ack" use:enhance>
									<input type="hidden" name="id" value={item.id} />
									<Button size="sm" variant="outline" type="submit">
										<CheckCircleIcon class="mr-1.5 size-3.5" />
										Acknowledge
									</Button>
								</form>
							{:else}
								<Badge variant="secondary">Resolved</Badge>
							{/if}
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="h-24 text-center">
							{search ? "Tidak ada log alarm yang cocok." : "Tidak ada insiden alarm aktif saat ini."}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<DataTablePagination totalItems={filtered.length} bind:pageSize bind:currentPage />
	</div>
</div>

<!-- Trigger Dialog -->
<Dialog.Root bind:open={triggerOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Trigger Manual Alarm</Dialog.Title>
			<Dialog.Description>Simulasikan trigger insiden pada barrier gate.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/trigger" use:enhance>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="gate_id">Gate ID</Label>
					<Input id="gate_id" name="gate_id" type="number" value="1" required />
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="destructive" type="submit">Trigger Sekarang</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
