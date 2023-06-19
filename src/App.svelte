<script lang="ts">
	import options from "./options";

	import Simulation from "./models/sim/Simulation";
	import Boid from "./models/sim/entities/Boid";

	import SimulationComponent from "./lib/Simulation.svelte";
	import Parameters from "./lib/controls/Parameters.svelte";
  import Presets from "./lib/controls/Presets.svelte";
	import Settings from "./lib/controls/Settings.svelte";

	const simulation = new Simulation();
	simulation.spawnGrid((x, y) => {
		return new Boid({ x, y, ...$options.entities.Boid });
	}, 5, 5);
</script>

<main>
	<div class="simulation">
		<SimulationComponent {simulation} />
	</div>
	<div class="controls">
		<div class="side params">
			<Parameters {simulation} />
		</div>
		<div class="side presets">
			<Presets {simulation} />
		</div>
		<div class="settings">
			<Settings {simulation} />
		</div>
	</div>
</main>

<style>
	main {
		flex-grow: 1;
		padding: 1em;

		display: grid;
		grid-template-areas:
			"presets  simulation params"
			"settings settings   params";
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1fr auto;
		gap: 1em;

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

	.settings {
		grid-area: settings;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1em;
	}

	.side {
		margin: -1em;
		padding: 1em;
		min-height: calc(100% + 2em);
		height: 0;
		overflow-y: auto;

		display: flex;
		flex-direction: column;
	}
	.params {
		grid-area: params;
		min-width: clamp(200px, 25vw, 400px);
		margin-left: 0;
		padding-left: 0;
	}
	.presets {
		grid-area: presets;
		min-width: clamp(120px, 25vw, 200px);
		margin-right: 0;
		padding-right: 0;
	}

	/* Cannot use regular justify-content: center due to overflow-y: */
	.side :global(> *:first-child) { margin-top: auto; }
	.side :global(> *:last-child) { margin-bottom: auto; }
</style>
