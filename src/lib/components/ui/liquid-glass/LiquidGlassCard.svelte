<script lang="ts">
	let {
		class: className = '',
		variant = 'light',
		hasTopGloss = true,
		children
	} = $props<{
		class?: string;
		variant?: 'light' | 'dark' | 'cobalt' | 'ocean';
		hasTopGloss?: boolean;
		children?: import('svelte').Snippet;
	}>();

	const variantStyles = $derived.by(() => {
		switch (variant) {
			case 'dark':
				// Dark Midnight Ocean Card (digunakan di Login, Register, Auth)
				return {
					surface: 'bg-[#0C1E3C]/75 border-[1.4px] border-sky-300/30 text-white shadow-2xl shadow-[#03045E]/50',
					gloss: 'from-white/30 via-white/10 to-transparent',
					prismatic: 'border-[#48CAE4]/40'
				};
			case 'cobalt':
				// Cobalt Card (digunakan untuk highlight active ticket/balance)
				return {
					surface: 'bg-gradient-to-br from-[#0077B6]/90 to-[#023E8A]/95 border-[1.4px] border-white/50 text-white shadow-xl shadow-sky-900/30',
					gloss: 'from-white/45 via-white/15 to-transparent',
					prismatic: 'border-white/40'
				};
			case 'ocean':
				// Ocean Electric Cyan Card
				return {
					surface: 'bg-gradient-to-br from-[#0096C7]/85 to-[#0077B6]/90 border-[1.4px] border-sky-200/60 text-white shadow-xl shadow-sky-900/25',
					gloss: 'from-white/40 via-white/10 to-transparent',
					prismatic: 'border-sky-300/40'
				};
			case 'light':
			default:
				// Light Crystal Glass Card (digunakan di Dashboard Jukir & Customer)
				return {
					surface: 'bg-white/70 dark:bg-zinc-900/75 border-[1.4px] border-white/90 dark:border-white/10 text-slate-900 dark:text-white shadow-xl shadow-sky-950/5',
					gloss: 'from-white/60 via-white/20 to-transparent',
					prismatic: 'border-[#ADE8F4]/60'
				};
		}
	});
</script>

<div
	class="relative overflow-hidden rounded-[24px] backdrop-blur-xl transition-all duration-300 {variantStyles.surface} {className}"
>
	<!-- Top Specular Gloss Sheen -->
	{#if hasTopGloss}
		<div
			class="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b {variantStyles.gloss}"
		></div>
	{/if}

	<!-- Liquid Glass Prismatic Rim Highlights -->
	<div class="pointer-events-none absolute inset-0 rounded-[24px] border border-white/20"></div>

	<!-- Card Content (100% crisp without blur) -->
	<div class="relative z-10">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
