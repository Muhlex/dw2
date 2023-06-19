<script lang="ts">
	import options from "../../options";

	import type Simulation from "../../models/sim/Simulation";
	import Boid from "../../models/sim/entities/Boid";
	import Attractor from "../../models/sim/entities/Attractor";

	export let simulation: Simulation;

	$: placeable = [Boid, Attractor];
	$: gridSize = { x: 5, y: 5 };
	$: renderDebugKeys = Object.keys($options.render.debug) as (keyof typeof $options.render.debug)[];
</script>

<fieldset class="row">
	<legend>Entities</legend>
	<fieldset>
		<legend>Class</legend>
		<select bind:value={$options.entities.selected}>
			{#each placeable as constructor}
				<option value={constructor}>{constructor.className}</option>
			{/each}
		</select>
		<button on:click={() => simulation.killAllOfClass($options.entities.selected)}>
			🗑️ Clear
		</button>
	</fieldset>
	<fieldset>
		<legend>Grid ({$options.entities.selected.className})</legend>
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
				return new $options.entities.selected({
					x, y, ...$options.entities[$options.entities.selected.className]
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

<style>
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
</style>
