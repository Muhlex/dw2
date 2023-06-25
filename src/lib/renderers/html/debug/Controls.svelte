<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";

	$: debugKeys = Object.keys($renderOptions.debug) as (keyof typeof $renderOptions.debug)[];
</script>

<fieldset
	style:display=flex
	style:flex-direction=column
	style:gap=0.25em
>
	<legend>Debug</legend>
	{#each debugKeys as option}
		<label>
			<input type="checkbox" bind:checked={$renderOptions.debug[option]}>
			{option}
		</label>
	{/each}
</fieldset>
