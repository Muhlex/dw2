<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { ColorTranslator } from "colortranslator";

	import { targetTps } from "./stores";
	import Simulation from "./models/Simulation";

	import SimulationComponent from "./lib/Simulation.svelte";

	const simulation = new Simulation();
	simulation.spawnGrid();

	const debug: ComponentProps<SimulationComponent>["debug"] = {
		render: {
			avoidanceDelta: false,
			centeringDelta: false,
			matchingDelta: false,
			avoidRadius: false,
			visionRadius: false,
			edgeMargin: false,
		}
	};
</script>

<main>
	<div class="simulation">
		<SimulationComponent {simulation} {debug} />
	</div>
	<div class="controls">
		<div class="settings">
			<button on:click={() => simulation.reset()}>🗑️ Clear</button>
			<button on:click={() => simulation.spawnGrid()}>🔢️ Spawn Grid</button>
			<label>
				TPS Target: {$targetTps}
				<input type="range" bind:value={$targetTps} min=0 max=400 />
			</label>
			<fieldset>
				<legend>Render</legend>
				<div
					style:display="grid"
					style:grid-template-columns="1fr 1fr 1fr"
					style:column-gap="1em"
				>
					{#each Object.entries(debug.render) as [option, value]}
						<label class="row">
							<input
								type="checkbox"
								checked={value}
								on:change={({ currentTarget }) => debug.render[option] = currentTarget.checked}
							>
							{option}
						</label>
					{/each}
				</div>
			</fieldset>
		</div>
		<div class="params">
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
	</div>
</main>

<style>
	main {
		flex-grow: 1;
		padding: 1em;

		display: grid;
		grid-template-areas:
			"simulation params"
			"settings   params";
		grid-template-columns: 1fr auto;
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

	.settings {
		grid-area: settings;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		gap: 1em;
	}

	.params {
		grid-area: params;
		height: 0;
		min-height: 100%;
		overflow-y: auto;

		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	/* Cannot use regular justify-content: center due to overflow-y: */
	.params > *:first-child { margin-top: auto; }
	.params > *:last-child { margin-bottom: auto; }

	label {
		display: flex;
		flex-direction: column;
	}
	label.row {
		flex-direction: row;
		gap: 0.25em;
	}

	input[type="color"] {
		width: 100%;
	}
</style>
