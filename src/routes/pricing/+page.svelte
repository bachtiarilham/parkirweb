<script lang="ts">
	import Header from "$lib/components/landing/header.svelte";
	import Footer from "$lib/components/landing/footer.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import CarIcon from "@lucide/svelte/icons/car";
	import BikeIcon from "@lucide/svelte/icons/bike";
	import SmartphoneNfcIcon from "@lucide/svelte/icons/smartphone-nfc";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import { API_ENDPOINTS } from "$lib/api/endpoints.js";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import LogInIcon from "@lucide/svelte/icons/log-in";
	import UserPlusIcon from "@lucide/svelte/icons/user-plus";
	import LockIcon from "@lucide/svelte/icons/lock";
	import { toast } from "svelte-sonner";

	let { data } = $props();
	const plans = $derived(data.plans || []);
	const isLoggedIn = $derived(Boolean(data.isLoggedIn));
	const user = $derived(data.user);

	// State modal login alert (jika belum login)
	let isLoginAlertOpen = $state(false);
	let pendingPlan = $state<any>(null);

	// State modal checkout
	let isModalOpen = $state(false);
	let selectedPlan = $state<any>(null);

	// Form inputs
	let primaryPlate = $state("");
	let secondaryPlate = $state("");
	let showSecondaryPlate = $state(false);
	let rfidCardNo = $state("");

	// NFC State
	let isScanningNfc = $state(false);
	let nfcMessage = $state("");
	let isNfcSupported = $state(false);

	// Loading state checkout
	let isSubmitting = $state(false);

	// Periksa dukungan Web NFC di client saat browser mount
	$effect(() => {
		if (typeof window !== "undefined") {
			isNfcSupported = "NDEFReader" in window;
		}
	});

	function formatRupiah(amount: string | number): string {
		const num = typeof amount === "string" ? parseInt(amount, 10) : amount;
		if (isNaN(num)) return "0";
		return new Intl.NumberFormat("id-ID").format(num);
	}

	function handleSelectPlan(plan: any) {
		if (!isLoggedIn) {
			pendingPlan = plan;
			isLoginAlertOpen = true;
			return;
		}

		openCheckout(plan);
	}

	function openCheckout(plan: any) {
		selectedPlan = plan;
		primaryPlate = "";
		secondaryPlate = "";
		showSecondaryPlate = false;
		rfidCardNo = "";
		nfcMessage = "";
		isScanningNfc = false;
		isModalOpen = true;
	}

	async function handleScanNFC() {
		if (typeof window === "undefined" || !("NDEFReader" in window)) {
			toast.error("Web NFC tidak didukung di browser ini. Gunakan Google Chrome / Edge di HP Android.");
			return;
		}

		try {
			isScanningNfc = true;
			nfcMessage = "Dekatkan kartu E-Money / Flazz ke bagian belakang ponsel...";

			const ndef = new window.NDEFReader();
			await ndef.scan();

			ndef.onreading = (event: any) => {
				const serial = event.serialNumber || "";
				if (serial) {
					rfidCardNo = serial;
					nfcMessage = `Kartu terdeteksi: ${serial}`;
					toast.success(`Berhasil memindai kartu: ${serial}`);
				} else {
					nfcMessage = "Kartu terbaca namun serial number tidak terdeteksi.";
				}
				isScanningNfc = false;
			};

			ndef.onreadingerror = () => {
				nfcMessage = "Gagal membaca sinyal kartu. Pastikan kartu menempel stabil.";
				toast.error("Gagal membaca kartu NFC.");
				isScanningNfc = false;
			};
		} catch (err: any) {
			isScanningNfc = false;
			nfcMessage = err?.message || "Izin NFC ditolak atau NFC dinonaktifkan di pengaturan perangkat.";
			toast.error(nfcMessage);
		}
	}

	async function handleCheckout() {
		if (!selectedPlan) return;

		const cleanPrimary = primaryPlate.trim().toUpperCase();
		const cleanSecondary = secondaryPlate.trim().toUpperCase();

		if (!cleanPrimary) {
			toast.error("Nomor plat kendaraan utama wajib diisi!");
			return;
		}

		// Gabungkan plat nomor jika ada plat kedua
		const combinedPlates = cleanSecondary
			? `${cleanPrimary}, ${cleanSecondary}`
			: cleanPrimary;

		isSubmitting = true;

		try {
			const res = await fetch(API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.BASE, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plan_id: selectedPlan.member_rider_plan_id,
					license_plates: combinedPlates,
					rfid_card_no: rfidCardNo.trim() ? rfidCardNo.trim() : null,
				}),
			});

			const result = await res.json();

			if (!res.ok || !result.success) {
				throw new Error(result.message || "Gagal memproses pendaftaran");
			}

			const { snap_token, snap_redirect_url, tx_code } = result.data || {};

			toast.success(`Transaksi ${tx_code || ""} siap dibayar`);

			// Buka Midtrans Snap Popup
			if (typeof window !== "undefined" && window.snap && snap_token) {
				window.snap.pay(snap_token, {
					onSuccess: function (midtransResult: any) {
						toast.success("Pembayaran berhasil! Akses keanggotaan Anda telah aktif.");
						isModalOpen = false;
					},
					onPending: function (midtransResult: any) {
						toast.info("Menunggu pembayaran Anda diselesaikan.");
					},
					onError: function (midtransResult: any) {
						toast.error("Pembayaran dibatalkan atau terjadi kesalahan.");
					},
					onClose: function () {
						toast.warning("Anda menutup jendela pembayaran sebelum selesai.");
					},
				});
			} else if (snap_redirect_url) {
				// Fallback jika snap popup tidak terbuka
				window.open(snap_redirect_url, "_blank");
				isModalOpen = false;
			} else {
				toast.success("Pendaftaran berhasil diproses!");
				isModalOpen = false;
			}
		} catch (error: any) {
			console.error("[Checkout Error]:", error);
			toast.error(error.message || "Gagal menghubungkan ke sistem pembayaran.");
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Pricing & Paket Langganan – Web Parkir</title>
	<meta
		name="description"
		content="Pilihan paket langganan parkir bulanan mobil dan motor dengan akses barrier otomatis 24/7 dan fast lane LPR."
	/>
	<!-- Midtrans Snap Script (Sandbox) -->
	<script
		src="https://app.sandbox.midtrans.com/snap/snap.js"
		data-client-key="SB-Mid-client-sample"
	></script>
</svelte:head>

<div class="flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
	<Header {isLoggedIn} {user} />

	<main class="grow">
		<!-- Info Banner untuk Tamu / Public User -->
		{#if !isLoggedIn}
			<div class="bg-primary/5 border-b border-primary/20 px-4 py-2.5">
				<div class="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-foreground">
					<div class="flex items-center gap-2 text-center sm:text-left">
						<LockIcon class="size-4 text-primary shrink-0" />
						<span>
							Halaman paket langganan ini terbuka untuk umum. Anda dapat melihat seluruh fasilitas, namun <strong>perlu masuk atau membuat akun</strong> saat ingin melakukan pembelian.
						</span>
					</div>
					<div class="flex items-center gap-2 shrink-0">
						<Button href="/login?redirectTo=/pricing" variant="ghost" size="sm" class="h-7 text-xs font-semibold px-2 hover:bg-primary/10">
							Masuk
						</Button>
						<Button href="/register?redirectTo=/pricing" variant="default" size="sm" class="h-7 text-xs font-semibold px-2.5">
							Daftar Gratis
						</Button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Pricing Header Ala ChatGPT -->
		<section class="pt-16 pb-12 px-4 text-center">
			<div class="mx-auto max-w-3xl space-y-4">
				<Badge variant="secondary" class="rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider">
					Rider Membership Plans
				</Badge>
				<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
					Upgrade Paket Parkir Anda
				</h1>
				<p class="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
					Bebas antre tiket setiap hari. Nikmati verifikasi plat nomor otomatis (LPR), akses 24/7 tanpa batas keluar masuk, serta layanan bantuan darurat di area parkir.
				</p>
			</div>
		</section>

		<!-- Pricing Cards Grid Ala ChatGPT Pricing Menggunakan Shadcn Card -->
		<section class="pb-24 px-4">
			<div class="container mx-auto max-w-5xl">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
					{#each plans as plan (plan.member_rider_plan_id)}
						{@const isCar = plan.member_rider_plan_code?.includes("CAR") || plan.member_rider_plan_name?.toLowerCase().includes("mobil")}
						<Card.Root
							class="relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 transition-all duration-200 hover:shadow-xl {isCar ? 'border-primary ring-1 ring-primary/20 shadow-md' : 'border-border/80'}"
						>
							<!-- Card Header & Description -->
							<Card.Header class="p-0 pb-4">
								<div class="flex items-center justify-between gap-3 mb-3">
									<div class="p-2.5 rounded-2xl {isCar ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground'}">
										{#if isCar}
											<CarIcon class="size-6" />
										{:else}
											<BikeIcon class="size-6" />
										{/if}
									</div>
									{#if isCar}
										<Badge class="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs shadow-xs rounded-full">
											<SparklesIcon class="size-3.5 mr-1" />
											Paling Populer
										</Badge>
									{/if}
								</div>
								<div>
									<Card.Title class="text-2xl font-bold tracking-tight text-foreground">
										{plan.member_rider_plan_name}
									</Card.Title>
									<span class="text-xs text-muted-foreground font-mono">
										{plan.member_rider_plan_code}
									</span>
								</div>

								<Card.Description class="text-sm text-muted-foreground min-h-[40px] leading-relaxed">
									{#if isCar}
										Solusi komprehensif pengendara mobil dengan akses fast-lane kamera LPR dan slot terdedikasi.
									{:else}
										Langganan hemat pengendara motor dengan tap gerbang cepat dan akses fleksibel 24/7.
									{/if}
								</Card.Description>
							</Card.Header>

							<!-- Card Content: Price, Button, & Features -->
							<Card.Content class="p-0 space-y-6">
								<!-- Price Display -->
								<div class="flex items-baseline gap-1.5">
									<span class="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
										Rp {formatRupiah(plan.member_rider_plan_price)}
									</span>
									<span class="text-sm font-medium text-muted-foreground">
										/ {plan.duration_days || 30} hari
									</span>
								</div>

								<!-- CTA Button Ala ChatGPT -->
								<div class="space-y-2">
									<Button
										variant={isCar ? "default" : "outline"}
										size="lg"
										onclick={() => handleSelectPlan(plan)}
										class="w-full rounded-2xl py-6 font-semibold text-base transition-all duration-200 {isCar ? 'shadow-sm' : 'hover:bg-primary hover:text-primary-foreground'}"
									>
										{#if isLoggedIn}
											Pilih {plan.member_rider_plan_name}
										{:else}
											<LockIcon class="size-4 mr-1.5 opacity-70" />
											Masuk untuk Berlangganan
										{/if}
										<ArrowRightIcon class="ml-2 size-4" />
									</Button>
									{#if !isLoggedIn}
										<p class="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
											<span>Wajib memiliki akun untuk mendaftarkan plat nomor & pembayaran</span>
										</p>
									{/if}
								</div>

								<Separator />

								<!-- Features Checklist -->
								<div class="space-y-4">
									<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Fasilitas Termasuk:
									</p>
									<ul class="space-y-3 text-sm">
										<li class="flex items-start gap-3 text-foreground">
											<div class="mt-0.5 rounded-full p-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
												<CheckIcon class="size-3.5" />
											</div>
											<span>
												Akses <strong>24/7 Tanpa Batas</strong> keluar-masuk
											</span>
										</li>
										<li class="flex items-start gap-3 text-foreground">
											<div class="mt-0.5 rounded-full p-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
												<CheckIcon class="size-3.5" />
											</div>
											<span>
												Daftarkan hingga <strong>{plan.rule?.max_registered_vehicles || 2} Plat Kendaraan</strong> ({plan.vehicle_limit || 1} aktif bersamaan)
											</span>
										</li>
										<li class="flex items-start gap-3 text-foreground">
											<div class="mt-0.5 rounded-full p-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
												<CheckIcon class="size-3.5" />
											</div>
											<span>
												Sistem <strong>Anti-Passback Strict</strong> & buka palang instan
											</span>
										</li>

										<!-- Fitur Dinamis dari Database -->
										{#if Array.isArray(plan.features) && plan.features.length > 0}
											{#each plan.features as feat, idx (feat.id ?? idx)}
												<li class="flex items-start gap-3 text-foreground">
													<div class="mt-0.5 rounded-full p-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
														<CheckIcon class="size-3.5" />
													</div>
													<span class="flex-1">
														{feat.feature_name}
														{#if feat.is_highlighted}
															<Badge variant="secondary" class="ml-1.5 text-[10px] px-1.5 py-0">
																VIP
															</Badge>
														{/if}
													</span>
												</li>
											{/each}
										{/if}
									</ul>
								</div>
							</Card.Content>

							<!-- Card Footer Detail -->
							<Card.Footer class="p-0 mt-8 pt-4 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between">
								<span>Template: {plan.rule?.template_code || "ALLDAY-247"}</span>
								<span class="flex items-center gap-1">
									<ShieldCheckIcon class="size-3.5 text-emerald-600" />
									Garansi Aktif Instan
								</span>
							</Card.Footer>
						</Card.Root>
					{/each}
				</div>
			</div>
		</section>
	</main>

	<!-- Dialog Modal Checkout & Web NFC Menggunakan Shadcn Dialog & Form Components -->
	<Dialog.Root bind:open={isModalOpen}>
		<Dialog.Content class="sm:max-w-lg rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
			<Dialog.Header class="space-y-2">
				<Dialog.Title class="text-2xl font-bold tracking-tight">
					Pendaftaran {selectedPlan?.member_rider_plan_name}
				</Dialog.Title>
				<Dialog.Description class="text-sm text-muted-foreground">
					Lengkapi data plat nomor kendaraan dan kartu E-Money untuk mengaktifkan palang barrier otomatis.
				</Dialog.Description>
			</Dialog.Header>

			<!-- Summary Box Menggunakan Shadcn Card -->
			{#if selectedPlan}
				<Card.Root size="sm" class="my-4 bg-secondary/70 border-border/50">
					<Card.Content class="p-4 flex items-center justify-between">
						<div>
							<p class="font-semibold text-foreground">{selectedPlan.member_rider_plan_name}</p>
							<p class="text-xs text-muted-foreground">Durasi: {selectedPlan.duration_days || 30} Hari (24/7 All-Day)</p>
						</div>
						<div class="text-right">
							<span class="text-xl font-black text-foreground">
								Rp {formatRupiah(selectedPlan.member_rider_plan_price)}
							</span>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}

			<div class="space-y-5 py-2">
				<!-- 1. Input Plat Nomor -->
				<div class="space-y-3">
					<Label for="primary-plate" class="text-sm font-semibold flex items-center justify-between">
						<span>Plat Nomor Kendaraan Utama <span class="text-destructive">*</span></span>
						<span class="text-xs text-muted-foreground font-normal">Wajib diisi</span>
					</Label>
					<Input
						id="primary-plate"
						bind:value={primaryPlate}
						placeholder="Contoh: B 1234 ABC"
						class="rounded-xl uppercase font-mono font-bold tracking-wider text-base"
						maxlength={12}
					/>

					<!-- Input Plat Cadangan (Jika kuota max_registered_vehicles >= 2) -->
					{#if (selectedPlan?.rule?.max_registered_vehicles || 2) > 1}
						{#if showSecondaryPlate}
							<div class="space-y-1.5 pt-2">
								<div class="flex items-center justify-between">
									<Label for="secondary-plate" class="text-xs font-semibold text-muted-foreground">
										Plat Kendaraan Cadangan Ke-2 (Opsional)
									</Label>
									<Button
										variant="ghost"
										size="icon"
										class="size-6 text-muted-foreground hover:text-destructive"
										onclick={() => {
											secondaryPlate = "";
											showSecondaryPlate = false;
										}}
									>
										<Trash2Icon class="size-3.5" />
									</Button>
								</div>
								<Input
									id="secondary-plate"
									bind:value={secondaryPlate}
									placeholder="Contoh: D 5678 XYZ"
									class="rounded-xl uppercase font-mono font-bold tracking-wider text-base"
									maxlength={12}
								/>
							</div>
						{:else}
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onclick={() => (showSecondaryPlate = true)}
								class="text-xs text-primary flex items-center gap-1.5 p-0 h-auto font-medium hover:underline"
							>
								<PlusIcon class="size-3.5" />
								Tambah Plat Kendaraan Ke-2 (Maksimal 2 Plat)
							</Button>
						{/if}
					{/if}
				</div>

				<Separator />

				<!-- 2. Input Kartu E-Money / Web NFC -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<Label for="rfid-card" class="text-sm font-semibold flex items-center gap-1.5">
							<CreditCardIcon class="size-4" />
							<span>Nomor Kartu E-Money / RFID</span>
						</Label>
						<Badge variant="outline" class="text-[10px] uppercase font-normal">
							Opsional
						</Badge>
					</div>

					<div class="flex gap-2">
						<Input
							id="rfid-card"
							bind:value={rfidCardNo}
							placeholder="Scan NFC atau ketik serial kartu..."
							class="rounded-xl font-mono text-sm"
						/>
						<Button
							type="button"
							variant="secondary"
							onclick={handleScanNFC}
							disabled={isScanningNfc}
							class="rounded-xl flex items-center gap-1.5 shrink-0 px-4"
							title="Scan kartu E-Money lewat NFC HP"
						>
							{#if isScanningNfc}
								<Loader2Icon class="size-4 animate-spin text-primary" />
								<span class="text-xs font-semibold">Membaca...</span>
							{:else}
								<SmartphoneNfcIcon class="size-4 text-primary" />
								<span class="text-xs font-semibold">Scan NFC</span>
							{/if}
						</Button>
					</div>

					{#if nfcMessage}
						<p class="text-xs text-primary font-medium flex items-center gap-1 animate-pulse">
							<SmartphoneNfcIcon class="size-3" />
							{nfcMessage}
						</p>
					{/if}

					<!-- Warning & Peringatan E-Money Opsional Sesuai Request User -->
					<div class="rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-1">
						<div class="flex items-center gap-2 font-semibold text-xs">
							<AlertCircleIcon class="size-4 text-amber-600 shrink-0" />
							<span>Peringatan & Catatan E-Money (Opsional)</span>
						</div>
						<p class="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed pl-6">
							Kolom nomor kartu E-Money <strong>tidak wajib diisi</strong> saat ini. Jika Anda belum memiliki kartu atau browser tidak mendukung NFC, Anda tetap dapat menyelesaikan pendaftaran. Palang gerbang akan otomatis terbuka mendeteksi plat nomor kendaraan (LPR) Anda.
						</p>
					</div>
				</div>
			</div>

			<Dialog.Footer class="mt-6 flex-col sm:flex-row gap-3">
				<Button
					type="button"
					variant="outline"
					class="rounded-xl"
					onclick={() => (isModalOpen = false)}
					disabled={isSubmitting}
				>
					Batal
				</Button>
				<Button
					type="button"
					variant="default"
					class="rounded-xl font-semibold flex-1"
					onclick={handleCheckout}
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<Loader2Icon class="size-4 mr-2 animate-spin" />
						Menyiapkan Pembayaran...
					{:else}
						Lanjut ke Pembayaran Midtrans
						<ArrowRightIcon class="ml-2 size-4" />
					{/if}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Shadcn AlertDialog: Konfirmasi Login Sebelum Pembelian -->
	<AlertDialog.Root bind:open={isLoginAlertOpen}>
		<AlertDialog.Content class="sm:max-w-md rounded-3xl p-6 sm:p-8">
			<AlertDialog.Header class="space-y-3 text-left">
				<div class="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
					<LogInIcon class="size-6" />
				</div>
				<AlertDialog.Title class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
					Masuk untuk Berlangganan
				</AlertDialog.Title>
				<AlertDialog.Description class="text-sm text-muted-foreground leading-relaxed">
					Untuk membeli paket <strong>{pendingPlan?.member_rider_plan_name || "Membership"}</strong>, Anda perlu masuk ke akun Anda terlebih dahulu agar data kendaraan, kuota parkir, dan pembayaran terhubung ke profil Anda.
				</AlertDialog.Description>
			</AlertDialog.Header>

			<div class="my-4 p-3.5 rounded-2xl bg-muted/60 border border-border/60 text-xs text-muted-foreground space-y-1.5">
				<div class="flex items-center gap-2 font-medium text-foreground">
					<CheckIcon class="size-4 text-emerald-600" />
					<span>Keuntungan Memiliki Akun:</span>
				</div>
				<p class="pl-6">
					Kelola plat nomor aktif kapan saja, pantau riwayat sesi parkir 24/7, dan perpanjang paket secara otomatis tanpa antre tiket manual.
				</p>
			</div>

			<AlertDialog.Footer class="flex flex-col-reverse sm:flex-row gap-2 mt-4">
				<AlertDialog.Cancel class="rounded-xl mt-0">
					Batal
				</AlertDialog.Cancel>
				<Button
					href={`/register?redirectTo=/pricing`}
					variant="outline"
					class="rounded-xl gap-1.5"
				>
					<UserPlusIcon class="size-4" />
					Daftar Akun Baru
				</Button>
				<Button
					href={`/login?redirectTo=/pricing`}
					variant="default"
					class="rounded-xl gap-1.5 font-semibold"
				>
					<LogInIcon class="size-4" />
					Masuk (Login)
				</Button>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<Footer />
</div>
