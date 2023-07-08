<script lang="ts">
	import Simulation from "../../models/sim/Simulation";

	import presetGroups from "../../presets";

	export let simulation: Simulation;
</script>

<div class="presets">
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
</div>

<style>
	.presets {
		display: flex;
		gap: 1em;
		align-items: center;
	}

	.form {
		display: flex;
		gap: 4em;
	}

	.group {
		display: flex;
	}

	fieldset {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(2, 1fr);
		gap: 0.5em;
	}
</style>
