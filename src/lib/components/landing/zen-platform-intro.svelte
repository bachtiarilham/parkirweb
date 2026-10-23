<script lang="ts">
	let selectedRole = $state('GENERAL MANAGER MALL & GEDUNG');

	const roles = [
		'KEPALA DINAS PERHUBUNGAN',
		'GENERAL MANAGER MALL & GEDUNG',
		'OPERATOR & VENDOR PARKIR',
		'AUDITOR KEUANGAN & PAD',
		'KEPALA TEKNOLOGI & IT INFRA'
	];
</script>

<!-- Zenarate 1:1 Platform Transition & Role Selector Pills (Screenshot 3) -->
<section class="py-24 bg-white text-slate-900 border-t border-slate-100 text-center">
	<div class="mx-auto max-w-4xl px-4 space-y-8">
		
		<!-- Editorial Serif Headline with Italics -->
		<h2 class="font-editorial text-4xl sm:text-6xl text-slate-900 tracking-tight leading-[1.12]">
			The <span class="italic font-light">frontline performance</span> platform for humans and AI
		</h2>

		<!-- Filter Role Pills Row -->
		<div class="flex flex-wrap items-center justify-center gap-2 pt-2">
			{#each roles as role}
				<button
					type="button"
					onclick={() => (selectedRole = role)}
					class="px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest font-bold uppercase transition cursor-pointer {selectedRole === role
						? 'bg-slate-900 text-white shadow-xs'
						: 'bg-slate-100 hover:bg-slate-200 text-slate-600'}"
				>
					{role}
				</button>
			{/each}
		</div>

	</div>
</section>
