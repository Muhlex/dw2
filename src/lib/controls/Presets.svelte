<script lang="ts">
	import Simulation from "../../models/sim/Simulation";

	import presetGroups from "../../presets";

	export let simulation: Simulation;
</script>

<h2>Presets</h2>
<div class="form">
	<div class="group">
		{#each Object.entries(presetGroups) as [group, presets]}
			<fieldset>
				<legend>{group}</legend>
				{#each Object.entries(presets) as [name, func]}
					<button on:click={() => func(simulation)}>{name}</button>
				{/each}
			</fieldset>
		{/each}
	</div>
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 4em;
		margin-top: 1em;
	}

	fieldset {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8ch, 1fr));
		gap: 0.5em;
	}
</style>
