<script lang="ts">
	import StarIcon from "@lucide/svelte/icons/star";

	const testimonials = [
		{
			quote: "Dalam 2 bulan pertama implementasi Line Parking di gedung komersial kami, kebocoran uang cash hilang sepenuhnya dan antrean pintu masuk saat jam sibuk pagi terurai di bawah 1 detik.",
			author: "Ir. Bambang Sugiarto",
			role: "Head of Property & Facilities",
			org: "Pengelola Sentra Niaga Sudirman",
			stat: "+42% Pertumbuhan Kas Bersih"
		},
		{
			quote: "LineSpot mengubah tata kelola parkir tepi jalan kami dari sistem karcis sobek manual menjadi serba QRIS digital. Setoran juru parkir transparan dan Pendapatan Asli Daerah (PAD) meningkat pesat.",
			author: "Drs. Hendra Setiawan, M.Si",
			role: "Kepala Bidang Manajemen Lalu Lintas",
			org: "Dinas Perhubungan Wilayah Metropolitan",
			stat: "100% Setoran Tercatat Real-time"
		},
		{
			quote: "Yang paling kami apresiasi adalah tim Line Berkah tidak memaksa kami mengganti barrier gate yang ada. Mereka cukup menyambungkan edge controller ke sistem lama kami dan langsung berfungsi sempurna.",
			author: "Agus Pratama",
			role: "Operations Manager",
			org: "Grand Cilandak Mall & Lifestyle Center",
			stat: "Efisiensi Biaya Capex 65%"
		}
	];
</script>

<!-- Zenarate Style Customer Stories & Impact: Neutral Light Background, High-Credibility Cards -->
<section id="testimonials" class="py-24 bg-slate-50 text-slate-900 border-b border-slate-200">
	<div class="mx-auto max-w-7xl px-4 sm:px-8">
		
		<div class="text-center max-w-2xl mx-auto space-y-4 mb-16">
			<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F0FF] border border-[#7862EA]/20 text-[#7862EA] text-xs font-bold">
				<span>Customer Stories & Proven Impact</span>
			</div>
			<h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
				Dipercaya Pemilik Properti & Pemerintah Daerah
			</h2>
			<p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
				Dengarkan bagaimana transformasi parkir cerdas memberikan dampak nyata pada transparansi dan efisiensi operasional mitra kami.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each testimonials as t}
				<div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#7862EA]/30 transition-all duration-300 flex flex-col justify-between">
					<div>
						<!-- Star Rating -->
						<div class="flex items-center gap-1 text-amber-400 mb-4">
							{#each Array(5) as _}
								<StarIcon class="size-4 fill-amber-400" />
							{/each}
						</div>

						<p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal italic">
							"{t.quote}"
						</p>
					</div>

					<div class="pt-6 mt-6 border-t border-slate-100">
						<div class="inline-block px-3 py-1 rounded-full bg-[#F3F0FF] text-[#7862EA] text-xs font-bold font-mono mb-3">
							{t.stat}
						</div>
						<div class="text-base font-bold text-slate-900">
							{t.author}
						</div>
						<div class="text-xs text-slate-500 font-medium mt-0.5">
							{t.role}
						</div>
						<div class="text-xs text-slate-400 font-normal mt-0.5">
							{t.org}
						</div>
					</div>
				</div>
			{/each}
		</div>

	</div>
</section>
