<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";

	import ControlsCanvas from "../../canvas/led/Controls.svelte";
</script>

<ControlsCanvas />
<fieldset>
	<legend>WebSockets</legend>
	<label class="row">
		Rate <input type="number" bind:value={$renderOptions.websocket.rate} min=0 max=200 size=1 />
	</label>
</fieldset>
<fieldset>
	<legend>Debug View</legend>
	<label class="row">
		<input type="checkbox" bind:checked={$renderOptions.debug.enable}>
		Enable
	</label>
</fieldset>

<style>
	.row {
		display: flex;
		gap: 1em;
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
		flex-grow: 1;

		flex-direction: row;
		gap: 0.25em;
	}
	label.row input:not([type="checkbox"]) {
		flex-grow: 1;
	}
</style>
