<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { frameDuration } from "../stores";
	import Simulation from "../models/Simulation";

	import Boid from "../lib/Boid.svelte";

	const simulation = new Simulation();
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

<div class="simulation">
	{#each $simulation.boids as boid}
		<Boid {boid} />
	{/each}
</div>

<style>
	.simulation {
		position: relative;
		width: 512px;
		height: 512px;
		background-color: black;
		box-shadow: 0 0 8em rgb(0, 0, 0, 0.5);
	}
</style>
