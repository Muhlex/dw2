<script lang="ts">
	import { renderOptions } from "./Renderer.svelte";

	$: renderDebugKeys = Object.keys($renderOptions.debug) as (keyof typeof $renderOptions.debug)[];
</script>

<div
	style:display="grid"
	style:grid-template-columns="1fr 1fr"
	style:column-gap="1em"
>
	{#each renderDebugKeys as option}
		<label>
			<input type="checkbox" bind:checked={$renderOptions.debug[option]}>
			{option}
		</label>
	{/each}
</div>
