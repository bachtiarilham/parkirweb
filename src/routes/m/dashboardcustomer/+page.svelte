<script lang="ts">
	import CustomerDashboard from '../customer/+page.svelte';

	let { data } = $props();
</script>

<CustomerDashboard {data} />
