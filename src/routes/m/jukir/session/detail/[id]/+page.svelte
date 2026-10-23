<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import InfoIcon from '@lucide/svelte/icons/info';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { formatCurrency } from '$lib/utils/format-currency';
	import PaymentResultModal from '$lib/components/m/PaymentResultModal.svelte';

	let { data } = $props();

	// 15-minute countdown timer (identik ParkSessionResultScreen.kt)
	let remainingSeconds = $state(15 * 60);
	let isCashProcessing = $state(false);
	let paymentSuccess = $state(false);
	let receiptNumber = $state(`REC-${Date.now().toString().slice(-6)}`);

	const minutes = $derived(Math.floor(remainingSeconds / 60));
	const seconds = $derived(remainingSeconds % 60);
	const timeString = $derived(
		`${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`
	);

	const maxPayTimeFormatted = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('id-ID', {
		hour: '2-digit',
		minute: '2-digit'
	}) + ' WIB';

	onMount(() => {
		const interval = setInterval(() => {
			if (remainingSeconds > 0) {
				remainingSeconds -= 1;
			}
		}, 1000);

		// Load Midtrans Snap script if not loaded
		if (data.snapToken && typeof window !== 'undefined') {
			const existingScript = document.getElementById('midtrans-snap');
			if (!existingScript) {
				const script = document.createElement('script');
				script.id = 'midtrans-snap';
				script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
				script.setAttribute('data-client-key', 'SB-Mid-client-test');
				document.body.appendChild(script);
			}
		}

		return () => clearInterval(interval);
	});

	function handlePayQris() {
		if (data.snapToken && (window as any).snap) {
			(window as any).snap.pay(data.snapToken, {
				onSuccess: function () {
					paymentSuccess = true;
				},
				onPending: function () {
					paymentSuccess = true;
				},
				onError: function () {
					alert('Pembayaran QRIS gagal');
				}
			});
		} else {
			// Mock QRIS modal if token not configured in sandbox
			alert('Membuka gerbang pembayaran QRIS Midtrans Snap...');
			setTimeout(() => {
				paymentSuccess = true;
			}, 1500);
		}
	}

	async function handlePayCash() {
		isCashProcessing = true;
		try {
			const formData = new FormData();
			formData.append('amount', String(data.amount || 2000));
			await fetch('?/payCash', {
				method: 'POST',
				body: formData
			}).catch(() => null);

			if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
				navigator.vibrate([80, 50, 80]);
			}

			paymentSuccess = true;
		} catch (e) {
			paymentSuccess = true;
		} finally {
			isCashProcessing = false;
		}
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Top Header (Identik ParkSessionResultScreen.kt) ────────── -->
	<div class="flex items-center justify-between pt-1">
		<button
			onclick={() => goto('/m/jukir')}
			class="flex items-center text-[#0077B6] font-bold text-sm active:scale-95 transition"
		>
			<ChevronLeftIcon class="w-6 h-6 -ml-1 text-[#0077B6]" />
			<span>Back</span>
		</button>

		<h1 class="text-base font-bold text-[#03045E]">
			Pembayaran
		</h1>

		<button class="text-[#03045E] p-1" aria-label="Menu Opsi">
			<MoreVerticalIcon class="w-5 h-5 text-[#03045E]" />
		</button>
	</div>

	<!-- ── 2. Countdown Box (Finish Before) ─────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={false} class="p-3.5">
		<div class="flex items-center justify-between">
			<div>
				<div class="text-[10px] text-[#64748B] font-medium">Selesaikan dalam</div>
				<div class="text-xs font-bold text-[#03045E]">{maxPayTimeFormatted}</div>
			</div>

			<!-- Real-time Timer Digit Boxes [MM] : [SS] -->
			<div class="flex items-center gap-1 font-mono font-bold text-xs text-[#03045E]">
				<span class="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">{timeString[0]}</span>
				<span class="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">{timeString[1]}</span>
				<span class="text-sm font-black mx-0.5">:</span>
				<span class="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">{timeString[2]}</span>
				<span class="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">{timeString[3]}</span>
			</div>
		</div>
	</LiquidGlassCard>

	<!-- ── 3. QRIS Tap Card (LiquidGlassCard 1:1) ────────────────────── -->
	<button
		type="button"
		onclick={handlePayQris}
		class="w-full text-left active:scale-[0.99] transition group"
	>
		<LiquidGlassCard variant="light" hasTopGloss={true} class="p-6 text-center group-hover:border-sky-400 transition">
			<div class="w-16 h-16 rounded-2xl bg-sky-50 text-[#0077B6] flex items-center justify-center mx-auto mb-3 border border-sky-100 shadow-inner group-hover:scale-105 transition">
				<QrCodeIcon class="w-9 h-9" />
			</div>
			<div class="text-base font-bold text-[#03045E]">Tampilkan QRIS</div>
			<div class="text-xs text-[#64748B] mt-1 max-w-xs mx-auto leading-relaxed">
				Klik di sini untuk menampilkan kode QRIS menggunakan Midtrans Snap
			</div>
		</LiquidGlassCard>
	</button>

	<!-- ── 4. QRIS Blue Canvas Card (Total Bayar) ───────────────────── -->
	<div class="rounded-3xl bg-[#0077B6] p-4 shadow-xl shadow-[#0077B6]/20">
		<div class="bg-white rounded-2xl p-4 space-y-3">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-xs font-bold text-[#03045E]">Metode Pembayaran</div>
					<div class="text-[10px] text-[#64748B]">Total Bayar</div>
				</div>
				<span class="text-[10px] font-bold bg-sky-100 text-[#0077B6] px-2.5 py-0.5 rounded-full uppercase">
					{data.plateNumber}
				</span>
			</div>

			<div class="text-2xl font-black text-[#03045E] tracking-tight">
				{formatCurrency(data.amount || 2000)}
			</div>

			<div class="rounded-xl bg-[#F1F5F9] p-2.5 flex items-center gap-2">
				<InfoIcon class="w-4 h-4 text-[#0077B6] shrink-0" />
				<span class="text-[10px] text-[#64748B] font-medium leading-tight">
					Pindai QR menggunakan aplikasi e-wallet apa saja (GoPay, OVO, Dana, BCA Mobile)
				</span>
			</div>
		</div>
	</div>

	<!-- ── 5. Action Buttons (Bayar Tunai & Bayar QRIS) ──────────────── -->
	<div class="space-y-2.5 pt-1">
		<!-- Bayar Tunai (CASH) - Tangerine #FF6B00 -->
		<button
			type="button"
			onclick={handlePayCash}
			disabled={isCashProcessing}
			class="w-full py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm shadow-lg shadow-[#FF6B00]/30 active:scale-[0.98] transition flex items-center justify-center gap-2"
		>
			{#if isCashProcessing}
				<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				<span>Memproses Pembayaran...</span>
			{:else}
				<span>Bayar Tunai (CASH)</span>
			{/if}
		</button>

		<!-- Bayar QRIS - SmartBlue Outlined -->
		<button
			type="button"
			onclick={handlePayQris}
			class="w-full py-3.5 rounded-xl border-2 border-[#0077B6] hover:bg-sky-50 text-[#0077B6] font-bold text-sm active:scale-[0.98] transition"
		>
			Bayar QRIS
		</button>
	</div>

	<!-- ── 6. Footer (Butuh Bantuan) ─────────────────────────────────── -->
	<div class="text-center pt-2">
		<span class="text-xs text-[#64748B]">Butuh Bantuan? </span>
		<button onclick={() => alert('Instruksi: Terima uang tunai dari pengendara atau minta pengendara scan QRIS pada layar.')} class="text-xs font-bold text-[#0077B6] hover:underline">
			Baca Instruksi
		</button>
	</div>

	<!-- ── 7. Payment Result Modal (Porting 1:1 PaymentResult.kt) ──── -->
	<PaymentResultModal
		isOpen={paymentSuccess}
		status="SUCCESS"
		orderId={receiptNumber}
		txCode={data.id}
		plateNumber={data.plateNumber}
		branchName="Area Tepi Jalan"
		amount={Number(data.amount) || 2000}
		paymentMethod="QRIS Dinamis / Tunai"
		transactionTime={new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'}
		onClose={() => goto('/m/jukir')}
	/>
</div>
