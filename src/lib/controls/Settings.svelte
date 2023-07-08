<script lang="ts">
	import options from "../../options";
	import rendererGroups, { getRendererGroup } from "../../renderers";
	import { websockets, connect } from "../../websockets";

	import type Simulation from "../../models/sim/Simulation";
	import Boid from "../../models/sim/entities/Boid";
	import Attractor from "../../models/sim/entities/Attractor";
	import AttractorLine from "../../models/sim/entities/AttractorLine";

	export let simulation: Simulation;

	$: placeable = [Boid, Attractor, AttractorLine];
	$: gridSize = { x: 5, y: 5 };

	let websocketConnectURL = "ws://192.168";
	$: websocketsArray = [...$websockets];

	const spawnGrid = () => {
		simulation.spawnGrid((x, y) => {
			return new $options.entities.selected({
				x, y,
				...$options.entities[$options.entities.selected.className as keyof typeof $options.entities],
			});
		}, gridSize.x, gridSize.y);
	};
</script>

<h2>Settings</h2>
<div class="form">
	<div class="group">
		<h3>Entities</h3>
		<fieldset>
			<legend>Class</legend>
			<select bind:value={$options.entities.selected}>
				{#each placeable as constructor}
					<option value={constructor}>{constructor.className}</option>
				{/each}
			</select>
			<button on:click={() => simulation.killAllOfClass($options.entities.selected)}>
				🗑️ Clear
			</button>
		</fieldset>
		<fieldset>
			<legend>Grid ({$options.entities.selected.className})</legend>
			<div class="row">
				<label class="row">
					Cols: <input type="number" bind:value={gridSize.x} min=1 max=15 size=2 />
				</label>
				<label class="row">
					Rows: <input type="number" bind:value={gridSize.y} min=1 max=15 size=2 />
				</label>
			</div>
			<button on:click={spawnGrid}>
				🔢️ Spawn Grid
			</button>
		</fieldset>
		<button on:click={() => simulation.killAll()}>
			💀 Clear All
		</button>
	</div>
	<div class="group">
		<h3>Simulation</h3>
		<label>
			TPS Target: {$options.targetTps}
			<input type="range" bind:value={$options.targetTps} min=0 max=200 />
		</label>
		<label>
			Renderer
			<select multiple bind:value={$options.renderers} size=8>
				{#each rendererGroups as { name: groupName, renderers }}
					<optgroup label={groupName}>
						{#each renderers as renderer}
							<option value={renderer}>{renderer.name}</option>
						{/each}
					</optgroup>
				{/each}
			</select>
		</label>
	</div>
	<div class="group">
		<h3>Rendering</h3>
		<div class="group" style:gap=2em>
			{#each $options.renderers as renderer}
				<div class="group">
					<h4>[{getRendererGroup(renderer)?.name}] {renderer.name}</h4>
					{#if "controls" in renderer}
						<svelte:component this={renderer.controls} />
					{:else}
						<i>No options available</i>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div class="group">
		<h3>WebSockets</h3>
		<fieldset>
			<legend>Connections</legend>
			<label class="row" style:align-items=center>
				URL
				<form style:display=contents on:submit|preventDefault={() => connect(websocketConnectURL)}>
					<input bind:value={websocketConnectURL} size=1 />
					<button aria-label="connect" type="submit">🔌</button>
				</form>
			</label>
			<ul>
				{#each websocketsArray as socket}
					<li>
						{socket.url}
						<button aria-label="close" on:click={() => socket.close()}>❌</button>
					</li>
				{/each}
			</ul>
		</fieldset>
	</div>
</div>

<style>
	.form {
		width: 100%;

		display: flex;
		flex-direction: column;
		gap: 4em;
		margin-top: 1em;
	}

	.group {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.row {
		display: flex;
		gap: 0.25em;
		flex-wrap: wrap;
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

	ul {
		margin: 0;
		padding-left: 1em;
	}
</style>
