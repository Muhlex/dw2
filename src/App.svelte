<script lang="ts">
	import Simulation from './lib/Simulation.svelte'
</script>

<main>
	<Simulation />
</main>

<style>
	main {
		flex-grow: 1;
		padding: 1em;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		overflow: hidden;
	}
</style>
