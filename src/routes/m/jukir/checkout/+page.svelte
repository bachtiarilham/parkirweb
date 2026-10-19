<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { Html5Qrcode } from 'html5-qrcode';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import SearchIcon from '@lucide/svelte/icons/search';
	import PrinterIcon from '@lucide/svelte/icons/printer';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import BanknoteIcon from '@lucide/svelte/icons/banknote';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CarIcon from '@lucide/svelte/icons/car';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import { formatCurrency } from '$lib/utils/format-currency';

	let { data, form } = $props();

	let html5QrCode: Html5Qrcode | null = null;
	let isScannerActive = $state(false);
	let scannerError = $state<string | null>(null);

	let searchQuery = $state('');
	let currentSession = $state<any>(null);
	let paymentMethod = $state<'CASH' | 'QRIS'>('CASH');
	let isSubmitting = $state(false);

	$effect(() => {
		if (data.ticketParam && !searchQuery) searchQuery = data.ticketParam;
		if (data.selectedSession && !currentSession) currentSession = data.selectedSession;
	});

	let calculatedAmount = $derived.by(() => {
		if (!currentSession) return 0;
		if (currentSession.amount && Number(currentSession.amount) > 0) {
			return Number(currentSession.amount);
		}
		const checkIn = new Date(currentSession.check_in_time).getTime();
		const now = Date.now();
		const hours = Math.max(1, Math.ceil((now - checkIn) / (1000 * 60 * 60)));
		const isMotor = (currentSession.vehicle_type || '').toUpperCase().includes('MOTOR');
		const hourlyRate = isMotor ? 2000 : 5000;
		return hours * hourlyRate;
	});

	let durationString = $derived.by(() => {
		if (!currentSession) return '-';
		try {
			const checkIn = new Date(currentSession.check_in_time).getTime();
			const now = Date.now();
			const diffMinutes = Math.max(0, Math.floor((now - checkIn) / 60000));
			const hours = Math.floor(diffMinutes / 60);
			const mins = diffMinutes % 60;
			return `${hours} jam ${mins} menit`;
		} catch {
			return '-';
		}
	});

	function selectSession(session: any) {
		currentSession = session;
		searchQuery = session.code || session.plate_number;
		stopScanner();
	}

	async function startScanner() {
		scannerError = null;
		try {
			const qrCodeRegionId = 'qr-reader';
			html5QrCode = new Html5Qrcode(qrCodeRegionId);
			await html5QrCode.start(
				{ facingMode: 'environment' },
				{
					fps: 10,
					qrbox: { width: 220, height: 220 }
				},
				(decodedText) => {
					onQrScanned(decodedText);
				},
				() => {}
			);
			isScannerActive = true;
		} catch (err: any) {
			console.warn('QR scanner failed:', err);
			scannerError = 'Kamera tidak aktif. Anda dapat mencari manual berdasarkan plat nomor.';
			isScannerActive = false;
		}
	}

	async function stopScanner() {
		if (html5QrCode && isScannerActive) {
			try {
				await html5QrCode.stop();
				html5QrCode.clear();
			} catch (e) {
				console.error('Error stopping scanner:', e);
			}
			isScannerActive = false;
		}
	}

	function onQrScanned(text: string) {
		stopScanner();
		const match = (data.activeSessions || []).find(
			(s) =>
				(s.code && s.code.toLowerCase() === text.toLowerCase()) ||
				String(s.id) === text ||
				(s.plate_number && s.plate_number.toLowerCase() === text.toLowerCase())
		);
		if (match) {
			currentSession = match;
		} else {
			searchQuery = text;
		}
	}

	function handlePrint() {
		window.print();
	}

	async function handleShare() {
		if (navigator.share && currentSession) {
			try {
				await navigator.share({
					title: `Struk Parkir LineSpot - ${currentSession.plate_number}`,
					text: `Tiket Parkir: ${currentSession.code}\nPlat: ${currentSession.plate_number}\nTotal: ${formatCurrency(calculatedAmount)}\nStatus: Lunas`,
					url: window.location.href
				});
			} catch {}
		} else {
			window.print();
		}
	}

	onMount(() => {
		if (!currentSession) {
			startScanner();
		}
	});

	onDestroy(() => {
		stopScanner();
	});
</script>

<div class="space-y-4">
	<!-- Top Bar -->
	<div class="flex items-center justify-between">
		<a href="/m/jukir" class="inline-flex items-center text-xs font-bold text-[#0077B6] hover:text-[#03045E]">
			<ArrowLeftIcon class="w-4 h-4 mr-1" /> Kembali ke Shift
		</a>
		<h1 class="text-xs font-black text-[#03045E] uppercase tracking-wider">Check-Out & Pembayaran</h1>
		<div class="w-8"></div>
	</div>

	{#if form?.success}
		<!-- Receipt / Success Screen (Cobalt Liquid Glass Struk) -->
		<LiquidGlassCard variant="cobalt" class="p-6 text-center space-y-4">
			<div class="w-16 h-16 rounded-full bg-white/20 border-2 border-white/60 text-white mx-auto flex items-center justify-center shadow-lg">
				<CheckCircleIcon class="w-10 h-10" />
			</div>

			<div>
				<h2 class="text-xl font-black text-white">Pembayaran Sukses!</h2>
				<p class="text-xs text-[#CAF0F8] mt-0.5">Sesi parkir kendaraan telah ditutup</p>
			</div>

			<!-- Digital Receipt Card -->
			<div class="bg-black/20 rounded-2xl p-4 border border-white/25 font-mono text-left space-y-2 text-xs text-white">
				<div class="flex justify-between border-b border-white/20 pb-2">
					<span class="text-[#ADE8F4]">NO. TIKET</span>
					<span class="font-bold">{form.session?.code || currentSession?.code}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-[#ADE8F4]">PLAT NOMOR</span>
					<span class="font-bold">{form.session?.plate_number || currentSession?.plate_number}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-[#ADE8F4]">DURASI</span>
					<span class="font-bold">{durationString}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-[#ADE8F4]">METODE</span>
					<span class="font-bold text-[#90E0EF]">{form.paymentMethod || 'TUNAI'}</span>
				</div>
				<div class="flex justify-between border-t border-white/20 pt-2 text-sm">
					<span class="font-bold text-[#ADE8F4]">TOTAL BIAYA</span>
					<span class="font-black text-white">{formatCurrency(calculatedAmount)}</span>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2 pt-2">
				<button
					type="button"
					onclick={handlePrint}
					class="py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-white/30"
				>
					<PrinterIcon class="w-4 h-4" />
					<span>Cetak Struk</span>
				</button>

				<button
					type="button"
					onclick={handleShare}
					class="py-2.5 rounded-xl bg-white text-[#03045E] font-black text-xs flex items-center justify-center gap-1.5 transition shadow-md active:scale-95"
				>
					<Share2Icon class="w-4 h-4" />
					<span>Kirim Struk</span>
				</button>
			</div>

			<a
				href="/m/jukir"
				class="block w-full py-2.5 rounded-xl bg-black/20 text-white font-bold text-xs transition text-center"
			>
				Kembali ke Dashboard
			</a>
		</LiquidGlassCard>
	{:else}
		{#if !currentSession}
			<!-- QR Scanner Card -->
			<div class="space-y-3">
				<LiquidGlassCard variant="light" class="p-3 overflow-hidden">
					<div class="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center shadow-inner">
						<div id="qr-reader" class="w-full h-full"></div>
						{#if !isScannerActive}
							<div class="text-center p-4">
								<QrCodeIcon class="w-10 h-10 text-white/50 mx-auto mb-2" />
								<div class="text-xs text-white/70">{scannerError || 'Menyiapkan pemindai QR...'}</div>
								<button
									type="button"
									onclick={startScanner}
									class="mt-3 px-3.5 py-1.5 rounded-xl bg-[#0077B6] text-white text-xs font-bold"
								>
									Aktifkan Kamera
								</button>
							</div>
						{/if}
					</div>
				</LiquidGlassCard>

				<!-- Manual Search -->
				<div class="relative">
					<SearchIcon class="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Ketik plat nomor atau kode tiket..."
						class="w-full bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[#03045E] placeholder-[#64748B] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
					/>
				</div>

				{#if searchQuery.trim()}
					<div class="space-y-1.5">
						{#each (data.activeSessions || []).filter(s => (s.plate_number || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.code || '').toLowerCase().includes(searchQuery.toLowerCase())) as match}
							<LiquidGlassCard variant="light" class="p-3">
								<button
									type="button"
									onclick={() => selectSession(match)}
									class="w-full flex items-center justify-between text-left"
								>
									<div class="flex items-center gap-2.5">
										{#if (match.vehicle_type || '').toUpperCase().includes('MOTOR')}
											<BikeIcon class="w-4 h-4 text-[#0077B6]" />
										{:else}
											<CarIcon class="w-4 h-4 text-[#023E8A]" />
										{/if}
										<span class="font-mono font-black text-xs text-[#03045E]">{match.plate_number}</span>
									</div>
									<span class="text-[10px] text-[#0077B6] font-mono font-black">{match.code}</span>
								</button>
							</LiquidGlassCard>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<!-- Session Detail & Settlement -->
			<LiquidGlassCard variant="light" class="p-5 space-y-4">
				<div class="flex items-center justify-between border-b border-black/5 pb-3">
					<div>
						<span class="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">KENDARAAN KELUAR</span>
						<div class="text-xl font-mono font-black text-[#03045E] tracking-wider">
							{currentSession.plate_number}
						</div>
					</div>
					<button
						type="button"
						onclick={() => (currentSession = null)}
						class="text-xs font-bold text-[#0077B6] hover:underline"
					>
						Ganti
					</button>
				</div>

				<div class="grid grid-cols-2 gap-3 text-xs">
					<div class="bg-white/80 rounded-2xl p-3 border border-white shadow-sm">
						<span class="text-[10px] text-[#64748B] block mb-1">Durasi Parkir</span>
						<div class="font-black flex items-center gap-1 text-[#03045E]">
							<ClockIcon class="w-3.5 h-3.5 text-[#0077B6]" />
							<span>{durationString}</span>
						</div>
					</div>

					<div class="bg-white/80 rounded-2xl p-3 border border-white shadow-sm">
						<span class="text-[10px] text-[#64748B] block mb-1">Tipe Kendaraan</span>
						<div class="font-black uppercase text-[#03045E]">
							{currentSession.vehicle_type}
						</div>
					</div>
				</div>

				<!-- Total Tariff Card -->
				<LiquidGlassCard variant="ocean" class="p-4 flex items-center justify-between">
					<div>
						<span class="text-xs text-[#CAF0F8] font-semibold">Total Tagihan</span>
						<div class="text-2xl font-black text-white tracking-tight">
							{formatCurrency(calculatedAmount)}
						</div>
					</div>
				</LiquidGlassCard>

				<!-- Payment Method Selector -->
				<div>
					<span class="block text-xs font-bold text-[#03045E] mb-2">
						Pilih Metode Pembayaran
					</span>
					<div class="grid grid-cols-2 gap-2">
						<button
							type="button"
							onclick={() => (paymentMethod = 'CASH')}
							class="py-3 px-3 rounded-2xl border transition flex items-center justify-center gap-2 {paymentMethod === 'CASH' ? 'bg-[#0077B6] text-white border-[#0077B6] font-bold shadow-md shadow-sky-600/25' : 'bg-white/80 border-white text-[#64748B]'}"
						>
							<BanknoteIcon class="w-4 h-4" />
							<span class="text-xs">Uang Tunai</span>
						</button>

						<button
							type="button"
							onclick={() => (paymentMethod = 'QRIS')}
							class="py-3 px-3 rounded-2xl border transition flex items-center justify-center gap-2 {paymentMethod === 'QRIS' ? 'bg-[#0077B6] text-white border-[#0077B6] font-bold shadow-md shadow-sky-600/25' : 'bg-white/80 border-white text-[#64748B]'}"
						>
							<CreditCardIcon class="w-4 h-4" />
							<span class="text-xs">QRIS / Digital</span>
						</button>
					</div>
				</div>

				<!-- Confirm Form -->
				<form
					action="?/checkout"
					method="POST"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							update();
						};
					}}
				>
					<input type="hidden" name="sessionId" value={currentSession.id} />
					<input type="hidden" name="amount" value={calculatedAmount} />
					<input type="hidden" name="paymentMethod" value={paymentMethod} />

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B4D8] text-white font-black text-sm tracking-wide shadow-lg shadow-[#0077B6]/30 flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50"
					>
						{#if isSubmitting}
							<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
							<span>Menyelesaikan...</span>
						{:else}
							<span>Selesaikan Transaksi ({formatCurrency(calculatedAmount)})</span>
						{/if}
					</button>
				</form>
			</LiquidGlassCard>
		{/if}
	{/if}
</div>
