<script lang="ts">
	import { ColorTranslator } from "colortranslator";

	import options from "./options";

	import Simulation from "./models/sim/Simulation";
  import Boid from "./models/sim/entities/Boid";
  import Attractor from "./models/sim/entities/Attractor";

	import SimulationComponent from "./lib/Simulation.svelte";

	$: placeable = [Boid, Attractor];
	$: gridSize = { x: 5, y: 5 };
	$: renderDebugKeys = Object.keys($options.render.debug) as (keyof typeof $options.render.debug)[];

	const simulation = new Simulation();
	simulation.spawnGrid((x, y) => {
		return new Boid({
			x, y, ...$options.entities.defaults.get($options.entities.selected.constructor)
		});
	}, 5, 5);
</script>

<main>
	<div class="simulation">
		<SimulationComponent {simulation} />
	</div>
	<div class="controls">
		<div class="settings">
			<fieldset class="row">
				<legend>Entities</legend>
				<fieldset>
					<legend>Class</legend>
					<select bind:value={$options.entities.selected.constructor}>
						{#each placeable as constructor}
							<option value={constructor}>{constructor.className}</option>
						{/each}
					</select>
					<button on:click={() => simulation.killAllOfClass($options.entities.selected.constructor)}>
						🗑️ Clear
					</button>
				</fieldset>
				<fieldset>
					<legend>Grid ({$options.entities.selected.constructor.className})</legend>
					<div style:display=flex style:gap=1em>
						<label class="row">
							Cols: <input type="number" bind:value={gridSize.x} min=1 max=15 size=2 />
						</label>
						<label class="row">
							Rows: <input type="number" bind:value={gridSize.y} min=1 max=15 size=2 />
						</label>
					</div>
					<button on:click={() => {
						simulation.spawnGrid((x, y) => {
							return new $options.entities.selected.constructor({
								x, y, ...$options.entities.defaults.get($options.entities.selected.constructor)
							});
						}, gridSize.x, gridSize.y);
					}}>
						🔢️ Spawn Grid
					</button>
				</fieldset>
				<button on:click={() => simulation.killAll()}>
					💀 Clear All
				</button>
			</fieldset>
			<fieldset>
				<legend>Simulation</legend>
				<label>
					TPS Target: {$options.targetTps}
					<input type="range" bind:value={$options.targetTps} min=0 max=200 />
				</label>
			</fieldset>
			<fieldset>
				<legend>Render</legend>
				<div
					style:display="grid"
					style:grid-template-columns="1fr 1fr"
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
					<label class="row">
						x
						<input type="number" bind:value={$simulation.world.size.x} min=0 max=10000 step=1 />
					</label>
					<label class="row">
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
							value={ColorTranslator.toHEX($options.entities.defaults.values.Boid.color)}
							on:change={({ currentTarget }) => $options.entities.defaults.values.Boid.color = currentTarget.value}
						/>
					</label>
					<label>
						size: {$options.entities.defaults.values.Boid.size}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.size} min=1 max=100 step=1 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Speed</legend>
					<label>
						min: {$options.entities.defaults.values.Boid.minSpeed.toFixed(1)}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.minSpeed} min=0 max=10 step=0.1 />
					</label>
					<label>
						max: {$options.entities.defaults.values.Boid.maxSpeed.toFixed(1)}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.maxSpeed} min=0 max=25 step=0.1 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Avoidance</legend>
					<label>
						radius: {$options.entities.defaults.values.Boid.avoidRadius}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.avoidRadius} min=0 max=250 step=1 />
					</label>
					<label>
						factor: {$options.entities.defaults.values.Boid.avoidFactor.toFixed(3)}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.avoidFactor} min=0 max=0.1 step=0.001 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Vision</legend>
					<label>
						radius: {$options.entities.defaults.values.Boid.visionRadius}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.visionRadius} min=0 max=500 step=1 />
					</label>
					<label>
						centeringFactor: {$options.entities.defaults.values.Boid.centeringFactor.toFixed(4)}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.centeringFactor} min=0 max=0.005 step=0.0001 />
					</label>
					<label>
						matchingFactor: {$options.entities.defaults.values.Boid.matchingFactor.toFixed(3)}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.matchingFactor} min=0 max=0.5 step=0.001 />
					</label>
				</fieldset>
				<fieldset>
					<legend>Edge Avoidance</legend>
					<label>
						margin: {$options.entities.defaults.values.Boid.edgeMargin}
						<input
							type="range" bind:value={$options.entities.defaults.values.Boid.edgeMargin}
							min=0 max={Math.min($simulation.world.size.x, $simulation.world.size.y) / 2} step=1
						/>
					</label>
					<label>
						turnFactor: {$options.entities.defaults.values.Boid.edgeTurnFactor.toFixed(2)}
						<input type="range" bind:value={$options.entities.defaults.values.Boid.edgeTurnFactor} min=0 max=1 step=0.01 />
					</label>
				</fieldset>
				<button on:click={() => {
					simulation.entities.get(Boid).forEach(boid => boid.applyOptions($options.entities.defaults.values.Boid))
				}}>
					✔️ Apply to All
				</button>
				<button on:click={() => $options.entities.defaults.reset(Boid)} style:font-size=0.75em>
					🔄 Reset
				</button>
			</div>
			<div class="group">
				<h3>Attractors</h3>
				<fieldset>
					<legend>Attraction / Repulsion</legend>
					<label>
						radius start: {$options.entities.defaults.values.Attractor.radius.start}
						<input type="range" bind:value={$options.entities.defaults.values.Attractor.radius.start} min=0 max=2000 step=5 />
					</label>
					<label>
						radius end: {$options.entities.defaults.values.Attractor.radius.end}
						<input type="range" bind:value={$options.entities.defaults.values.Attractor.radius.end} min=0 max=2000 step=5 />
					</label>
					<label>
						strength start: {$options.entities.defaults.values.Attractor.strength.start.toFixed(2)}
						<input type="range" bind:value={$options.entities.defaults.values.Attractor.strength.start} min=-2 max=2 step=0.05 />
					</label>
					<label>
						strength end: {$options.entities.defaults.values.Attractor.strength.end.toFixed(2)}
						<input type="range" bind:value={$options.entities.defaults.values.Attractor.strength.end} min=-2 max=2 step=0.05 />
					</label>
				</fieldset>
				<button on:click={() => {
					simulation.entities.get(Attractor).forEach(attractor => attractor.applyOptions($options.entities.defaults.values.Attractor))
				}}>
					✔️ Apply to All
				</button>
				<button on:click={() => $options.entities.defaults.reset(Attractor)} style:font-size=0.75em>🔄 Reset</button>
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

	.params {
		grid-area: params;
		margin: -1em;
		padding: 1em;
		margin-left: 0;
		padding-left: 0;
		min-height: calc(100% + 2em);
		height: 0;
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

	fieldset {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
	}
	fieldset.row {
		flex-direction: row;
		gap: 1em;
	}

	label {
		display: flex;
		flex-direction: column;
	}
	label.row {
		flex-direction: row;
		gap: 0.25em;
	}
	label.row input:not([type="checkbox"]) {
		flex-grow: 1;
	}

	input[type="color"] {
		width: 100%;
	}
</style>
