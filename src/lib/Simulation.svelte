<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import options from "../options";

	import Simulation from "../models/sim/Simulation";

	import interact from "./actions/simulation-interact";

	export let simulation: Simulation;

	let animationFrameRequestID = -1;
	let lastFrameTime = performance.now();
	let lastTickTime = lastFrameTime;
	let delta = 0.0;
	const measure = {
		tick: { smooth: 20, time: 0, timeLazy: 0 },
		frame: { smooth: 10, time: 0, timeLazy: 0 },
		lazyInterval: 500,
		lazyIntervalID: -1,
	}
	const maxTicksPerFrame = 8;
	$: targetTickInterval = 1000 / $options.targetTps;
	$: maxTickDelay = targetTickInterval * maxTicksPerFrame;
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

		simulation.frame(delta / targetTickInterval);
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
		<span>FPS {(1000 / (measure.frame.timeLazy || Infinity)).toFixed(0)}</span>
		<span>TPS {(1000 / (measure.tick.timeLazy || Infinity)).toFixed(0)}</span>
		<span>Entities {$simulation.entities.size}</span>
	</div>
	<svelte:component this={$options.renderer.component} {simulation} />
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
		text-shadow: 0 0 0.25em black, 0 0 1em black;
		opacity: 0.75;
		user-select: none;

		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
</style>
