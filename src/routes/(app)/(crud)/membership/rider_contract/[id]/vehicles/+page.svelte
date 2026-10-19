<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import CarIcon from "@lucide/svelte/icons/car";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import SearchIcon from "@lucide/svelte/icons/search";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import { toast } from "svelte-sonner";
	import { enhance } from "$app/forms";
	import type { VehicleItemDto } from "$lib/types/membership/rider_vehicle.dto.js";

	let { data, form } = $props();

	const vehicles = $derived(data.vehicles || []);
	const quota = $derived(data.vehicleQuota || { maxVehicles: 0, registeredCount: 0, canAddMore: false });
	const contract = $derived(data.contract);

	let search = $state("");
	let addOpen = $state(false);
	let editOpen = $state(false);

	let newPlate = $state("");
	let newModel = $state("");
	let newType = $state("CAR");
	let isSubmitting = $state(false);

	let editItem = $state<VehicleItemDto | null>(null);
	let editPlate = $state("");
	let editModel = $state("");
	let editType = $state("CAR");

	const filteredVehicles = $derived(
		vehicles.filter((v: VehicleItemDto) =>
			v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
			(v.vehicleModel || "").toLowerCase().includes(search.toLowerCase()) ||
			v.vehicleType.toLowerCase().includes(search.toLowerCase())
		)
	);

	function openEdit(v: VehicleItemDto) {
		editItem = v;
		editPlate = v.licensePlate;
		editModel = v.vehicleModel || "";
		editType = v.vehicleType || "CAR";
		editOpen = true;
	}

	$effect(() => {
		if (form?.success) {
			if (form.action === "register") {
				toast.success("Kendaraan berhasil didaftarkan!");
				addOpen = false;
				newPlate = "";
				newModel = "";
			} else if (form.action === "update") {
				toast.success("Kendaraan berhasil diperbarui!");
				editOpen = false;
			} else if (form.action === "toggleActive") {
				toast.success("Plat aktif berhasil diganti!");
			} else if (form.action === "delete") {
				toast.success("Kendaraan berhasil dihapus!");
			}
		} else if (form?.message) {
			toast.error(form.message);
		}
	});
</script>

<svelte:head>
	<title>Kendaraan Membership #{data.contractId} – Web Parkir</title>
</svelte:head>

<div class="space-y-6">
	<!-- Top Navigation -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					href="/membership/rider_contract"
					class="size-8 rounded-lg"
					title="Kembali ke Daftar Kontrak"
				>
					<ArrowLeftIcon class="size-4" />
				</Button>
				<h1 class="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
					<CarIcon class="size-6 text-primary" />
					Kendaraan Kontrak #{data.contractId}
				</h1>
			</div>
			<p class="text-xs text-muted-foreground pl-10">
				{#if contract}
					Kode: <span class="font-mono font-semibold text-foreground">{contract.code}</span> •
					RFID: <span class="font-mono font-semibold text-foreground">{contract.rfid_card_no || "-"}</span> •
				{/if}
				Kelola plat kendaraan yang terikat dengan paket membership ini.
			</p>
		</div>

		<!-- Action & Kuota Header -->
		<div class="flex items-center gap-3">
			<Badge variant="secondary" class="font-mono text-xs px-3 py-1.5">
				Kuota Kendaraan: {quota.registeredCount}/{quota.maxVehicles}
			</Badge>
			<Button
				variant="default"
				size="sm"
				class="rounded-xl font-semibold flex items-center gap-1.5"
				disabled={!quota.canAddMore && quota.maxVehicles > 0}
				onclick={() => (addOpen = true)}
			>
				<PlusIcon class="size-4" />
				Tambah Kendaraan
			</Button>
		</div>
	</div>

	<!-- Main Card Table -->
	<Card.Root class="rounded-2xl shadow-sm border-border/80">
		<Card.Header class="pb-3 border-b">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<Card.Title class="text-base font-bold uppercase tracking-wider text-foreground">
					Daftar Kendaraan Terdaftar
				</Card.Title>
				<div class="relative w-full sm:w-64">
					<SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						bind:value={search}
						placeholder="Cari plat atau model..."
						class="pl-9 h-9 rounded-xl text-xs"
					/>
				</div>
			</div>
		</Card.Header>

		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row class="bg-muted/30">
						<Table.Head class="font-bold">Plat Nomor</Table.Head>
						<Table.Head class="font-bold">Model Kendaraan</Table.Head>
						<Table.Head class="font-bold">Jenis</Table.Head>
						<Table.Head class="font-bold">Status Plat</Table.Head>
						<Table.Head class="text-right font-bold pr-6">Aksi</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if filteredVehicles.length > 0}
						{#each filteredVehicles as v (v.id)}
							<Table.Row>
								<Table.Cell class="font-mono font-bold text-base tracking-wider text-foreground">
									{v.licensePlate}
								</Table.Cell>
								<Table.Cell class="text-muted-foreground font-medium">
									{v.vehicleModel || "-"}
								</Table.Cell>
								<Table.Cell>
									<Badge variant="outline" class="text-xs">
										{v.vehicleType}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									{#if v.isActive}
										<Badge class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 w-fit">
											<CheckCircle2Icon class="size-3" />
											AKTIF
										</Badge>
									{:else}
										<Badge variant="secondary" class="text-xs font-medium text-muted-foreground">
											NONAKTIF
										</Badge>
									{/if}
								</Table.Cell>
								<Table.Cell class="text-right pr-6 space-x-1">
									{#if !v.isActive}
										<form method="POST" action="?/toggleActive" use:enhance class="inline-block">
											<input type="hidden" name="vehicleId" value={v.id} />
											<Button
												type="submit"
												variant="outline"
												size="sm"
												class="h-8 rounded-lg text-xs font-semibold text-emerald-600 border-emerald-600/30 hover:bg-emerald-600 hover:text-white"
											>
												Aktifkan
											</Button>
										</form>
									{/if}

									<Button
										variant="ghost"
										size="icon"
										class="size-8 rounded-lg"
										onclick={() => openEdit(v)}
										title="Edit Kendaraan"
									>
										<PencilIcon class="size-4 text-muted-foreground" />
									</Button>

									<form method="POST" action="?/delete" use:enhance class="inline-block">
										<input type="hidden" name="vehicleId" value={v.id} />
										<Button
											type="submit"
											variant="ghost"
											size="icon"
											class="size-8 rounded-lg hover:text-destructive"
											title="Hapus Kendaraan"
											onclick={(e) => {
												if (!confirm(`Hapus kendaraan ${v.licensePlate}?`)) {
													e.preventDefault();
												}
											}}
										>
											<Trash2Icon class="size-4" />
										</Button>
									</form>
								</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={5} class="text-center py-8 text-muted-foreground">
								Belum ada kendaraan yang terdaftar untuk kontrak ini.
							</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>

		<Card.Footer class="py-3 px-6 bg-muted/20 border-t text-xs text-muted-foreground">
			*Pilih tombol "Aktifkan" untuk mengganti plat yang dipakai masuk ke area parkir.
		</Card.Footer>
	</Card.Root>
</div>

<!-- DIALOG: TAMBAH KENDARAAN -->
<Dialog.Root bind:open={addOpen}>
	<Dialog.Content class="sm:max-w-md rounded-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold">Tambah Kendaraan Baru</Dialog.Title>
			<Dialog.Description class="text-sm text-muted-foreground">
				Daftarkan plat nomor kendaraan untuk kontrak #{data.contractId}.
			</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			action="?/register"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-4 py-2"
		>
			<div class="space-y-2">
				<Label for="add-plate" class="text-sm font-semibold">
					Plat Nomor Kendaraan <span class="text-destructive">*</span>
				</Label>
				<Input
					id="add-plate"
					name="licensePlate"
					bind:value={newPlate}
					placeholder="Contoh: B 1234 ABC"
					class="rounded-xl font-mono uppercase font-bold text-base"
					required
					maxlength={12}
				/>
			</div>

			<div class="space-y-2">
				<Label for="add-model" class="text-sm font-semibold">Model Kendaraan (Opsional)</Label>
				<Input
					id="add-model"
					name="vehicleModel"
					bind:value={newModel}
					placeholder="Contoh: Toyota Yaris"
					class="rounded-xl"
				/>
			</div>

			<div class="space-y-2">
				<Label for="add-type" class="text-sm font-semibold">Jenis Kendaraan</Label>
				<select
					id="add-type"
					name="vehicleType"
					bind:value={newType}
					class="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<option value="CAR">Mobil (CAR)</option>
					<option value="MOTORCYCLE">Motor (MOTORCYCLE)</option>
					<option value="BUS">Bus (BUS)</option>
					<option value="TRUCK">Truk (TRUCK)</option>
				</select>
			</div>

			<Dialog.Footer class="mt-6 flex-col sm:flex-row gap-2">
				<Button
					type="button"
					variant="outline"
					class="rounded-xl"
					onclick={() => (addOpen = false)}
					disabled={isSubmitting}
				>
					Batal
				</Button>
				<Button
					type="submit"
					variant="default"
					class="rounded-xl font-semibold flex-1"
					disabled={isSubmitting || !newPlate.trim()}
				>
					{#if isSubmitting}
						<Loader2Icon class="size-4 animate-spin mr-2" />
						Menyimpan...
					{:else}
						Simpan Kendaraan
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- DIALOG: EDIT KENDARAAN -->
<Dialog.Root bind:open={editOpen}>
	<Dialog.Content class="sm:max-w-md rounded-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold">Edit Data Kendaraan</Dialog.Title>
			<Dialog.Description class="text-sm text-muted-foreground">
				Perbarui informasi kendaraan terdaftar.
			</Dialog.Description>
		</Dialog.Header>

		{#if editItem}
			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="space-y-4 py-2"
			>
				<input type="hidden" name="vehicleId" value={editItem.id} />

				<div class="space-y-2">
					<Label for="edit-plate" class="text-sm font-semibold">
						Plat Nomor Kendaraan <span class="text-destructive">*</span>
					</Label>
					<Input
						id="edit-plate"
						name="licensePlate"
						bind:value={editPlate}
						placeholder="Contoh: B 1234 ABC"
						class="rounded-xl font-mono uppercase font-bold text-base"
						required
						maxlength={12}
					/>
				</div>

				<div class="space-y-2">
					<Label for="edit-model" class="text-sm font-semibold">Model Kendaraan</Label>
					<Input
						id="edit-model"
						name="vehicleModel"
						bind:value={editModel}
						placeholder="Contoh: Toyota Yaris"
						class="rounded-xl"
					/>
				</div>

				<div class="space-y-2">
					<Label for="edit-type" class="text-sm font-semibold">Jenis Kendaraan</Label>
					<select
						id="edit-type"
						name="vehicleType"
						bind:value={editType}
						class="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
					>
						<option value="CAR">Mobil (CAR)</option>
						<option value="MOTORCYCLE">Motor (MOTORCYCLE)</option>
						<option value="BUS">Bus (BUS)</option>
						<option value="TRUCK">Truk (TRUCK)</option>
					</select>
				</div>

				<Dialog.Footer class="mt-6 flex-col sm:flex-row gap-2">
					<Button
						type="button"
						variant="outline"
						class="rounded-xl"
						onclick={() => (editOpen = false)}
						disabled={isSubmitting}
					>
						Batal
					</Button>
					<Button
						type="submit"
						variant="default"
						class="rounded-xl font-semibold flex-1"
						disabled={isSubmitting || !editPlate.trim()}
					>
						{#if isSubmitting}
							<Loader2Icon class="size-4 animate-spin mr-2" />
							Memperbarui...
						{:else}
							Simpan Perubahan
						{/if}
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
