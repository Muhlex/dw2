<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";

	import ControlsCanvas from "../../canvas/led/Controls.svelte";
</script>

<ControlsCanvas />
<fieldset>
	<legend>WebSocket</legend>
	<label class="row">
		URL:
		<input bind:value={$renderOptions.websocket.url} />
	</label>
</fieldset>
<fieldset>
<legend>Data</legend>
	<label class="row">
		Color component range:
		<input type="number" bind:value={$renderOptions.data.componentMaxValue} min=1 step=1 size=4 />
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
