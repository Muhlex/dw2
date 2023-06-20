<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";
</script>

<fieldset>
	<legend>Matrix ({$renderOptions.grid.cols * $renderOptions.grid.rows} LEDs)</legend>
	<div style:display=flex style:gap=1em>
		<label>
			Cols: <input type="number" bind:value={$renderOptions.grid.cols} min=1 max=50 size=2 />
		</label>
		<label>
			Rows: <input type="number" bind:value={$renderOptions.grid.rows} min=1 max=50 size=2 />
		</label>
	</div>
</fieldset>
<fieldset>
	<legend>Boids</legend>
	<div style:display=flex style:gap=1em>
		<label>
			Scale:
			<input type="number" bind:value={$renderOptions.boids.scale} min=1 max=10 step="0.2" size=3 />
		</label>
		<label>
			Intensity:
			<input type="number" bind:value={$renderOptions.boids.intensity} min=0 max=2 step=0.05 size=4 />
		</label>
	</div>
</fieldset>
