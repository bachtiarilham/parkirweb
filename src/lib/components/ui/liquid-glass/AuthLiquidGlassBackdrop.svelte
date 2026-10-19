<script lang="ts">
	let { children } = $props<{ children?: import('svelte').Snippet }>();
</script>

<!-- SVG Displacement Filter for Danilo Fiumi Liquid Glass -->
<svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
	<defs>
		<filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
			<feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
			<feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
			<feDisplacementMap in="SourceGraphic" in2="blurred" scale="230" xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</defs>
</svg>

<div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-gradient-to-b from-[#03045E] via-[#021B4D] to-[#011129]">
	<!-- Orb 1: Vibrant Electric Cyan di kanan atas -->
	<div
		class="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] animate-pulse"
		style="animation-duration: 6s;"
	></div>

	<!-- Orb 2: Deep Sapphire Glow di kiri tengah -->
	<div
		class="absolute top-1/2 -left-20 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-35 bg-gradient-to-tr from-[#0096C7] to-[#023E8A] animate-pulse"
		style="animation-duration: 8s;"
	></div>

	<!-- Orb 3: Subtle Ocean Tint di bawah -->
	<div
		class="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-25 bg-gradient-to-t from-[#48CAE4] to-transparent"
	></div>
</div>

{#if children}
	{@render children()}
{/if}
