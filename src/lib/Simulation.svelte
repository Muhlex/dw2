<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { targetTps } from "../stores";

	import Vector2 from "../models/Vector2";
	import Simulation from "../models/Simulation";

	import { interact } from "./SimulationActions";

	import Boid from "./Boid.svelte";
	import Arrow from "./Arrow.svelte";
	import Circle from "./Circle.svelte";
	import Rect from "./Rect.svelte";

	export let simulation: Simulation;
	export let debug: {
		render: {
			avoidanceDelta: boolean,
			centeringDelta: boolean,
			matchingDelta: boolean,
			avoidRadius: boolean,
			visionRadius: boolean,
			edgeMargin: boolean,
		}
	};

	let animationFrameRequestID = -1;
	let lastFrameTime = performance.now();
	let lastTickTime = lastFrameTime;
	let delta = 0.0;
	const maxTickDelay = 500;
	const measure = {
		tick: { smooth: 20, time: 0, timeLazy: 0 },
		frame: { smooth: 10, time: 0, timeLazy: 0 },
		lazyInterval: 500,
		lazyIntervalID: -1,
	}
	$: targetTickInterval = 1000 / $targetTps;
	const onAnimationFrame = (time: number) => {
		animationFrameRequestID = window.requestAnimationFrame(onAnimationFrame);

		const lastFrameDelta = time - lastFrameTime;
		measure.frame.time += (lastFrameDelta - measure.frame.time) / measure.frame.smooth;
		lastFrameTime = time;

		delta = Math.min(delta + lastFrameDelta, maxTickDelay);

		while (delta > targetTickInterval) {
			simulation.tick();

			delta -= targetTickInterval;

			const tickTime = performance.now();
			const lastTickDelta = tickTime - lastTickTime;
			measure.tick.time += (lastTickDelta - measure.tick.time) / measure.tick.smooth;
			lastTickTime = tickTime;
		}
	}
	onMount(() => {
		animationFrameRequestID = window.requestAnimationFrame(onAnimationFrame);
		measure.lazyIntervalID = window.setInterval(() => {
			measure.tick.timeLazy = measure.tick.time;
			measure.frame.timeLazy = measure.frame.time;
		}, measure.lazyInterval);
	});
	onDestroy(() => {
		window.cancelAnimationFrame(animationFrameRequestID);
		window.clearInterval(measure.lazyIntervalID);
	});
</script>

<div
	class="simulation"
	style:--world-size-x={$simulation.world.size.x}
	style:--world-size-y={$simulation.world.size.y}
	style:--world-size-ratio={$simulation.world.size.x / $simulation.world.size.y}
	use:interact={simulation}
>
	<div class="stats">
		<span>FPS {(1000 / measure.frame.timeLazy).toFixed(0)}</span>
		<span>TPS {(1000 / measure.tick.timeLazy).toFixed(0)}</span>
		<span>Boids {$simulation.boids.length}</span>
	</div>
	{#each $simulation.boids as boid}
		<Boid {boid} />
		{#if debug.render.edgeMargin}
			<Rect
				color={boid.color}
				opacity={0.25}
				position={new Vector2(boid.edgeMargin, boid.edgeMargin)}
				size={$simulation.world.size.copy().subtract(new Vector2(boid.edgeMargin * 2, boid.edgeMargin * 2))}
			/>
		{/if}
		{#if debug.render.avoidanceDelta}
			<Arrow
				color="red"
				position={boid.position}
				direction={boid.debug.avoidanceDelta.copy().multiply(1000)}
			/>
		{/if}
		{#if debug.render.centeringDelta}
			<Arrow
				color="lime"
				position={boid.position}
				direction={boid.debug.centeringDelta.copy().multiply(1000)}
			/>
		{/if}
		{#if debug.render.matchingDelta}
			<Arrow
				color="yellow"
				position={boid.position}
				direction={boid.debug.matchingDelta.copy().multiply(1000)}
			/>
		{/if}
		{#if debug.render.avoidRadius}
			<Circle color="red" position={boid.position} radius={boid.avoidRadius} />
		{/if}
		{#if debug.render.visionRadius}
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
