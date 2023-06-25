<script lang="ts">
	import options from "./options";

	import Simulation from "./models/sim/Simulation";
	import Boid from "./models/sim/entities/Boid";

	import SimulationComponent from "./lib/Simulation.svelte";
	import Settings from "./lib/controls/Settings.svelte";
	import Parameters from "./lib/controls/Parameters.svelte";
	import Presets from "./lib/controls/Presets.svelte";

	const simulation = new Simulation();
	simulation.spawnGrid((x, y) => {
		return new Boid({ x, y, ...$options.entities.Boid });
	}, 5, 5);
</script>

<main style:--controls-visible={Number($options.showControls)}>
	<div class="simulation">
		<SimulationComponent {simulation} />
	</div>
	{#if $options.showControls}
		<div class="controls">
			<div class="settings">
				<Settings {simulation} />
			</div>
			<div class="params">
				<Parameters {simulation} />
			</div>
			<div class="presets">
				<Presets {simulation} />
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		flex-grow: 1;
		padding: 1em;

		display: grid;
		grid-template-areas:
			"settings simulation params"
			"settings presets    params";
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1fr auto;
		gap: calc(1em * var(--controls-visible));

		overflow: hidden;
	}

	.simulation {
		grid-area: simulation;
		position: relative;
	}

	.controls {
		display: contents;
	}
	.controls > * {
		z-index: 1;
	}

	.settings, .params {
		margin: -1em;
		padding: 1em;
		min-height: calc(100% + 2em);
		height: 0;
		overflow-y: auto;

		display: flex;
		flex-direction: column;
	}

	.settings {
		grid-area: settings;
		min-width: clamp(160px, 20vw, 320px);
		margin-right: 0;
	}
	.params {
		grid-area: params;
		min-width: clamp(200px, 20vw, 400px);
		margin-left: 0;
		padding-left: 0;
	}

	.presets {
		grid-area: presets;
		display: flex;

		overflow-x: auto;
	}

	/* Cannot use regular justify-content: center due to overflow: */
	.presets :global(> *:first-child) { margin-left: auto; }
	.presets :global(> *:last-child) { margin-right: auto; }
</style>
