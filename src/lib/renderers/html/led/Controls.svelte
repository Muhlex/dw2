<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";

	import ControlsCanvas from "../../canvas/led/Controls.svelte";
</script>

<ControlsCanvas />
<fieldset>
	<legend>Diffusion</legend>
	<div class="row">
		<label class="row">
			Horizontal:
			<input type="number" bind:value={$renderOptions.diffuse.horizontal} min=0 max=8 step=0.1 size=2 />
		</label>
		<label class="row">
			Vertical:
			<input type="number" bind:value={$renderOptions.diffuse.vertical} min=0 max=8 step=0.1 size=2 />
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
