<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { frameDuration } from "../stores";

	import Simulation from "../models/Simulation";

	import Boid from "./Boid.svelte";
	import Arrow from "./Arrow.svelte";

	const simulation = new Simulation();
	let simulationEl: HTMLDivElement;

	const onPointerdown = (event: PointerEvent) => {
		event.preventDefault();
		const { clientX, clientY, button } = event;
		const { x, y, width, height } = simulationEl.getBoundingClientRect();
		const offset = { x: clientX - x, y: clientY - y};
		const coordinateOffset = {
			x: offset.x / width * simulation.world.size.x,
			y: offset.y / height * simulation.world.size.y,
		};
		simulation.onClick(coordinateOffset.x, coordinateOffset.y, button);
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

<div class="simulation-container">
	<div
		class="simulation"
		style:--world-size-x={$simulation.world.size.x}
		style:--world-size-y={$simulation.world.size.y}
		style:--world-size-ratio={$simulation.world.size.x / $simulation.world.size.y}
		bind:this={simulationEl}
		on:pointerdown={onPointerdown}
		on:contextmenu|preventDefault
	>
		{#each $simulation.boids as boid}
			<Boid {boid} />
			<Arrow position={boid.position} direction={boid.debug.separationDeltaSum.copy().multiply(1000)} />
		{/each}
	</div>
</div>
<div class="controls">
	<button on:click={() => simulation.reset()}>✨ Reset</button>
</div>

<style>
	.simulation-container {
		position: relative;
		flex-grow: 1;
	}

	.simulation {
		position: absolute;
		margin: auto;
		inset: 0;
		max-width: 100%;
		max-height: 100%;
		aspect-ratio: var(--world-size-ratio);

		background-color: black;
		box-shadow: 0 0 8em rgb(0, 0, 0, 0.5);
		contain: size layout style;
	}

	.simulation :global(*) {
		pointer-events: none;
	}

	.controls {
		margin-top: 1em;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
