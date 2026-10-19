<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import QRCode from 'qrcode';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ClockIcon from '@lucide/svelte/icons/clock';

	let { data } = $props();

	let qrDataUrl = $state<string>('');
	let qrCodeValue = $derived(data.session?.code || data.ticketId);

	let durationMinutes = $state(0);
	let timerInterval: any = null;

	function updateDuration() {
		if (data.session?.check_in_time) {
			const checkIn = new Date(data.session.check_in_time).getTime();
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
					dark: '#0f172a',
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
		<a href="/m/customer" class="inline-flex items-center text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-sky-600">
			<ChevronLeftIcon class="w-4 h-4 mr-0.5" /> Kembali
		</a>
		<h1 class="text-sm font-bold text-slate-800 dark:text-white">QR Tiket Parkir</h1>
		<div class="w-10"></div>
	</div>

	<!-- QR Ticket Card -->
	<div class="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-3xl p-6 text-center space-y-4 shadow-md">
		<div>
			<span class="text-[10px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800/40">
				TIKET ELEKTRONIK
			</span>
			<h2 class="text-lg font-black text-slate-900 dark:text-white mt-2">
				{data.session?.plate_number || 'KENDARAAN PARKIR'}
			</h2>
			<p class="text-xs text-slate-400 font-mono mt-0.5">
				{qrCodeValue}
			</p>
		</div>

		<!-- High-Contrast QR Box -->
		<div class="bg-white p-4 rounded-2xl inline-block shadow-inner border border-slate-100 mx-auto">
			{#if qrDataUrl}
				<img src={qrDataUrl} alt="QR Code Tiket" class="w-56 h-56 mx-auto object-contain" />
			{:else}
				<div class="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
					Membuat QR Code...
				</div>
			{/if}
		</div>

		{#if data.session}
			<div class="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-3 flex items-center justify-around border border-slate-200/80 dark:border-zinc-700 text-xs">
				<div>
					<span class="text-slate-400 block text-[10px]">TIPE</span>
					<span class="font-bold text-slate-800 dark:text-zinc-200 uppercase">{data.session.vehicle_type}</span>
				</div>
				<div class="w-px h-6 bg-slate-200 dark:bg-zinc-700"></div>
				<div>
					<span class="text-slate-400 block text-[10px]">DURASI</span>
					<span class="font-bold text-sky-600 dark:text-sky-400">{Math.floor(durationMinutes / 60)}j {durationMinutes % 60}m</span>
				</div>
				<div class="w-px h-6 bg-slate-200 dark:bg-zinc-700"></div>
				<div>
					<span class="text-slate-400 block text-[10px]">STATUS</span>
					<span class="font-bold text-emerald-600">AKTIF</span>
				</div>
			</div>
		{/if}

		<div class="text-[11px] text-slate-400">
			⚡ Tunjukkan QR ini ke petugas jukir saat Anda hendak keluar dari area parkir.
		</div>
	</div>
</div>
