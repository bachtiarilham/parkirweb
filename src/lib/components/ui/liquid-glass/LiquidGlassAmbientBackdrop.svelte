<script lang="ts">
	let { children } = $props<{ children?: import('svelte').Snippet }>();
</script>

<!-- SVG Displacement Filter for Danilo Fiumi Liquid Glass -->
<svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
	<defs>
		<filter id="lg-dist-light" x="0%" y="0%" width="100%" height="100%">
			<feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
			<feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
			<feDisplacementMap in="SourceGraphic" in2="blurred" scale="180" xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</defs>
</svg>

<div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-gradient-to-b from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1]">
	<!-- Orb 1: Rich Cyan/Blue di kanan atas -->
	<div
		class="absolute top-[8%] -right-16 w-72 h-72 rounded-full blur-3xl opacity-45 bg-[#00B4D8]"
	></div>

	<!-- Orb 2: Soft Cobalt di kiri tengah -->
	<div
		class="absolute top-[40%] -left-20 w-80 h-80 rounded-full blur-3xl opacity-35 bg-[#0077B6]"
	></div>

	<!-- Orb 3: Subtle Crystal Ice di bawah -->
	<div
		class="absolute -bottom-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-35 bg-[#0096C7]"
	></div>

	<!-- Orb 4: Soft Sky Glow di area profil atas -->
	<div
		class="absolute top-2 left-1/3 w-60 h-60 rounded-full blur-3xl opacity-30 bg-[#38BDF8]"
	></div>
</div>

{#if children}
	{@render children()}
{/if}
