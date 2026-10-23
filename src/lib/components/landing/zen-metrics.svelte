<script lang="ts">
	const metrics = [
		{
			value: "99.4%",
			label: "Akurasi AI ANPR Camera",
			desc: "Dukungan plat nomor standar hitam, putih, dinas, hingga plat khusus malam hari."
		},
		{
			value: "0%",
			label: "Kebocoran Setoran Jukir",
			desc: "Pencatatan QRIS instan & geofence lokasi kerja juru parkir terverifikasi sistem."
		},
		{
			value: "< 0.8s",
			label: "Waktu Respon Palang",
			desc: "Akses gerbang cepat dan mulus tanpa antrean, tanpa karcis kertas sobek."
		},
		{
			value: "500K+",
			label: "Transaksi Bulanan",
			desc: "Keandalan operasional tinggi di berbagai mall, rumah sakit, dan tepi jalan kota."
		}
	];

	const partners = [
		{ name: "Dinas Perhubungan", label: "Pemerintah Daerah" },
		{ name: "Bank Central Asia (BCA)", label: "Mitra QRIS & Flazz" },
		{ name: "Bank Mandiri", label: "Mitra e-Money" },
		{ name: "Bank BRI", label: "Mitra Brizzi & QRIS" },
		{ name: "Pengelola Properti & Mall", label: "Komersial & Residensial" }
	];
</script>

<!-- Zenarate Style Metrics & Social Proof: Neutral Light Gray Background, Clean Logos, High-Impact Numbers -->
<section class="py-16 bg-slate-50 border-y border-slate-200/80">
	<div class="mx-auto max-w-7xl px-4 sm:px-8">
		
		<!-- 1. Partner Logos Strip -->
		<div class="text-center mb-12">
			<p class="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
				Dipercaya & Terintegrasi Bersama Ekosistem Perbankan & Pemerintah Daerah
			</p>

			<div class="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
				{#each partners as p}
					<div class="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center hover:border-slate-300 transition">
						<span class="text-sm font-extrabold text-slate-800">
							{p.name}
						</span>
						<span class="text-[10px] font-mono text-slate-400 mt-0.5">
							{p.label}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- 2. ROI Metric Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each metrics as m}
				<div class="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#7862EA]/40 transition-all duration-200">
					<div class="text-4xl sm:text-5xl font-black text-[#7862EA] tracking-tight">
						{m.value}
					</div>
					<div class="text-base font-bold text-slate-900 mt-3">
						{m.label}
					</div>
					<div class="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
						{m.desc}
					</div>
				</div>
			{/each}
		</div>

	</div>
</section>
