<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";

	$: debugKeys = Object.keys($renderOptions.debug) as (keyof typeof $renderOptions.debug)[];
</script>

<fieldset
	style:display=flex
	style:flex-direction=column
	style:gap=0.25em
>
	<legend>Enable Views</legend>
	{#each debugKeys as option}
		<label class="row">
			<input type="checkbox" bind:checked={$renderOptions.debug[option]}>
			{option}
		</label>
	{/each}
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
