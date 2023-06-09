<script lang="ts">
	import { ColorTranslator } from 'colortranslator';

	import { targetTps } from "./stores";
	import Simulation from "./models/Simulation";

	import SimulationComponent from "./lib/Simulation.svelte";

	const simulation = new Simulation();
	simulation.spawnGrid();

	const debug = {
		avoidanceDelta: false,
		centeringDelta: false,
		matchingDelta: false,
		avoidRadius: false,
		visionRadius: false,
		edgeMargin: false,
	};
</script>

<main>
	<div class="controls-meta">
		<button on:click={() => simulation.reset()}>🗑️ Clear</button>
		<button on:click={() => simulation.spawnGrid()}>🔢️ Spawn Grid</button>
		<label>
			TPS Target: {$targetTps}
			<input type="range" bind:value={$targetTps} min=0 max=400 />
		</label>
		<label>
			Render debug views:
			<select multiple on:change={event => {
				for (const option of event.currentTarget.options) {
					debug[option.value] = option.selected;
				}
			}}>
				{#each Object.keys(debug) as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>
	</div>
	<div class="simulation">
		<SimulationComponent {simulation} {debug} />
	</div>
	<div class="controls-boid">
		<h3>Boids</h3>
		<fieldset>
			<legend>Appearance</legend>
			<label>
				color:
				<input
					type="color"
					value={ColorTranslator.toHEX($simulation.boidsConfig.color)}
					on:change={({ currentTarget }) => $simulation.boidsConfig.color = currentTarget.value}
				/>
			</label>
			<label>
				size: {$simulation.boidsConfig.size}
				<input type="range" bind:value={$simulation.boidsConfig.size} min=1 max=100 step=1 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Speed</legend>
			<label>
				min: {$simulation.boidsConfig.minSpeed.toFixed(1)}
				<input type="range" bind:value={$simulation.boidsConfig.minSpeed} min=0 max=10 step=0.1 />
			</label>
			<label>
				max: {$simulation.boidsConfig.maxSpeed.toFixed(1)}
				<input type="range" bind:value={$simulation.boidsConfig.maxSpeed} min=0 max=25 step=0.1 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Avoidance</legend>
			<label>
				radius: {$simulation.boidsConfig.avoidRadius}
				<input type="range" bind:value={$simulation.boidsConfig.avoidRadius} min=0 max=250 step=1 />
			</label>
			<label>
				factor: {$simulation.boidsConfig.avoidFactor.toFixed(3)}
				<input type="range" bind:value={$simulation.boidsConfig.avoidFactor} min=0 max=0.1 step=0.001 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Vision</legend>
			<label>
				radius: {$simulation.boidsConfig.visionRadius}
				<input type="range" bind:value={$simulation.boidsConfig.visionRadius} min=0 max=500 step=1 />
			</label>
			<label>
				centeringFactor: {$simulation.boidsConfig.centeringFactor.toFixed(4)}
				<input type="range" bind:value={$simulation.boidsConfig.centeringFactor} min=0 max=0.005 step=0.0001 />
			</label>
			<label>
				matchingFactor: {$simulation.boidsConfig.matchingFactor}
				<input type="range" bind:value={$simulation.boidsConfig.matchingFactor} min=0 max=0.5 step=0.001 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Edge Avoidance</legend>
			<label>
				margin: {$simulation.boidsConfig.edgeMargin}
				<input
					type="range" bind:value={$simulation.boidsConfig.edgeMargin}
					min=0 max={Math.min($simulation.world.size.x, $simulation.world.size.y) / 2} step=1
				/>
			</label>
			<label>
				turnFactor: {$simulation.boidsConfig.edgeTurnFactor.toFixed(2)}
				<input type="range" bind:value={$simulation.boidsConfig.edgeTurnFactor} min=0 max=1 step=0.01 />
			</label>
		</fieldset>
		<button on:click={() => simulation.applyConfig()}>✔️ Apply to All</button>
		<button on:click={() => simulation.resetConfig()} style:font-size=0.75em>🔄 Reset</button>
	</div>
	<div class="controls-world">
		<h3>World</h3>
		<fieldset>
			<legend>Size</legend>
			<label>
				x
				<input type="number" bind:value={$simulation.world.size.x} min=0 max=10000 step=1 />
			</label>
			<label>
				y
				<input type="number" bind:value={$simulation.world.size.y} min=0 max=10000 step=1 />
			</label>
		</fieldset>
	</div>
</main>

<style>
	main {
		flex-grow: 1;
		padding: 1em;

		display: grid;
		grid-template-areas:
			"world sim  boid"
			"world meta boid";
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1fr auto;
		gap: 1em;

		overflow: hidden;
	}

	@media (max-width: 800px) {
		main {
			display: flex;
			flex-direction: column;
			gap: 4em;
		}

		.simulation {
			flex-basis: calc(100vh - 2 * 1em);
		}
	}

	.simulation {
		grid-area: sim;
		position: relative;
	}

	.controls-meta {
		grid-area: meta;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		gap: 1em;
	}

	.controls-world, .controls-boid {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1em;
	}

	.controls-world {
		grid-area: world;
	}

	.controls-boid {
		grid-area: boid;
	}

	label {
		display: flex;
		flex-direction: column;
	}

	fieldset {
		min-width: 240px;
	}

	input[type="color"] {
		width: 100%;
	}
</style>
