<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/m/settings/profile');
	});
</script>

<div class="p-8 text-center text-xs text-slate-500">
	Mengalihkan ke pengaturan profil...
</div>
