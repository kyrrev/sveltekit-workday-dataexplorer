<script>
	import '../app.css';
	import Spinner from '$lib/+Spinner.svelte';
	import { navigating } from '$app/stores';
</script>

<header />

{#if Boolean($navigating)}
	<div class="fixed inset-0 flex items-center justify-center">
		<Spinner />
	</div>
{/if}

<div class="p-8 max-w-7xl mx-auto">
	<slot />
</div>
