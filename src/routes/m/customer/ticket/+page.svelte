<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import QRCode from 'qrcode';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CarIcon from '@lucide/svelte/icons/car';

	let { data } = $props();

	let qrDataUrl = $state<string>('');
	let qrCodeValue = $derived(
		data.activeSession?.code || data.user?.email || 'MEMBER-LINESPOT'
	);

	let durationMinutes = $state(0);
	let timerInterval: any = null;

	function updateDuration() {
		if (data.activeSession?.check_in_time) {
			const checkIn = new Date(data.activeSession.check_in_time).getTime();
			const now = Date.now();
			durationMinutes = Math.max(0, Math.floor((now - checkIn) / 60000));
		}
	}

	onMount(async () => {
		try {
			qrDataUrl = await QRCode.toDataURL(qrCodeValue, {
				width: 320,
				margin: 1,
				color: {
					dark: '#03045E',
					light: '#ffffff'
				}
			});
		} catch (err) {
			console.error('Error generating QR Code:', err);
		}

		updateDuration();
		timerInterval = setInterval(updateDuration, 30000);
	});

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});
</script>

<div class="space-y-4">
	<!-- Top Bar -->
	<div class="flex items-center justify-between">
		<a href="/m/customer" class="inline-flex items-center text-xs font-bold text-[#0077B6] hover:text-[#03045E]">
			<ArrowLeftIcon class="w-4 h-4 mr-1" /> Kembali ke Home
		</a>
		<h1 class="text-xs font-black text-[#03045E] uppercase tracking-wider">Tiket Parkir Digital</h1>
		<div class="w-8"></div>
	</div>

	<!-- QR Ticket Card (Liquid Glass Styled) -->
	<LiquidGlassCard variant="light" class="p-6 text-center space-y-4">
		<div>
			<span class="text-[10px] font-black uppercase tracking-wider text-[#0077B6] bg-[#CAF0F8] px-3 py-1 rounded-full border border-[#ADE8F4]">
				{data.activeSession ? 'SESI PARKIR BERJALAN' : 'QR IDENTITAS MEMBER'}
			</span>
			<h2 class="text-xl font-black text-[#03045E] mt-2 font-mono tracking-wider">
				{data.activeSession?.plate_number || data.user?.full_name || 'Member'}
			</h2>
			<p class="text-xs text-[#64748B] font-mono mt-0.5">
				{qrCodeValue}
			</p>
		</div>

		<!-- High-Contrast QR Box with Liquid Glass Border -->
		<div class="bg-white p-4 rounded-3xl inline-block shadow-md border-2 border-[#ADE8F4]/80 mx-auto">
			{#if qrDataUrl}
				<img src={qrDataUrl} alt="QR Code Tiket" class="w-56 h-56 mx-auto object-contain" />
			{:else}
				<div class="w-56 h-56 flex items-center justify-center text-xs text-[#64748B]">
					Membuat QR Code...
				</div>
			{/if}
		</div>

		{#if data.activeSession}
			<!-- Live Duration details -->
			<div class="bg-white/80 rounded-2xl p-3.5 flex items-center justify-around border border-white shadow-sm text-xs">
				<div>
					<span class="text-[#64748B] block text-[10px] font-semibold">TIPE</span>
					<span class="font-black text-[#03045E] uppercase">{data.activeSession.vehicle_type}</span>
				</div>
				<div class="w-px h-6 bg-[#ADE8F4]"></div>
				<div>
					<span class="text-[#64748B] block text-[10px] font-semibold">DURASI</span>
					<span class="font-black text-[#0077B6]">{Math.floor(durationMinutes / 60)}j {durationMinutes % 60}m</span>
				</div>
				<div class="w-px h-6 bg-[#ADE8F4]"></div>
				<div>
					<span class="text-[#64748B] block text-[10px] font-semibold">STATUS</span>
					<span class="font-black text-emerald-600">AKTIF</span>
				</div>
			</div>
		{/if}

		<div class="text-[11px] text-[#64748B] font-medium">
			⚡ Naikkan kecerahan layar HP saat petugas jukir memindai kode QR ini.
		</div>
	</LiquidGlassCard>
</div>
