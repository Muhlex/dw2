<script lang="ts" context="module">
	export type SimulationFrameEvent = { simulation: Simulation, api: CoordinateCanvas2D };
</script>

<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from "svelte";
	import CoordinateCanvas2D from "./coordinate-canvas-api";

	import Vector2 from "../../../models/Vector2";
	import type Simulation from "../../../models/sim/Simulation";

	export const canvas: {
		el: HTMLCanvasElement | undefined;
		api: CoordinateCanvas2D | undefined;
	} = {
		el: undefined,
		api: undefined,
	};

	export let simulation: Simulation;

	const dispatch = createEventDispatcher<{ "frame": SimulationFrameEvent }>();

	let canvasEl: HTMLCanvasElement;
	let offscreenCanvas: OffscreenCanvas;
	let canvasAPI: CoordinateCanvas2D | undefined;
	const canvasResolution = { x: 0, y: 0 };

	onMount(() => {
		offscreenCanvas = canvasEl.transferControlToOffscreen();
		canvasAPI = new CoordinateCanvas2D({ canvas: offscreenCanvas });
		canvas.el = canvasEl;
		canvas.api = canvasAPI;
	});

	$: canvasAPI?.updateCanvasResolution(canvasResolution.x, canvasResolution.y);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: canvasAPI?.updateCoordinates(new Vector2(worldX, worldY));

	const render = () => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		dispatch("frame", { simulation: simulation, api: canvasAPI! });
	};

	onMount(() => simulation.renderCallbacks.add(render));
	onDestroy(() => simulation.renderCallbacks.delete(render));
</script>

<canvas
	bind:this={canvasEl}
	bind:clientWidth={canvasResolution.x}
	bind:clientHeight={canvasResolution.y}
/>

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
