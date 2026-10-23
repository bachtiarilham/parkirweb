<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import CpuIcon from "@lucide/svelte/icons/cpu";
	import SmartphoneIcon from "@lucide/svelte/icons/smartphone";
	import BarChart3Icon from "@lucide/svelte/icons/bar-chart-3";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";

	let { onRequestDemo = () => {} } = $props<{ onRequestDemo?: () => void }>();

	let activePillar = $state<number>(0);

	const pillars = [
		{
			id: "automate",
			badge: "Pilar 1: Automate",
			title: "AUTOMATE — Otomatisasi Gerbang Bebas Tiket Berbasis AI ANPR",
			headline: "Sistem Palang Gerbang Cerdas Tanpa Karcis Kertas",
			description: "Otomatisasi penuh alur keluar-masuk kendaraan untuk gedung, mall, rumah sakit, dan perumahan. Kamera ANPR AI kami mengenali plat kendaraan secara instan dengan kecepatan respon palang di bawah 0.8 detik.",
			icon: CpuIcon,
			features: [
				"AI License Plate Recognition tingkat akurasi 99.4%",
				"Hardware Agnostic: Kompatibel dengan palang merk apapun",
				"Pembayaran QRIS & Tapless Cashless langsung di dispenser gerbang",
				"Display digital kapasitas slot parkir kosong secara real-time"
			],
			previewTitle: "ANPR Gate Controller Node",
			previewStat: "0.72 Detik",
			previewStatDesc: "Rata-rata waktu transit kendaraan"
		},
		{
			id: "mobilize",
			badge: "Pilar 2: Mobilize",
			title: "MOBILIZE — Digitalisasi Juru Parkir Tepi Jalan Umum (TJU)",
			headline: "Ubah Jukir Konvensional Menjadi Petugas Digital Terpercaya",
			description: "Aplikasi Android ringan untuk juru parkir tepi jalan dengan kapabilitas offline-first. Transaksi tetap tercatat walau sinyal internet hilang dan otomatis tersinkron saat internet kembali.",
			icon: SmartphoneIcon,
			features: [
				"Pencatatan nopol instan & cetak struk digital via SMS/WA/Bluetooth",
				"QRIS dinamis langsung ke rekening penampung resmi Pemda",
				"Geofencing & GPS tracking titik lokasi kerja juru parkir",
				"Arsitektur Offline-First (100% aman saat area blank spot)"
			],
			previewTitle: "Mobile Jukir POS-Lite",
			previewStat: "0% Kebocoran",
			previewStatDesc: "Audit setoran kasir terverifikasi"
		},
		{
			id: "analyze",
			badge: "Pilar 3: Analyze & Govern",
			title: "ANALYZE — Command Center, Revenue Assurance & Anti-Fraud",
			headline: "Visibilitas Finansial & Operasional 360° Real-Time",
			description: "Dashboard eksekutif terpusat yang memantau okupansi, omset gerbang per menit, audit setoran juru parkir, serta peringatan dini otomatis bila ada indikasi kecurangan di lapangan.",
			icon: BarChart3Icon,
			features: [
				"Audit rekonsiliasi kasir harian otomatis antar-cabang",
				"Algoritma AI pendeteksi transaksi anomali (Fraud Alert)",
				"Pelaporan PAD real-time untuk Dinas Pendapatan & Pemda",
				"Manajemen multi-tarif progresif, flat, dan member langganan"
			],
			previewTitle: "Executive Command Center",
			previewStat: "+38% Revenue",
			previewStatDesc: "Peningkatan pendapatan rata-rata mitra"
		}
	];
</script>

<!-- Zenarate Style Pillars: Clean White Background, Slate Typography, Modern Tab Switcher -->
<section id="pillars" class="py-24 bg-white text-slate-900 border-b border-slate-100">
	<div class="mx-auto max-w-7xl px-4 sm:px-8">
		
		<!-- Section Header -->
		<div class="text-center max-w-3xl mx-auto space-y-4 mb-14">
			<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F0FF] border border-[#7862EA]/20 text-[#7862EA] text-xs font-bold">
				<span>The Closed Loop Framework</span>
			</div>
			<h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
				Tiga Pilar Solusi untuk Seluruh Ekosistem Parkir
			</h2>
			<p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
				Mulai dari palang gerbang gedung otomatis hingga penagihan parkir di bahu jalan, seluruh aliran transaksi bermuara dalam satu sistem analitik terpadu.
			</p>
		</div>

		<!-- Pilar Switcher Tabs -->
		<div class="flex flex-wrap items-center justify-center gap-3 mb-12">
			{#each pillars as p, idx}
				<button
					type="button"
					onclick={() => (activePillar = idx)}
					class="px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer {activePillar === idx
						? 'bg-[#7862EA] text-white shadow-lg shadow-[#7862EA]/25 scale-102'
						: 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
				>
					<p.icon class="size-4 {activePillar === idx ? 'text-white' : 'text-[#7862EA]'}" />
					<span>{p.badge}</span>
				</button>
			{/each}
		</div>

		<!-- Active Pilar Card Display (Zenarate Split Showcase) -->
		<div class="rounded-3xl bg-slate-50 border border-slate-200/90 p-8 sm:p-14 shadow-sm relative overflow-hidden">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
				
				<!-- Left Text & Checklist -->
				<div class="lg:col-span-7 space-y-6 text-left">
					<div class="inline-block px-3 py-1 rounded-lg bg-[#F3F0FF] text-[#7862EA] text-xs font-bold font-mono">
						{pillars[activePillar].title}
					</div>

					<h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
						{pillars[activePillar].headline}
					</h3>

					<p class="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
						{pillars[activePillar].description}
					</p>

					<!-- Checklist -->
					<div class="space-y-3 pt-2">
						{#each pillars[activePillar].features as feat}
							<div class="flex items-start gap-3">
								<CheckCircle2Icon class="size-5 text-[#7862EA] shrink-0 mt-0.5" />
								<span class="text-xs sm:text-sm text-slate-800 font-medium">{feat}</span>
							</div>
						{/each}
					</div>

					<div class="pt-4">
						<button
							type="button"
							onclick={onRequestDemo}
							class="inline-flex items-center gap-2 rounded-full bg-[#7862EA] hover:bg-[#6850E5] text-white px-7 py-3.5 text-xs sm:text-sm font-bold shadow-md shadow-[#7862EA]/20 transition cursor-pointer"
						>
							<span>Konsultasi Solusi Ini</span>
							<ArrowRightIcon class="size-4" />
						</button>
					</div>
				</div>

				<!-- Right Stat Card -->
				<div class="lg:col-span-5">
					<div class="rounded-2xl bg-white border border-slate-200 p-8 text-center space-y-6 shadow-sm">
						<div class="size-16 rounded-2xl bg-[#F3F0FF] text-[#7862EA] flex items-center justify-center mx-auto">
							{#if activePillar === 0}
								<CpuIcon class="size-8" />
							{:else if activePillar === 1}
								<SmartphoneIcon class="size-8" />
							{:else}
								<BarChart3Icon class="size-8" />
							{/if}
						</div>

						<div>
							<div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
								{pillars[activePillar].previewTitle}
							</div>
							<div class="text-4xl sm:text-5xl font-black text-slate-900 mt-2">
								{pillars[activePillar].previewStat}
							</div>
							<div class="text-xs font-medium text-slate-500 mt-1">
								{pillars[activePillar].previewStatDesc}
							</div>
						</div>

						<div class="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 text-left font-mono">
							<strong class="text-emerald-600">✓ Standar Enterprise:</strong>
							<span class="block mt-1">Dapat diintegrasikan langsung dengan barrier gate atau smartphone jukir eksisting tanpa perlu rombak total.</span>
						</div>
					</div>
				</div>

			</div>
		</div>

	</div>
</section>
