<script lang="ts">
	import WifiOffIcon from "@lucide/svelte/icons/wifi-off";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
	import LayersIcon from "@lucide/svelte/icons/layers";
	import ServerIcon from "@lucide/svelte/icons/server";
	import QrCodeIcon from "@lucide/svelte/icons/qr-code";
	import ClockIcon from "@lucide/svelte/icons/clock";

	const features = [
		{
			title: "Resiliensi Offline-First",
			desc: "Operasional palang gerbang dan POS jukir tetap berfungsi normal 100% tanpa gangguan sekalipun koneksi internet sedang putus di lokasi.",
			icon: WifiOffIcon,
			tag: "Edge Computing"
		},
		{
			title: "Standar Keamanan QRIS Perbankan",
			desc: "Terintegrasi langsung dengan Bank Indonesia dan agregator nasional untuk setoran non-tunai langsung ke kas resmi pengelola / Pemda.",
			icon: QrCodeIcon,
			tag: "Fintech Grade"
		},
		{
			title: "Kompatibel Hardware Lama",
			desc: "Tak perlu membeli palang gerbang baru. Line Parking kompatibel dengan barrier gate, loop detector, dan IP Camera merk apapun.",
			icon: ServerIcon,
			tag: "Hardware Agnostic"
		},
		{
			title: "Struktur Multi-Tenant Hierarkis",
			desc: "Dukungan penuh untuk perusahaan dengan banyak cabang (multi-branch), peran pengguna OIDC terisolasi, dan split-revenue otomatis.",
			icon: LayersIcon,
			tag: "SaaS Enterprise"
		},
		{
			title: "Audit Trail & Rekonsiliasi Otomatis",
			desc: "Setiap sen transaksi, pergantian shift jukir, dan pembukaan palang darurat tercatat dalam log audit anti-manipulasi.",
			icon: ShieldCheckIcon,
			tag: "Zero Fraud"
		},
		{
			title: "Tarif Fleksibel & Langganan Member",
			desc: "Atur tarif parkir dinamis, tarif flat, tarif progresif, jam sibuk, hingga kuota kartu member bulanan dengan mudah.",
			icon: ClockIcon,
			tag: "Smart Tariff"
		}
	];
</script>

<!-- Zenarate Style Capabilities Grid: Clean White Cards, Subtle Hover Elevation, Slate-900 Headings -->
<section id="features" class="py-24 bg-white text-slate-900 border-b border-slate-100">
	<div class="mx-auto max-w-7xl px-4 sm:px-8">
		
		<!-- Section Header -->
		<div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
			<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F0FF] border border-[#7862EA]/20 text-[#7862EA] text-xs font-bold">
				<span>Kapabilitas Kelas Enterprise</span>
			</div>
			<h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
				Dirancang untuk Beban Operasional 24/7 Tanpa Henti
			</h2>
			<p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
				Arsitektur tangguh yang menggabungkan keandalan sistem lokal (Edge) dengan kecepatan dan kelengkapan analitik komputasi awan (Cloud).
			</p>
		</div>

		<!-- Bento Grid of Features -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each features as f}
				<div class="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#7862EA]/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col justify-between group">
					<div>
						<div class="flex items-center justify-between mb-6">
							<div class="size-12 rounded-2xl bg-[#F3F0FF] text-[#7862EA] flex items-center justify-center group-hover:scale-105 transition-transform">
								<f.icon class="size-6" />
							</div>
							<span class="text-[10px] font-mono font-bold text-slate-500 px-3 py-1 rounded-full bg-white border border-slate-200">
								{f.tag}
							</span>
						</div>

						<h3 class="text-lg font-bold text-slate-900 group-hover:text-[#7862EA] transition">
							{f.title}
						</h3>

						<p class="text-xs sm:text-sm text-slate-600 font-normal mt-2.5 leading-relaxed">
							{f.desc}
						</p>
					</div>

					<div class="pt-6 mt-6 border-t border-slate-200 flex items-center text-xs font-bold text-[#7862EA]">
						<span>Teruji di Lapangan →</span>
					</div>
				</div>
			{/each}
		</div>

	</div>
</section>
