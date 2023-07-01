<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export const renderOptions = writable({
		grid: { cols: 12, rows: 25 },
		boids: { scale: 2, intensity: 0.8 },
	});
</script>

<script lang="ts">
	import type Simulation from "../../../../models/sim/Simulation";
	import CanvasRenderer, { type MountEvent, type SimulationFrameEvent } from "../CanvasRenderer.svelte";
	import Canvas2DRenderer from "../Canvas2DRenderer.svelte";

	import RenderWorker from "./worker?worker";
	import { MessageType, type SetupMessage, type RenderMessage } from "./worker";

	import Boid from "../../../../models/sim/entities/Boid";

	export let simulation: Simulation;

	const renderWorker = new RenderWorker();

	let blurRenderer: Canvas2DRenderer;

	$: ({ grid, boids: { scale: boidScale, intensity: boidIntensity } } = $renderOptions);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: colGap = worldX / grid.cols;
	$: rowGap = worldY / grid.rows;
	$: ledRadius = Math.min(colGap - worldX / grid.cols * 0.2, rowGap - worldY / grid.rows * 0.2) / 2;

	const setup = ({ detail: { offscreenCanvas } }: CustomEvent<MountEvent>) => {
		const message = { type: MessageType.Setup, offscreenCanvas } satisfies SetupMessage;
		renderWorker.postMessage(message, [offscreenCanvas]);
	};

	const render = ({ detail: { offscreenCanvas, simulation } }: CustomEvent<SimulationFrameEvent>) => {
		const boids = simulation.entities.get(Boid);
		// const message = {
		// 	type: MessageType.Render,
		// 	boids, worldX, worldY, colGap, rowGap, boidScale, boidIntensity, ledRadius,
		// } satisfies RenderMessage;
		// renderWorker.postMessage(message);

		const apiBlur = blurRenderer.canvas.api;
		if (!apiBlur) return;
		apiBlur.clear();
		apiBlur.ctx.drawImage(offscreenCanvas, 0, 0);
	};
</script>

<div class="blur">
	<Canvas2DRenderer {simulation} bind:this={blurRenderer} />
</div>
<CanvasRenderer {simulation} on:mount={setup} on:frame={render} />

<style>
	.blur {
		display: contents;
	}
	.blur > :global(*) {
		filter: blur(32px);
	}
</style>
