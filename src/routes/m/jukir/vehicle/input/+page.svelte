<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import InfoIcon from '@lucide/svelte/icons/info';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import CarIcon from '@lucide/svelte/icons/car';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import { formatCurrency } from '$lib/utils/format-currency';
	import { API_ENDPOINTS } from '$lib/api/endpoints.js';

	let { data } = $props();

	let plateNumber = $state(data.plateNumber || '');
	let selectedVehicle = $state<'MOTOR' | 'MOBIL' | 'TRUK'>('MOTOR');
	let isSubmitting = $state(false);
	let errorMessage = $state<string | null>(null);

	const currentTimeFormatted = new Date().toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	const vehicleTariffs = {
		MOTOR: { name: 'Motor', price: 2000, label: 'Rp 2.000 / jam' },
		MOBIL: { name: 'Mobil', price: 5000, label: 'Rp 5.000 / jam' },
		TRUK: { name: 'Truk / Bus', price: 10000, label: 'Rp 10.000 / jam' }
	};

	import { deserialize } from '$app/forms';

	async function handleSubmit() {
		const cleanPlate = plateNumber.trim().toUpperCase();
		if (!cleanPlate) {
			errorMessage = 'Nomor polisi kendaraan wajib diisi';
			return;
		}

		isSubmitting = true;
		errorMessage = null;

		try {
			// Trigger physical vibration if supported
			if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
				navigator.vibrate([40, 60, 40]);
			}

			const idempotencyKey = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
			const branchId = data.user?.branchId || 1;

			const formData = new FormData();
			formData.append('plate_number', cleanPlate);
			formData.append('vehicle_type', selectedVehicle);
			formData.append('branch_id', String(branchId));
			formData.append('idempotency_key', idempotencyKey);

			const res = await fetch('?/checkin', {
				method: 'POST',
				body: formData
			});

			const text = await res.text();
			const result = deserialize(text) as any;
			const dataRes = (result.type === 'success' ? result.data : result.data) || {};

			if (result.type === 'success' && dataRes.success) {
				const sessionData = dataRes.data || {};
				const sessionId = sessionData.id || `TKT-${Date.now()}`;
				const snapToken = sessionData.snap_token || '';
				const amount = vehicleTariffs[selectedVehicle].price;

				// Navigate to JukirSessionDetail screen matching Screen.JukirSessionDetail.createRoute
				goto(`/m/jukir/session/detail/${sessionId}?snapToken=${encodeURIComponent(snapToken)}&amount=${amount}`);
			} else {
				errorMessage = dataRes.message || 'Gagal memulai sesi parkir. Silakan coba lagi.';
			}
		} catch (err: any) {
			errorMessage = err.message || 'Terjadi kesalahan jaringan. Periksa koneksi Anda.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. SimpleTopBar (Identik ParkSessionCreateScreen.kt) ───────── -->
	<div class="flex items-center gap-3 pt-1">
		<button
			onclick={() => goto('/m/jukir/vehicle/scan')}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ArrowLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Input Manual
		</h1>
	</div>

	<!-- ── 2. InfoCard ──────────────────────────────────────────────── -->
	<div class="rounded-2xl bg-sky-50 border border-sky-200/80 p-3.5 flex items-start gap-3">
		<InfoIcon class="w-5 h-5 text-[#0077B6] shrink-0 mt-0.5" />
		<p class="text-xs text-[#03045E] font-medium leading-relaxed">
			Masukkan nomor polisi kendaraan yang parkir di area Anda.
		</p>
	</div>

	<!-- ── 3. Data Kendaraan Section ────────────────────────────────── -->
	<div class="space-y-1.5">
		<label for="plate-input" class="text-xs font-black text-[#03045E] uppercase tracking-wider block px-1">
			Data Kendaraan
		</label>
		<!-- Indonesian License Plate Input Style -->
		<div class="relative">
			<div class="rounded-2xl bg-slate-900 border-2 border-slate-700 p-2 shadow-inner">
				<input
					id="plate-input"
					type="text"
					bind:value={plateNumber}
					placeholder="Contoh: B 1234 XYZ"
					class="w-full bg-transparent text-center font-mono font-black text-2xl tracking-widest uppercase text-white placeholder:text-slate-500 focus:outline-none"
					autocomplete="off"
					spellcheck="false"
				/>
			</div>
		</div>
	</div>

	<!-- ── 4. Jenis Kendaraan Section (VehicleSelector) ─────────────── -->
	<div class="space-y-2">
		<label class="text-xs font-black text-[#03045E] uppercase tracking-wider block px-1">
			Jenis Kendaraan
		</label>

		<div class="grid grid-cols-3 gap-2.5">
			<!-- Motor Chip -->
			<button
				type="button"
				onclick={() => (selectedVehicle = 'MOTOR')}
				class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition active:scale-95 {selectedVehicle === 'MOTOR' ? 'border-[#0077B6] bg-sky-50/80 shadow-md shadow-sky-600/20' : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'}"
			>
				<BikeIcon class="w-6 h-6 mb-1 {selectedVehicle === 'MOTOR' ? 'text-[#0077B6]' : 'text-slate-500'}" />
				<span class="text-xs font-black {selectedVehicle === 'MOTOR' ? 'text-[#0077B6]' : 'text-slate-700'}">Motor</span>
				<span class="text-[10px] text-slate-500 mt-0.5">Rp 2.000</span>
			</button>

			<!-- Mobil Chip -->
			<button
				type="button"
				onclick={() => (selectedVehicle = 'MOBIL')}
				class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition active:scale-95 {selectedVehicle === 'MOBIL' ? 'border-[#0077B6] bg-sky-50/80 shadow-md shadow-sky-600/20' : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'}"
			>
				<CarIcon class="w-6 h-6 mb-1 {selectedVehicle === 'MOBIL' ? 'text-[#0077B6]' : 'text-slate-500'}" />
				<span class="text-xs font-black {selectedVehicle === 'MOBIL' ? 'text-[#0077B6]' : 'text-slate-700'}">Mobil</span>
				<span class="text-[10px] text-slate-500 mt-0.5">Rp 5.000</span>
			</button>

			<!-- Truk Chip -->
			<button
				type="button"
				onclick={() => (selectedVehicle = 'TRUK')}
				class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition active:scale-95 {selectedVehicle === 'TRUK' ? 'border-[#0077B6] bg-sky-50/80 shadow-md shadow-sky-600/20' : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'}"
			>
				<TruckIcon class="w-6 h-6 mb-1 {selectedVehicle === 'TRUK' ? 'text-[#0077B6]' : 'text-slate-500'}" />
				<span class="text-xs font-black {selectedVehicle === 'TRUK' ? 'text-[#0077B6]' : 'text-slate-700'}">Truk</span>
				<span class="text-[10px] text-slate-500 mt-0.5">Rp 10.000</span>
			</button>
		</div>
	</div>

	<!-- ── 5. ReadOnly Fields (Waktu Masuk & Lokasi Parkir) ──────────── -->
	<div class="space-y-2">
		<!-- Waktu Masuk -->
		<div class="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 flex items-center justify-between">
			<div class="flex items-center gap-2.5 text-xs text-[#64748B] font-medium">
				<CalendarIcon class="w-4 h-4 text-[#0077B6]" />
				<span>Waktu Masuk</span>
			</div>
			<div class="text-xs font-bold text-[#03045E]">
				{currentTimeFormatted}
			</div>
		</div>

		<!-- Lokasi Parkir -->
		<div class="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 flex items-center justify-between">
			<div class="flex items-center gap-2.5 text-xs text-[#64748B] font-medium">
				<MapPinIcon class="w-4 h-4 text-[#0077B6]" />
				<span>Lokasi Parkir</span>
			</div>
			<div class="text-xs font-bold text-[#03045E]">
				{data.user?.branchCode || 'Zona A - Malioboro Utara'}
			</div>
		</div>
	</div>

	<!-- ── 6. TariffCard (LiquidGlassCard 1:1) ────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-4">
		<div class="flex items-center justify-between">
			<div>
				<div class="text-[11px] text-[#64748B] font-semibold">Total Tarif Parkir</div>
				<div class="text-xl font-black text-[#0077B6] mt-0.5">
					{vehicleTariffs[selectedVehicle].label}
				</div>
			</div>
			<span class="bg-sky-100 text-[#0077B6] text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-sky-200">
				TARIF RESMI
			</span>
		</div>
	</LiquidGlassCard>

	<!-- Error Alert if any -->
	{#if errorMessage}
		<div class="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-semibold animate-in fade-in">
			{errorMessage}
		</div>
	{/if}

	<!-- ── 7. Submit Button (Mulai Sesi Parkir) ──────────────────────── -->
	<button
		type="button"
		onclick={handleSubmit}
		disabled={isSubmitting}
		class="w-full py-4 rounded-2xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-black text-sm shadow-xl shadow-[#0077B6]/30 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2"
	>
		{#if isSubmitting}
			<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
			<span>Menyimpan Sesi...</span>
		{:else}
			<span>Mulai Sesi Parkir</span>
		{/if}
	</button>
</div>
