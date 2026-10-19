<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/m/jukir/vehicle/scan');
	});
</script>

<div class="p-8 text-center text-xs text-slate-500">
	Mengalihkan ke pemindai plat...
</div>
