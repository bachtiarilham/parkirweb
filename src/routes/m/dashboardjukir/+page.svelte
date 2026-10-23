<script lang="ts">
	import JukirDashboard from '../jukir/+page.svelte';

	let { data } = $props();
</script>

<JukirDashboard {data} />
