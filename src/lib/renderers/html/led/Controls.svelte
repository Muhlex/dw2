<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";
</script>

<fieldset>
	<legend>Matrix ({$renderOptions.grid.cols * $renderOptions.grid.rows} LEDs)</legend>
	<div class="row">
		<label class="row">
			Cols: <input type="number" bind:value={$renderOptions.grid.cols} min=1 max=50 size=2 />
		</label>
		<label class="row">
			Rows: <input type="number" bind:value={$renderOptions.grid.rows} min=1 max=50 size=2 />
		</label>
	</div>
</fieldset>
<fieldset>
	<legend>Boids</legend>
	<div class="row">
		<label class="row">
			Scale:
			<input type="number" bind:value={$renderOptions.boids.scale} min=1 max=10 step="0.2" size=3 />
		</label>
		<label class="row">
			Intensity:
			<input type="number" bind:value={$renderOptions.boids.intensity} min=0 max=2 step=0.05 size=4 />
		</label>
	</div>
</fieldset>

<style>
	.row {
		display: flex;
		gap: 1em;
	}

	label {
		display: flex;
		flex-direction: column;
	}
	label.row {
		flex-grow: 1;

		flex-direction: row;
		gap: 0.25em;
	}
	label.row input:not([type="checkbox"]) {
		flex-grow: 1;
	}
</style>
