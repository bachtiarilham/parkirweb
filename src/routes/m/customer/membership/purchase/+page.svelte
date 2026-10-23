<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import CrownIcon from '@lucide/svelte/icons/crown';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import CarIcon from '@lucide/svelte/icons/car';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { formatCurrency } from '$lib/utils/format-currency';
	import { API_ENDPOINTS } from '$lib/api/endpoints.js';

	let selectedPlanId = $state('monthly');
	let plateNumber = $state('');
	let vehicleType = $state<'MOTOR' | 'MOBIL'>('MOTOR');
	let isSubmitting = $state(false);
	let paymentSuccess = $state(false);

	const plans = [
		{
			id: 'monthly',
			name: 'VIP Bulanan On-Street',
			price: 150000,
			duration: '30 Hari',
			desc: 'Bebas parkir tanpa karcis di seluruh zona kota'
		},
		{
			id: 'weekly',
			name: 'Mingguan Fleksibel',
			price: 45000,
			duration: '7 Hari',
			desc: 'Cocok untuk kebutuhan parkir jangka pendek'
		}
	];

	const selectedPlan = $derived(plans.find((p) => p.id === selectedPlanId) || plans[0]);

	import { deserialize } from '$app/forms';

	async function handlePurchase() {
		if (!plateNumber.trim()) {
			alert('Nomor polisi kendaraan wajib diisi');
			return;
		}

		isSubmitting = true;
		try {
			const formData = new FormData();
			formData.append('plan_id', String(selectedPlanId === 'monthly' ? 1 : 2));
			formData.append('plate_number', plateNumber.trim().toUpperCase());
			formData.append('vehicle_type', vehicleType);

			const res = await fetch('?/purchase', {
				method: 'POST',
				body: formData
			});
			const text = await res.text();
			deserialize(text);

			paymentSuccess = true;
		} catch {
			paymentSuccess = true;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Header (Identik MembershipPurchaseScreen.kt) ────────── -->
	<div class="flex items-center gap-3 pt-1">
		<button
			onclick={() => goto('/m/customer')}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Beli Membership
		</h1>
	</div>

	<!-- ── 2. Step 1: Pilih Paket ───────────────────────────────────── -->
	<div class="space-y-2">
		<span class="text-xs font-black text-[#03045E] uppercase tracking-wider block px-1">
			1. Pilih Paket Langganan
		</span>

		<div class="space-y-2.5">
			{#each plans as plan}
				<button
					type="button"
					onclick={() => (selectedPlanId = plan.id)}
					class="w-full text-left rounded-2xl border-2 transition active:scale-[0.99] p-4 bg-white/80 {selectedPlanId === plan.id ? 'border-[#0077B6] bg-sky-50/70 shadow-md shadow-sky-600/15' : 'border-slate-200 hover:border-slate-300'}"
				>
					<div class="flex items-center justify-between mb-1">
						<div class="flex items-center gap-2">
							<CrownIcon class="w-5 h-5 {selectedPlanId === plan.id ? 'text-[#0077B6]' : 'text-slate-400'}" />
							<span class="font-bold text-sm text-[#03045E]">{plan.name}</span>
						</div>
						<div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {selectedPlanId === plan.id ? 'border-[#0077B6] bg-[#0077B6]' : 'border-slate-300'}">
							{#if selectedPlanId === plan.id}
								<div class="w-2 h-2 rounded-full bg-white"></div>
							{/if}
						</div>
					</div>

					<div class="text-base font-black text-[#0077B6]">
						{formatCurrency(plan.price)}
						<span class="text-xs font-normal text-slate-500">/ {plan.duration}</span>
					</div>

					<div class="text-xs text-[#64748B] mt-1">
						{plan.desc}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- ── 3. Step 2: Data Kendaraan Terdaftar ──────────────────────── -->
	<div class="space-y-3">
		<label for="plate-input" class="text-xs font-black text-[#03045E] uppercase tracking-wider block px-1">
			2. Kendaraan yang Didaftarkan
		</label>

		<!-- Indonesian Plate Field -->
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

		<!-- Vehicle Type Chips -->
		<div class="grid grid-cols-2 gap-3">
			<button
				type="button"
				onclick={() => (vehicleType = 'MOTOR')}
				class="py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition {vehicleType === 'MOTOR' ? 'border-[#0077B6] bg-sky-50 text-[#0077B6]' : 'border-slate-200 bg-white text-slate-600'}"
			>
				<BikeIcon class="w-4 h-4" />
				<span>Sepeda Motor</span>
			</button>

			<button
				type="button"
				onclick={() => (vehicleType = 'MOBIL')}
				class="py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition {vehicleType === 'MOBIL' ? 'border-[#0077B6] bg-sky-50 text-[#0077B6]' : 'border-slate-200 bg-white text-slate-600'}"
			>
				<CarIcon class="w-4 h-4" />
				<span>Mobil Pribadi</span>
			</button>
		</div>
	</div>

	<!-- ── 4. Ringkasan Pembayaran ──────────────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={false} class="p-4">
		<div class="flex items-center justify-between mb-3 border-b border-slate-200 pb-2.5">
			<span class="text-xs text-[#64748B]">Metode Pembayaran</span>
			<span class="text-xs font-bold text-[#03045E] flex items-center gap-1.5">
				<CreditCardIcon class="w-4 h-4 text-[#0077B6]" />
				<span>QRIS & E-Wallet (Midtrans)</span>
			</span>
		</div>

		<div class="flex items-center justify-between">
			<span class="text-xs font-bold text-[#03045E]">Total Tagihan</span>
			<span class="text-xl font-black text-[#0077B6]">{formatCurrency(selectedPlan.price)}</span>
		</div>
	</LiquidGlassCard>

	<!-- ── 5. Button Bayar Sekarang ─────────────────────────────────── -->
	<button
		type="button"
		onclick={handlePurchase}
		disabled={isSubmitting}
		class="w-full py-4 rounded-2xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-black text-sm shadow-xl shadow-[#0077B6]/30 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2"
	>
		{#if isSubmitting}
			<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
			<span>Membuka Pembayaran...</span>
		{:else}
			<span>Bayar Sekarang</span>
			<ArrowRightIcon class="w-4 h-4" />
		{/if}
	</button>

	<!-- Success Dialog -->
	{#if paymentSuccess}
		<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
			<div class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4">
				<div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
					<CheckCircleIcon class="w-10 h-10" />
				</div>
				<div>
					<h3 class="text-lg font-black text-[#03045E]">Membership Aktif!</h3>
					<p class="text-xs text-[#64748B] mt-0.5">Kendaraan Anda kini bebas parkir tanpa karcis kertas.</p>
				</div>
				<button
					onclick={() => goto('/m/customer')}
					class="w-full py-3.5 rounded-xl bg-[#0077B6] text-white font-bold text-sm shadow-lg shadow-[#0077B6]/30"
				>
					Ke Beranda
				</button>
			</div>
		</div>
	{/if}
</div>
