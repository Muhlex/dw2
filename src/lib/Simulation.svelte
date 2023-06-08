<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { frameDuration, coordinateSystem } from "../stores";
	import Simulation from "../models/Simulation";

	import Boid from "../lib/Boid.svelte";

	const simulation = new Simulation();
	let simulationEl: HTMLDivElement;

	const onPointerdown = (event: PointerEvent) => {
		event.preventDefault();
		const { clientX, clientY, button } = event;
		const { x, y, width, height } = simulationEl.getBoundingClientRect();
		const offset = [clientX - x, clientY - y];
		const coordinateOffset = [
			offset[0] / width * $coordinateSystem[0],
			offset[1] / height * $coordinateSystem[1],
		];
		simulation.onClick(coordinateOffset[0], coordinateOffset[1], button);
	}

	let frameRequestID = -1;
	let previous = 0;
	const onFrame = (now: number) => {
		frameRequestID = window.requestAnimationFrame(onFrame);
		if (now - previous < $frameDuration) return;
		simulation.tick();
		previous = now;
	}
	onMount(() => frameRequestID = window.requestAnimationFrame(onFrame));
	onDestroy(() => window.cancelAnimationFrame(frameRequestID));
</script>

<div
	class="simulation"
	bind:this={simulationEl}
	on:pointerdown={onPointerdown}
	on:contextmenu|preventDefault
>
	{#each $simulation.boids as boid}
		<Boid {boid} />
	{/each}
</div>
<div class="controls">
	<button on:click={() => simulation.reset()}>✨ Reset</button>
</div>

<style>
	.simulation {
		position: relative;
		width: min(100%, 600px);
		aspect-ratio: 1;
		background-color: black;
		box-shadow: 0 0 8em rgb(0, 0, 0, 0.5);
	}

	.simulation :global(*) {
		pointer-events: none;
	}

	.controls {
		margin-top: 1em;
		display: flex;
		flex-wrap: wrap;
	}
</style>
