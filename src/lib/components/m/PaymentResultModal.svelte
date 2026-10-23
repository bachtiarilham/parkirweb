<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import InfoIcon from '@lucide/svelte/icons/info';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import { formatCurrency } from '$lib/utils/format-currency';

	export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

	let {
		isOpen = false,
		status = 'SUCCESS' as PaymentStatus,
		orderId = '',
		txCode = '',
		plateNumber = '',
		branchName = '',
		amount = 0,
		paymentMethod = 'QRIS',
		transactionTime = '',
		onClose = () => {},
		onSecondaryAction = () => {}
	} = $props<{
		isOpen?: boolean;
		status?: PaymentStatus;
		orderId?: string;
		txCode?: string;
		plateNumber?: string;
		branchName?: string;
		amount?: number;
		paymentMethod?: string;
		transactionTime?: string;
		onClose?: () => void;
		onSecondaryAction?: () => void;
	}>();

	let qrDataUrl = $state('');

	const receiptIdentifier = $derived(txCode || orderId || 'REC-ONLINE');
	const receiptUrl = $derived(
		typeof window !== 'undefined'
			? `${window.location.origin}/m/history/detail/${receiptIdentifier}`
			: `/m/history/detail/${receiptIdentifier}`
	);

	$effect(() => {
		if (isOpen && status === 'SUCCESS' && receiptUrl) {
			QRCode.toDataURL(receiptUrl, {
				width: 320,
				margin: 1,
				color: {
					dark: '#03045E',
					light: '#FFFFFF'
				}
			})
				.then((url) => {
					qrDataUrl = url;
				})
				.catch((err) => {
					console.warn('QR Code generation error:', err);
				});
		}
	});

	const statusConfig = $derived.by(() => {
		switch (status) {
			case 'SUCCESS':
				return {
					badgeBg: 'bg-emerald-100',
					badgeText: 'text-emerald-700',
					borderColor: 'border-emerald-200',
					icon: CheckIcon,
					iconBg: 'bg-emerald-500',
					title: 'Pembayaran Berhasil!',
					desc: 'Transaksi telah tervalidasi dan palang gerbang / pencatatan telah selesai.'
				};
			case 'PENDING':
				return {
					badgeBg: 'bg-amber-100',
					badgeText: 'text-amber-700',
					borderColor: 'border-amber-200',
					icon: InfoIcon,
					iconBg: 'bg-amber-500',
					title: 'Menunggu Pembayaran',
					desc: 'Silakan selesaikan pembayaran sebelum batas waktu berakhir.'
				};
			case 'FAILED':
			default:
				return {
					badgeBg: 'bg-rose-100',
					badgeText: 'text-rose-700',
					borderColor: 'border-rose-200',
					icon: XIcon,
					iconBg: 'bg-rose-500',
					title: 'Pembayaran Gagal',
					desc: 'Terjadi kendala saat memproses transaksi pembayaran.'
				};
		}
	});
</script>

{#if isOpen}
	{@const StatusIcon = statusConfig.icon}
	<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
		<div class="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
			
			<!-- Status Icon & Title -->
			<div class="text-center space-y-2">
				<div class="w-16 h-16 rounded-full {statusConfig.iconBg} text-white flex items-center justify-center mx-auto shadow-lg shadow-black/10">
					<StatusIcon class="w-9 h-9 stroke-[2.5]" />
				</div>
				<h2 class="text-xl font-black text-[#03045E] tracking-tight">{statusConfig.title}</h2>
				<p class="text-xs text-[#64748B] leading-relaxed max-w-xs mx-auto">{statusConfig.desc}</p>
			</div>

			<!-- QR Code Struk Bukti Bayar (Hanya Muncul saat SUCCESS) -->
			{#if status === 'SUCCESS'}
				<div class="rounded-2xl border-2 border-slate-100 bg-slate-50/80 p-4 text-center space-y-2">
					<div class="text-[11px] font-bold text-[#0077B6] uppercase tracking-wider">
						QR Struk Bukti Bayar
					</div>
					{#if qrDataUrl}
						<div class="bg-white p-2.5 rounded-xl inline-block shadow-xs border border-slate-200">
							<img src={qrDataUrl} alt="QR Code Bukti Pembayaran" class="w-36 h-36 mx-auto object-contain" />
						</div>
					{:else}
						<div class="w-36 h-36 bg-slate-200 rounded-xl mx-auto flex items-center justify-center text-xs text-slate-500 animate-pulse">
							Menyiapkan QR...
						</div>
					{/if}
					<p class="text-[10px] text-slate-500">
						Pengemudi dapat memindai QR code ini untuk melihat e-struk di ponsel.
					</p>
				</div>
			{/if}

			<!-- Transaction Breakdown Card -->
			<div class="rounded-2xl bg-[#F8FAFC] border border-slate-200 p-3.5 space-y-2 text-xs">
				<div class="flex justify-between items-center text-[#64748B]">
					<span>Nomor Polisi</span>
					<span class="font-black text-[#03045E] uppercase tracking-wider">{plateNumber || '-'}</span>
				</div>
				{#if branchName}
					<div class="flex justify-between items-center text-[#64748B]">
						<span>Lokasi / Pos</span>
						<span class="font-bold text-[#03045E]">{branchName}</span>
					</div>
				{/if}
				<div class="flex justify-between items-center text-[#64748B]">
					<span>Metode Pembayaran</span>
					<span class="font-bold text-[#0077B6]">{paymentMethod}</span>
				</div>
				{#if transactionTime}
					<div class="flex justify-between items-center text-[#64748B]">
						<span>Waktu Transaksi</span>
						<span class="font-medium text-slate-700">{transactionTime}</span>
					</div>
				{/if}
				<div class="flex justify-between items-center pt-2 border-t border-slate-200 font-bold">
					<span class="text-[#03045E]">Total Pembayaran</span>
					<span class="text-base font-black text-[#0077B6]">{formatCurrency(amount)}</span>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="space-y-2 pt-1">
				<button
					type="button"
					onclick={onClose}
					class="w-full py-3.5 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/30 active:scale-98 transition cursor-pointer"
				>
					Selesai & Ke Beranda
				</button>

				{#if status === 'SUCCESS'}
					<a
						href={receiptUrl}
						class="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#03045E] font-bold text-xs transition flex items-center justify-center gap-1.5"
					>
						<span>Buka Rincian Bukti Bayar</span>
						<ExternalLinkIcon class="w-3.5 h-3.5 text-slate-500" />
					</a>
				{/if}
			</div>

		</div>
	</div>
{/if}
