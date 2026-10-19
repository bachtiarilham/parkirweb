<script lang="ts">
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import PrinterIcon from '@lucide/svelte/icons/printer';
	import { formatCurrency } from '$lib/utils/format-currency';

	let { data } = $props();

	const session = $derived(data.session);
	const amount = $derived(Number(session?.amount) || 2000);
	const plate = $derived(session?.plate_number || 'B 1234 XYZ');
	const isPaid = $derived((session?.status || '').toUpperCase() === 'COMPLETED' || (session?.status || '').toUpperCase() === 'PAID');
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Top Header ────────────────────────────────────────────── -->
	<div class="flex items-center justify-between pt-1">
		<button
			onclick={() => history.back()}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Bukti Pembayaran
		</h1>
		<div class="w-10"></div>
	</div>

	<!-- ── 2. Digital Receipt Card (Identik TransactionInvoiceScreen.kt)  -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-6">
		<div class="text-center pb-5 border-b border-dashed border-slate-300">
			<div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
				<CheckCircleIcon class="w-8 h-8" />
			</div>
			<div class="text-xs font-bold uppercase tracking-wider text-emerald-700">Pembayaran Berhasil</div>
			<div class="text-2xl font-black text-[#03045E] mt-1">{formatCurrency(amount)}</div>
			<div class="text-[11px] text-[#64748B] mt-0.5 font-mono">ID: {data.ticketCode}</div>
		</div>

		<!-- Details Breakdown -->
		<div class="py-4 space-y-2.5 text-xs border-b border-dashed border-slate-300">
			<div class="flex justify-between">
				<span class="text-[#64748B]">Nomor Polisi</span>
				<span class="font-bold text-[#03045E] tracking-wider uppercase">{plate}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-[#64748B]">Jenis Kendaraan</span>
				<span class="font-bold text-[#03045E] capitalize">{session?.vehicle_type || 'Sepeda Motor'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-[#64748B]">Metode Bayar</span>
				<span class="font-bold text-[#0077B6]">{session?.payment_method || 'QRIS / Cash'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-[#64748B]">Waktu Masuk</span>
				<span class="font-medium text-[#03045E]">
					{session?.check_in_time ? new Date(session.check_in_time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Hari Ini'}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-[#64748B]">Waktu Keluar</span>
				<span class="font-medium text-[#03045E]">
					{session?.check_out_time ? new Date(session.check_out_time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Selesai'}
				</span>
			</div>
		</div>

		<div class="pt-4 flex justify-between items-center text-xs">
			<span class="font-bold text-[#03045E]">Total Tagihan</span>
			<span class="text-lg font-black text-[#0077B6]">{formatCurrency(amount)}</span>
		</div>
	</LiquidGlassCard>

	<!-- Action Buttons -->
	<div class="grid grid-cols-2 gap-3">
		<button
			type="button"
			onclick={() => window.print()}
			class="py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#03045E] font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-95 transition"
		>
			<PrinterIcon class="w-4 h-4 text-[#0077B6]" />
			<span>Cetak Karcis</span>
		</button>

		<button
			type="button"
			onclick={() => alert('Fitur berbagi struk siap digunakan.')}
			class="py-3 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/20 flex items-center justify-center gap-2 active:scale-95 transition"
		>
			<Share2Icon class="w-4 h-4" />
			<span>Bagikan</span>
		</button>
	</div>
</div>
