<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { targetFrameDuration } from "../stores";

	import Vector2 from "../models/Vector2";
	import Simulation from "../models/Simulation";

	import Boid from "./Boid.svelte";
	import Arrow from "./Arrow.svelte";
	import Circle from "./Circle.svelte";
	import Rect from "./Rect.svelte";

	export let simulation: Simulation;
	export let debug: { [option: string]: boolean }

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
	let then = performance.now();
	let perf = {
		smoothingInterval: 500,
		measure: {
			start: 0,
			frameCount: 0,
			frameTimeSum: 0,
			avgFrameTime: Infinity
		}
	};
	$: fps = 1000 / perf.measure.avgFrameTime;
	const onFrame = (now: number) => {
		frameRequestID = window.requestAnimationFrame(onFrame);
		const frameTime = now - then;
		// Enfore FPS target:
		if (frameTime < $targetFrameDuration) return;

		simulation.tick();
		// Measure performance:
		if (now - perf.measure.start > perf.smoothingInterval) {
			perf.measure.avgFrameTime = perf.measure.frameTimeSum / perf.measure.frameCount;
			perf.measure.start = now;
			perf.measure.frameCount = 0;
			perf.measure.frameTimeSum = 0;
		}
		perf.measure.frameCount++;
		perf.measure.frameTimeSum += frameTime;
		then = now - (frameTime % $targetFrameDuration);
	}
	onMount(() => frameRequestID = window.requestAnimationFrame(onFrame));
	onDestroy(() => window.cancelAnimationFrame(frameRequestID));
</script>

<div
	class="simulation"
	style:--world-size-x={$simulation.world.size.x}
	style:--world-size-y={$simulation.world.size.y}
	style:--world-size-ratio={$simulation.world.size.x / $simulation.world.size.y}
	bind:this={simulationEl}
	on:pointerdown={onPointerdown}
	on:contextmenu|preventDefault
>
	<div class="stats">
		<span>FPS {fps.toFixed(0)}</span>
		<span>Boids {$simulation.boids.length}</span>
	</div>
	{#each $simulation.boids as boid}
		<Boid {boid} />
		{#if debug.edgeMargin}
			<Rect
				color={boid.color}
				opacity={0.25}
				position={new Vector2(boid.edgeMargin, boid.edgeMargin)}
				size={$simulation.world.size.copy().subtract(new Vector2(boid.edgeMargin * 2, boid.edgeMargin * 2))}
			/>
		{/if}
		{#if debug.avoidanceDelta}
			<Arrow
				color="red"
				position={boid.position}
				direction={boid.debug.avoidanceDelta.copy().multiply(1000)}
			/>
		{/if}
		{#if debug.centeringDelta}
			<Arrow
				color="lime"
				position={boid.position}
				direction={boid.debug.centeringDelta.copy().multiply(1000)}
			/>
		{/if}
		{#if debug.matchingDelta}
			<Arrow
				color="yellow"
				position={boid.position}
				direction={boid.debug.matchingDelta.copy().multiply(1000)}
			/>
		{/if}
		{#if debug.avoidRadius}
			<Circle color="red" position={boid.position} radius={boid.avoidRadius} />
		{/if}
		{#if debug.visionRadius}
			<Circle color="white" position={boid.position} radius={boid.visionRadius} />
		{/if}
	{/each}
</div>

<style>
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

	.stats {
		position: absolute;
		z-index: 1;
		top: 0.25em;
		left: 0.25em;

		font-weight: bold;
		font-size: 0.75em;
		opacity: 0.5;

		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
</style>
