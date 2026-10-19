<script lang="ts">
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import BellIcon from '@lucide/svelte/icons/bell';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	const notifications = [
		{
			id: '1',
			title: 'Shift Parkir Aktif',
			desc: 'Shift Anda hari ini telah aktif. Selalu pastikan sinkronisasi data online.',
			time: '1 jam lalu',
			type: 'info'
		},
		{
			id: '2',
			title: 'Sinkronisasi Berhasil',
			desc: 'Semua antrean check-in lokal berhasil disinkronkan ke server.',
			time: '3 jam lalu',
			type: 'success'
		}
	];
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- Top Header -->
	<div class="flex items-center gap-3 pt-1">
		<button
			onclick={() => history.back()}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Notifikasi
		</h1>
	</div>

	<!-- Notification List -->
	<div class="space-y-2.5">
		{#each notifications as notif}
			<LiquidGlassCard variant="light" hasTopGloss={false} class="p-4">
				<div class="flex items-start gap-3">
					<div class="w-9 h-9 rounded-xl {notif.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-sky-50 text-[#0077B6] border border-sky-100'} flex items-center justify-center shrink-0">
						{#if notif.type === 'success'}
							<CheckCircleIcon class="w-5 h-5" />
						{:else}
							<BellIcon class="w-5 h-5" />
						{/if}
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center justify-between">
							<h3 class="text-xs font-bold text-[#03045E]">{notif.title}</h3>
							<span class="text-[10px] text-slate-400">{notif.time}</span>
						</div>
						<p class="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{notif.desc}</p>
					</div>
				</div>
			</LiquidGlassCard>
		{/each}
	</div>
</div>
