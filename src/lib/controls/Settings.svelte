<script lang="ts">
	import options, { renderers } from "../../options";

	import type Simulation from "../../models/sim/Simulation";
	import Boid from "../../models/sim/entities/Boid";
	import Attractor from "../../models/sim/entities/Attractor";

	export let simulation: Simulation;

	$: placeable = [Boid, Attractor];
	$: gridSize = { x: 5, y: 5 };
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
		Renderer
		<select bind:value={$options.renderer}>
			{#each renderers as renderer}
				<option value={renderer}>{renderer.name}</option>
			{/each}
		</select>
	</label>
	<label>
		TPS Target: {$options.targetTps}
		<input type="range" bind:value={$options.targetTps} min=0 max=200 />
	</label>
</fieldset>
{#if $options.renderer.component}
	<fieldset>
		<legend>Renderer Options ({$options.renderer.name})</legend>
		<svelte:component this={$options.renderer.controls} />
	</fieldset>
{/if}

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
