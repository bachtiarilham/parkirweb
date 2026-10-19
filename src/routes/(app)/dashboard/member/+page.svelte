<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import CarIcon from "@lucide/svelte/icons/car";
	import BikeIcon from "@lucide/svelte/icons/bike";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
	import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import { toast } from "svelte-sonner";
	import { enhance } from "$app/forms";
	import type { VehicleItemDto } from "$lib/types/membership/rider_vehicle.dto.js";

	let { data, form } = $props();

	const membership = $derived(data.dashboardData?.membership_data ?? null);
	const parkingSessions = $derived(data.dashboardData?.parking_data ?? []);
	const payOrders = $derived(data.dashboardData?.financial_data ?? []);
	const vehicles = $derived(data.vehicles ?? []);
	const quota = $derived(
		data.vehicleQuota ?? {
			maxVehicles: 0,
			registeredCount: 0,
			canAddMore: false,
		}
	);

	const userName = $derived(
		data.user?.fullName || "Pelanggan"
	);

	// Dialog State: Tambah Kendaraan
	let addVehicleOpen = $state(false);
	let newPlate = $state("");
	let newModel = $state("");
	let newType = $state("CAR");
	let isAddingVehicle = $state(false);

	// Dialog State: Edit Kendaraan
	let editVehicleOpen = $state(false);
	let editVehicleItem = $state<VehicleItemDto | null>(null);
	let editPlate = $state("");
	let editModel = $state("");
	let editType = $state("CAR");
	let isEditingVehicle = $state(false);

	// Dialog State: Perpanjang Paket (Renew)
	let renewDialogOpen = $state(false);
	let selectedPaymentMethod = $state("MIDTRANS");
	let isRenewing = $state(false);

	function formatRupiah(val: string | number | null | undefined): string {
		if (!val) return "0";
		const num = typeof val === "string" ? parseFloat(val) : val;
		if (isNaN(num)) return "0";
		return new Intl.NumberFormat("id-ID").format(num);
	}

	function formatDate(dateStr: string | null | undefined): string {
		if (!dateStr) return "-";
		try {
			const d = new Date(dateStr);
			if (isNaN(d.getTime())) return dateStr;
			return new Intl.DateTimeFormat("id-ID", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}).format(d);
		} catch {
			return dateStr;
		}
	}

	function formatDateTime(dateStr: string | null | undefined): string {
		if (!dateStr) return "-";
		try {
			const d = new Date(dateStr);
			if (isNaN(d.getTime())) return dateStr;
			return new Intl.DateTimeFormat("id-ID", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}).format(d) + " WIB";
		} catch {
			return dateStr;
		}
	}

	function openEditModal(v: VehicleItemDto) {
		editVehicleItem = v;
		editPlate = v.licensePlate;
		editModel = v.vehicleModel || "";
		editType = v.vehicleType || "CAR";
		editVehicleOpen = true;
	}

	// Tangani response form actions
	$effect(() => {
		if (form?.success) {
			if (form.action === "renew") {
				const renewal = form.renewal;
				toast.success(`Tagihan perpanjangan dibuat: ${renewal?.orderCode || ""}`);
				renewDialogOpen = false;

				if (typeof window !== "undefined" && window.snap && renewal?.snapToken) {
					window.snap.pay(renewal.snapToken, {
						onSuccess: function () {
							toast.success("Perpanjangan paket berhasil dibayar!");
							window.location.reload();
						},
						onPending: function () {
							toast.info("Menunggu penyelesaian pembayaran...");
						},
						onError: function () {
							toast.error("Pembayaran dibatalkan atau gagal.");
						},
						onClose: function () {
							toast.warning("Jendela pembayaran ditutup.");
						},
					});
				} else if (renewal?.redirectUrl) {
					window.open(renewal.redirectUrl, "_blank");
				}
			} else if (form.action === "registerVehicle") {
				toast.success("Kendaraan berhasil didaftarkan!");
				addVehicleOpen = false;
				newPlate = "";
				newModel = "";
			} else if (form.action === "updateVehicle") {
				toast.success("Data kendaraan berhasil diperbarui!");
				editVehicleOpen = false;
			} else if (form.action === "toggleActiveVehicle") {
				toast.success("Status plat aktif berhasil dialihkan!");
			} else if (form.action === "deleteVehicle") {
				toast.success("Kendaraan berhasil dihapus dari paket.");
			}
		} else if (form?.message) {
			toast.error(form.message);
		}
	});
</script>

<svelte:head>
	<title>Member Dashboard – Web Parkir</title>
	<!-- Midtrans Snap Script Sandbox -->
	<script
		src="https://app.sandbox.midtrans.com/snap/snap.js"
		data-client-key="SB-Mid-client-sample"
	></script>
</svelte:head>

<div class="space-y-6">
	<!-- Banner Error Jika Ada Dari Backend -->
	{#if data.error}
		<div class="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm flex items-center justify-between">
			<div class="flex items-center gap-2">
				<AlertCircleIcon class="size-4 shrink-0" />
				<span>{data.error}</span>
			</div>
			<Button variant="outline" size="sm" onclick={() => window.location.reload()}>
				Muat Ulang
			</Button>
		</div>
	{/if}

	<!-- GREETING HEADER -->
	<div class="space-y-1">
		<h1 class="text-3xl font-extrabold tracking-tight text-foreground uppercase">
			HALO, {userName}
		</h1>
		<p class="text-sm text-muted-foreground">
			Ringkasan akun dan akses parkir Anda hari ini.
		</p>
	</div>

	<!-- BARIS 1: STATUS MEMBERSHIP & RIWAYAT TRANSAKSI TERAKHIR -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
		<!-- KIRI: STATUS MEMBERSHIP AKTIF (7 Cols) -->
		<Card.Root class="lg:col-span-7 flex flex-col justify-between rounded-2xl shadow-sm border-border/80">
			<Card.Header class="pb-3 border-b">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
						<ShieldCheckIcon class="size-5 text-emerald-600" />
						Status Membership Aktif
					</Card.Title>
					{#if membership}
						<Badge
							variant={membership.status?.toUpperCase() === "ACTIVE" ? "default" : "secondary"}
							class="font-semibold text-xs uppercase"
						>
							{membership.status || "AKTIF"}
						</Badge>
					{/if}
				</div>
			</Card.Header>

			<Card.Content class="py-5 space-y-4 text-sm grow">
				{#if membership}
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4">
						<span class="text-muted-foreground font-medium">Paket</span>
						<span class="sm:col-span-2 font-bold text-foreground flex items-center gap-1.5">
							{membership.planName}
							{#if membership.features && membership.features.length > 0}
								<Badge variant="secondary" class="text-[10px] px-1.5 py-0 font-normal">VIP</Badge>
							{/if}
						</span>

						<span class="text-muted-foreground font-medium">Masa Berlaku</span>
						<span class="sm:col-span-2 text-foreground font-medium">
							Berlaku s/d {formatDate(membership.endDate)}
							<span class="text-xs text-muted-foreground ml-1">
								(Sisa {membership.daysRemaining ?? 0} Hari)
							</span>
						</span>

						<span class="text-muted-foreground font-medium">Status</span>
						<div class="sm:col-span-2 flex items-center gap-2">
							<span class="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
							<Badge variant="outline" class="text-[10px]">
								Auto-Renewal: {membership.isAutoRenew ? "ON" : "OFF"}
							</Badge>
						</div>

						<span class="text-muted-foreground font-medium">Lokasi / Tenant</span>
						<span class="sm:col-span-2 text-foreground">
							{#if membership.allowedTenants && membership.allowedTenants.length > 0}
								{membership.allowedTenants.map((t) => t.tenantName).join(", ")}
							{:else}
								Semua Lokasi Tenant Parkir
							{/if}
						</span>

						{#if membership.rfidCardNo}
							<span class="text-muted-foreground font-medium">Kartu RFID / E-Money</span>
							<span class="sm:col-span-2 font-mono text-xs font-semibold text-foreground">
								{membership.rfidCardNo}
							</span>
						{/if}
					</div>
				{:else}
					<div class="text-center py-6 space-y-3">
						<div class="p-3 bg-secondary/80 rounded-full w-fit mx-auto text-muted-foreground">
							<CreditCardIcon class="size-6" />
						</div>
						<p class="text-muted-foreground font-medium">
							Anda belum memiliki paket membership rider aktif.
						</p>
						<Button href="/pricing" variant="default" size="sm" class="rounded-xl">
							Lihat Pilihan Paket Parkir
							<ArrowRightIcon class="size-4 ml-1.5" />
						</Button>
					</div>
				{/if}
			</Card.Content>

			<Card.Footer class="pt-3 border-t flex items-center justify-between">
				{#if membership}
					<Button
						variant="default"
						class="rounded-xl font-semibold flex items-center gap-2"
						onclick={() => (renewDialogOpen = true)}
					>
						<RefreshCwIcon class="size-4" />
						Perpanjang Paket
					</Button>
					<span class="text-xs text-muted-foreground font-mono">
						ID: {membership.membershipId}
					</span>
				{:else}
					<span class="text-xs text-muted-foreground">Daftar sekarang untuk akses 24/7</span>
				{/if}
			</Card.Footer>
		</Card.Root>

		<!-- KANAN: RIWAYAT TRANSAKSI TERAKHIR (5 Cols) -->
		<Card.Root class="lg:col-span-5 flex flex-col justify-between rounded-2xl shadow-sm border-border/80">
			<Card.Header class="pb-3 border-b">
				<Card.Title class="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
					<ClockIcon class="size-5 text-primary" />
					Riwayat Transaksi Terakhir
				</Card.Title>
			</Card.Header>

			<Card.Content class="py-4 space-y-3 grow">
				{#if payOrders.length > 0}
					<div class="space-y-3">
						{#each payOrders.slice(0, 3) as tx (tx.id)}
							<div class="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-1">
								<div class="flex items-center justify-between text-xs text-muted-foreground">
									<span class="font-medium">• {formatDate(tx.created_at)}</span>
									<span class="font-mono">{tx.payment_order_code}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="font-bold text-foreground text-sm">
										Rp {formatRupiah(tx.amount)}
										<span class="text-xs font-normal text-muted-foreground ml-1">
											({tx.reference_code || "Online Payment"})
										</span>
									</span>
									<Badge
										variant={tx.status?.toUpperCase() === "PAID" || tx.status?.toUpperCase() === "SUCCESS" ? "default" : "secondary"}
										class="text-[10px] px-1.5 py-0 uppercase font-semibold"
									>
										{tx.status?.toUpperCase() === "PAID" ? "BERHASIL" : tx.status}
									</Badge>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-muted-foreground space-y-1">
						<p class="text-sm font-medium">Belum ada riwayat transaksi pembayaran.</p>
						<p class="text-xs">Semua tagihan langganan Anda akan tampil di sini.</p>
					</div>
				{/if}
			</Card.Content>

			<Card.Footer class="pt-3 border-t">
				<Button
					variant="outline"
					size="sm"
					href="/financial/order"
					class="w-full rounded-xl text-xs flex items-center justify-center gap-1.5"
				>
					Lihat Semua Transaksi
					<ExternalLinkIcon class="size-3.5" />
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>

	<!-- BARIS 2: MANAJEMEN KENDARAAN (KUOTA: X/Y) -->
	<Card.Root class="rounded-2xl shadow-sm border-border/80">
		<Card.Header class="pb-3 border-b">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<Card.Title class="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
						<CarIcon class="size-5 text-primary" />
						Manajemen Kendaraan
						<span class="text-sm font-normal text-muted-foreground ml-1 font-mono">
							(Kuota: {quota.registeredCount}/{quota.maxVehicles})
						</span>
					</Card.Title>
				</div>
				<Button
					variant="default"
					size="sm"
					class="rounded-xl font-semibold flex items-center gap-1.5"
					disabled={!quota.canAddMore && quota.maxVehicles > 0}
					onclick={() => (addVehicleOpen = true)}
				>
					<PlusIcon class="size-4" />
					Tambah Kendaraan
				</Button>
			</div>
		</Card.Header>

		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row class="bg-muted/30">
						<Table.Head class="w-[180px] font-bold">Plat Nomor</Table.Head>
						<Table.Head class="font-bold">Model Kendaraan</Table.Head>
						<Table.Head class="font-bold">Jenis</Table.Head>
						<Table.Head class="font-bold">Status Plat</Table.Head>
						<Table.Head class="text-right font-bold pr-6">Aksi</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if vehicles.length > 0}
						{#each vehicles as v (v.id)}
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
										<form method="POST" action="?/toggleActiveVehicle" use:enhance class="inline-block">
											<input type="hidden" name="contractId" value={v.contractId} />
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
										onclick={() => openEditModal(v)}
										title="Edit Kendaraan"
									>
										<PencilIcon class="size-4 text-muted-foreground" />
									</Button>

									<form method="POST" action="?/deleteVehicle" use:enhance class="inline-block">
										<input type="hidden" name="contractId" value={v.contractId} />
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
								Belum ada kendaraan yang didaftarkan ke paket membership ini.
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

	<!-- BARIS 3: LOG PARKIR TERAKHIR -->
	<Card.Root class="rounded-2xl shadow-sm border-border/80">
		<Card.Header class="pb-3 border-b">
			<Card.Title class="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
				<MapPinIcon class="size-5 text-primary" />
				Log Parkir Terakhir
			</Card.Title>
		</Card.Header>

		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row class="bg-muted/30">
						<Table.Head class="font-bold w-[220px]">Tanggal & Jam</Table.Head>
						<Table.Head class="font-bold w-[160px]">Plat Nomor</Table.Head>
						<Table.Head class="font-bold">Lokasi / Cabang</Table.Head>
						<Table.Head class="font-bold">Durasi</Table.Head>
						<Table.Head class="text-right font-bold pr-6">Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if parkingSessions.length > 0}
						{#each parkingSessions as s (s.id)}
							<Table.Row>
								<Table.Cell class="font-medium text-foreground text-sm">
									{formatDateTime(s.check_in_time)}
								</Table.Cell>
								<Table.Cell class="font-mono font-bold text-foreground">
									{s.plate_number}
								</Table.Cell>
								<Table.Cell class="text-muted-foreground">
									Cabang #{s.branch_id}
								</Table.Cell>
								<Table.Cell class="text-muted-foreground text-xs">
									{s.duration_minutes ? `${s.duration_minutes} Menit` : "Sedang Parkir"}
								</Table.Cell>
								<Table.Cell class="text-right pr-6">
									<Badge
										variant={s.status?.toUpperCase() === "ACTIVE" ? "default" : "secondary"}
										class="text-xs uppercase"
									>
										{s.status}
									</Badge>
								</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={5} class="text-center py-8 text-muted-foreground">
								Belum ada riwayat aktivitas parkir tercatat.
							</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>

		<Card.Footer class="pt-3 border-t">
			<Button
				variant="outline"
				size="sm"
				href="/parking/parking_session"
				class="rounded-xl text-xs flex items-center gap-1.5"
			>
				Lihat Seluruh Riwayat Parkir
				<ExternalLinkIcon class="size-3.5" />
			</Button>
		</Card.Footer>
	</Card.Root>
</div>

<!-- DIALOG: PERPANJANG PAKET (RENEW SUBSCRIPTION) -->
<Dialog.Root bind:open={renewDialogOpen}>
	<Dialog.Content class="sm:max-w-md rounded-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold">Perpanjang Paket Membership</Dialog.Title>
			<Dialog.Description class="text-sm text-muted-foreground">
				Pilih metode pembayaran untuk memperpanjang durasi akses parkir 30 hari ke depan.
			</Dialog.Description>
		</Dialog.Header>

		{#if membership}
			<div class="my-4 p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">Paket</span>
					<span class="font-bold text-foreground">{membership.planName}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Masa Aktif Baru</span>
					<span class="font-medium text-foreground">+30 Hari dari tanggal berakhir</span>
				</div>
				<Separator class="my-1" />
				<div class="flex justify-between items-baseline">
					<span class="text-muted-foreground font-semibold">Total Biaya</span>
					<span class="text-xl font-black text-foreground">Rp {formatRupiah(membership.price)}</span>
				</div>
			</div>

			<form
				method="POST"
				action="?/renew"
				use:enhance={() => {
					isRenewing = true;
					return async ({ update }) => {
						isRenewing = false;
						await update();
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="membershipId" value={membership.membershipId} />
				<input type="hidden" name="paymentMethod" value={selectedPaymentMethod} />

				<Dialog.Footer class="mt-6 flex-col sm:flex-row gap-2">
					<Button
						type="button"
						variant="outline"
						class="rounded-xl"
						onclick={() => (renewDialogOpen = false)}
						disabled={isRenewing}
					>
						Batal
					</Button>
					<Button
						type="submit"
						variant="default"
						class="rounded-xl font-semibold flex-1"
						disabled={isRenewing}
					>
						{#if isRenewing}
							<Loader2Icon class="size-4 animate-spin mr-2" />
							Menyiapkan Midtrans...
						{:else}
							Bayar dengan Midtrans Snap
							<ArrowRightIcon class="size-4 ml-1.5" />
						{/if}
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<!-- DIALOG: TAMBAH KENDARAAN -->
<Dialog.Root bind:open={addVehicleOpen}>
	<Dialog.Content class="sm:max-w-md rounded-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold">Tambah Kendaraan Baru</Dialog.Title>
			<Dialog.Description class="text-sm text-muted-foreground">
				Daftarkan plat kendaraan yang akan digunakan untuk tapping atau deteksi kamera LPR gerbang.
			</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			action="?/registerVehicle"
			use:enhance={() => {
				isAddingVehicle = true;
				return async ({ update }) => {
					isAddingVehicle = false;
					await update();
				};
			}}
			class="space-y-4 py-2"
		>
			<input
				type="hidden"
				name="contractId"
				value={membership?.membershipId || (vehicles[0]?.contractId ?? "1")}
			/>

			<div class="space-y-2">
				<Label for="new-plate" class="text-sm font-semibold">
					Plat Nomor Kendaraan <span class="text-destructive">*</span>
				</Label>
				<Input
					id="new-plate"
					name="licensePlate"
					bind:value={newPlate}
					placeholder="Contoh: B 1234 ABC"
					class="rounded-xl font-mono uppercase font-bold text-base"
					required
					maxlength={12}
				/>
			</div>

			<div class="space-y-2">
				<Label for="new-model" class="text-sm font-semibold">
					Model Kendaraan (Opsional)
				</Label>
				<Input
					id="new-model"
					name="vehicleModel"
					bind:value={newModel}
					placeholder="Contoh: Toyota Yaris, Honda HR-V"
					class="rounded-xl"
				/>
			</div>

			<div class="space-y-2">
				<Label for="new-type" class="text-sm font-semibold">Jenis Kendaraan</Label>
				<select
					id="new-type"
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
					onclick={() => (addVehicleOpen = false)}
					disabled={isAddingVehicle}
				>
					Batal
				</Button>
				<Button
					type="submit"
					variant="default"
					class="rounded-xl font-semibold flex-1"
					disabled={isAddingVehicle || !newPlate.trim()}
				>
					{#if isAddingVehicle}
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
<Dialog.Root bind:open={editVehicleOpen}>
	<Dialog.Content class="sm:max-w-md rounded-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold">Edit Data Kendaraan</Dialog.Title>
			<Dialog.Description class="text-sm text-muted-foreground">
				Perbarui plat nomor atau model kendaraan terdaftar.
			</Dialog.Description>
		</Dialog.Header>

		{#if editVehicleItem}
			<form
				method="POST"
				action="?/updateVehicle"
				use:enhance={() => {
					isEditingVehicle = true;
					return async ({ update }) => {
						isEditingVehicle = false;
						await update();
					};
				}}
				class="space-y-4 py-2"
			>
				<input type="hidden" name="contractId" value={editVehicleItem.contractId} />
				<input type="hidden" name="vehicleId" value={editVehicleItem.id} />

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
					<Label for="edit-model" class="text-sm font-semibold">
						Model Kendaraan
					</Label>
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
						onclick={() => (editVehicleOpen = false)}
						disabled={isEditingVehicle}
					>
						Batal
					</Button>
					<Button
						type="submit"
						variant="default"
						class="rounded-xl font-semibold flex-1"
						disabled={isEditingVehicle || !editPlate.trim()}
					>
						{#if isEditingVehicle}
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
