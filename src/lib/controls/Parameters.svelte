<script lang="ts">
	import { ColorTranslator } from "colortranslator";

	import options, { defaults } from "../../options";

	import type Simulation from "../../models/sim/Simulation";
	import Boid from "../../models/sim/entities/Boid";
	import Attractor from "../../models/sim/entities/Attractor";
	import AttractorLine from "../../models/sim/entities/AttractorLine";

	export let simulation: Simulation;
</script>

<h2>Parameters</h2>
<div class="form">

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
					value={ColorTranslator.toHEX($options.entities.Boid.color)}
					on:change={({ currentTarget }) => $options.entities.Boid.color = currentTarget.value}
				/>
			</label>
			<label>
				size: {$options.entities.Boid.size}
				<input type="range" bind:value={$options.entities.Boid.size} min=1 max=100 step=1 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Speed</legend>
			<label>
				min: {$options.entities.Boid.minSpeed.toFixed(1)}
				<input type="range" bind:value={$options.entities.Boid.minSpeed} min=0 max=10 step=0.1 />
			</label>
			<label>
				max: {$options.entities.Boid.maxSpeed.toFixed(1)}
				<input type="range" bind:value={$options.entities.Boid.maxSpeed} min=0 max=25 step=0.1 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Avoidance</legend>
			<label>
				radius: {$options.entities.Boid.avoidRadius}
				<input type="range" bind:value={$options.entities.Boid.avoidRadius} min=0 max=250 step=1 />
			</label>
			<label>
				factor: {$options.entities.Boid.avoidFactor.toFixed(3)}
				<input type="range" bind:value={$options.entities.Boid.avoidFactor} min=0 max=0.1 step=0.001 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Vision</legend>
			<label>
				radius: {$options.entities.Boid.visionRadius}
				<input type="range" bind:value={$options.entities.Boid.visionRadius} min=0 max=500 step=1 />
			</label>
			<label>
				centeringFactor: {$options.entities.Boid.centeringFactor.toFixed(4)}
				<input type="range" bind:value={$options.entities.Boid.centeringFactor} min=0 max=0.005 step=0.0001 />
			</label>
			<label>
				matchingFactor: {$options.entities.Boid.matchingFactor.toFixed(3)}
				<input type="range" bind:value={$options.entities.Boid.matchingFactor} min=0 max=0.5 step=0.001 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Edge Avoidance</legend>
			<label>
				margin: {$options.entities.Boid.edgeMargin}
				<input
					type="range" bind:value={$options.entities.Boid.edgeMargin}
					min=0 max={Math.min($simulation.world.size.x, $simulation.world.size.y) / 2} step=1
				/>
			</label>
			<label>
				turnFactor: {$options.entities.Boid.edgeTurnFactor.toFixed(2)}
				<input type="range" bind:value={$options.entities.Boid.edgeTurnFactor} min=0 max=1 step=0.01 />
			</label>
		</fieldset>
		<fieldset>
			<legend>Physical Prototype</legend>
			<label class="row">
				<input type="checkbox" bind:checked={$options.entities.Boid.prototypeTweaks}>
				Enable tweaks
			</label>
		</fieldset>
		<button on:click={() => {
			simulation.entities.get(Boid).forEach(boid => boid.applyOptions($options.entities.Boid));
		}}>
			✔️ Apply to All
		</button>
		<button on:click={() => $options.entities.Boid = defaults.getBoid()} style:font-size=0.75em>
			🔄 Reset
		</button>
	</div>
	<div class="group">
		<h3>Attractors</h3>
		<fieldset>
			<legend>Attraction / Repulsion</legend>
			<label>
				radius start: {$options.entities.Attractor.radius.start}
				<input type="range" bind:value={$options.entities.Attractor.radius.start} min=0 max=2000 step=5 />
			</label>
			<label>
				radius end: {$options.entities.Attractor.radius.end}
				<input type="range" bind:value={$options.entities.Attractor.radius.end} min=0 max=2000 step=5 />
			</label>
			<label>
				strength start: {$options.entities.Attractor.strength.start.toFixed(2)}
				<input type="range" bind:value={$options.entities.Attractor.strength.start} min=-2 max=2 step=0.05 />
			</label>
			<label>
				strength end: {$options.entities.Attractor.strength.end.toFixed(2)}
				<input type="range" bind:value={$options.entities.Attractor.strength.end} min=-2 max=2 step=0.05 />
			</label>
		</fieldset>
		<button on:click={() => {
			[...simulation.entities.get(Attractor), ...simulation.entities.get(AttractorLine)]
				.forEach(attractor => attractor.applyOptions($options.entities.Attractor));
		}}>
			✔️ Apply to All
		</button>
		<button on:click={() => $options.entities.Attractor = defaults.getAttractor()} style:font-size=0.75em>
			🔄 Reset
		</button>
	</div>
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 4em;
		margin-top: 1em;
	}

	.group {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	fieldset {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
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
