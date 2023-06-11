<script lang="ts">
	import { ColorTranslator } from "colortranslator";

	import options, { resetBoids, resetAttractors } from "./options";

	import Simulation from "./models/Simulation";
  import Boid from "./models/Boid";

	import SimulationComponent from "./lib/Simulation.svelte";

	const simulation = new Simulation();
	simulation.spawnGrid((x, y) => new Boid({x, y, ...$options.boids}), 5, 5);

	$: renderDebugKeys = Object.keys($options.render.debug) as (keyof typeof $options.render.debug)[];
</script>

<main>
	<div class="simulation">
		<SimulationComponent {simulation} />
	</div>
	<div class="controls">
		<div class="settings">
			<button on:click={() => simulation.killAll()}>
				🗑️ Clear
			</button>
			<button on:click={() => simulation.spawnGrid((x, y) => new Boid({x, y, ...$options.boids}))}>
				🔢️ Spawn Grid
			</button>
			<label>
				TPS Target: {$options.render.targetTps}
				<input type="range" bind:value={$options.render.targetTps} min=0 max=400 />
			</label>
			<fieldset>
				<legend>Render</legend>
				<div
					style:display="grid"
					style:grid-template-columns="1fr 1fr 1fr"
					style:column-gap="1em"
				>
					{#each renderDebugKeys as option}
						<label class="row">
							<input type="checkbox" bind:checked={$options.render.debug[option]}>
							{option}
						</label>
					{/each}
				</div>
			</fieldset>
		</div>
		<div class="params">
			<div class="group">
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
			<div class="group">
				<h3>Boids</h3>
				<fieldset>
					<legend>Appearance</legend>
					<label>
						color:
						<input
							type="color"
							value={ColorTranslator.toHEX($options.boids.color)}
							on:change={({ currentTarget }) => $options.boids.color = currentTarget.value}
						/>
					</label>
					<label>
						size: {$options.boids.size}
						<input type="range" bind:value={$options.boids.size} min=1 max=100 step=1 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Speed</legend>
					<label>
						min: {$options.boids.minSpeed.toFixed(1)}
						<input type="range" bind:value={$options.boids.minSpeed} min=0 max=10 step=0.1 />
					</label>
					<label>
						max: {$options.boids.maxSpeed.toFixed(1)}
						<input type="range" bind:value={$options.boids.maxSpeed} min=0 max=25 step=0.1 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Avoidance</legend>
					<label>
						radius: {$options.boids.avoidRadius}
						<input type="range" bind:value={$options.boids.avoidRadius} min=0 max=250 step=1 />
					</label>
					<label>
						factor: {$options.boids.avoidFactor.toFixed(3)}
						<input type="range" bind:value={$options.boids.avoidFactor} min=0 max=0.1 step=0.001 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Vision</legend>
					<label>
						radius: {$options.boids.visionRadius}
						<input type="range" bind:value={$options.boids.visionRadius} min=0 max=500 step=1 />
					</label>
					<label>
						centeringFactor: {$options.boids.centeringFactor.toFixed(4)}
						<input type="range" bind:value={$options.boids.centeringFactor} min=0 max=0.005 step=0.0001 />
					</label>
					<label>
						matchingFactor: {$options.boids.matchingFactor.toFixed(3)}
						<input type="range" bind:value={$options.boids.matchingFactor} min=0 max=0.5 step=0.001 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Edge Avoidance</legend>
					<label>
						margin: {$options.boids.edgeMargin}
						<input
							type="range" bind:value={$options.boids.edgeMargin}
							min=0 max={Math.min($simulation.world.size.x, $simulation.world.size.y) / 2} step=1
						/>
					</label>
					<label>
						turnFactor: {$options.boids.edgeTurnFactor.toFixed(2)}
						<input type="range" bind:value={$options.boids.edgeTurnFactor} min=0 max=1 step=0.01 />
					</label>
				</fieldset>
				<button on:click={() => {
					simulation.getEntitiesOfClass(Boid).forEach(boid => Object.assign(boid, $options.boids))
				}}>
					✔️ Apply to All
				</button>
				<button on:click={resetBoids} style:font-size=0.75em>
					🔄 Reset
				</button>
			</div>
			<div class="group">
				<h3>Attractors</h3>
				<fieldset>
					<legend>Attraction / Repulsion</legend>
					<label>
						radius: {$options.attractors.radius}
						<input type="range" bind:value={$options.attractors.radius} min=20 max=2000 step=5 />
					</label>
					<label>
						strength: {$options.attractors.strength.toFixed(4)}
						<input type="range" bind:value={$options.attractors.strength} min=-0.004 max=0.004 step=0.0001 />
					</label>
					<label class="row">
						<input type="checkbox" bind:checked={$options.attractors.inverse}>
						inverse
					</label>
				</fieldset>
				<button on:click={resetAttractors} style:font-size=0.75em>🔄 Reset</button>
			</div>
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
		align-items: flex-end;
		gap: 1em;
	}

	.params {
		grid-area: params;
		height: 0;
		min-height: 100%;
		overflow-y: auto;
		min-width: clamp(200px, 25vw, 400px);

		display: flex;
		flex-direction: column;
		gap: 4em;
	}
	/* Cannot use regular justify-content: center due to overflow-y: */
	.params > *:first-child { margin-top: auto; }
	.params > *:last-child { margin-bottom: auto; }

	.params .group {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

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
