<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		ringWidth = 3.5,
		class: className = ''
	}: {
		children?: Snippet;
		ringWidth?: number;
		class?: string;
	} = $props();
</script>

<div class="relative flex items-center justify-center {className}">
	<!-- 1. Ambient Breathing Halo Glow -->
	<div
		class="absolute inset-0 rounded-full blur-md opacity-70 animate-pulse pointer-events-none"
		style="background: conic-gradient(from 0deg, #FFD700, #00E5FF, #FF9100, #007AFF, #FFFF00, #FFD700);"
	></div>

	<!-- 2. Rotating Prismatic Conic Gradient Ring (Identik RotatingPrismaticRing.kt) -->
	<div
		class="absolute inset-0 rounded-full animate-spin pointer-events-none"
		style="
			padding: {ringWidth}px;
			background: conic-gradient(from 0deg, #FFD700, #00E5FF, #FF9100, #007AFF, #FFFF00, #FFD700);
			-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			animation-duration: 4.5s;
		"
	></div>

	<!-- 3. Avatar Content Slot -->
	<div class="relative z-10 flex items-center justify-center rounded-full overflow-hidden">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
