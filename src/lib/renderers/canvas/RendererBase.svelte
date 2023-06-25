<script lang="ts" context="module">
	export type SimulationUpdateEvent = { simulation: Simulation, api: CoordinateCanvas2D };
</script>

<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import CoordinateCanvas2D from "./coordinate-canvas-api";

	import Vector2 from "../../../models/Vector2";
	import type Simulation from "../../../models/sim/Simulation";

	export let simulation: Simulation;

	const dispatch = createEventDispatcher<{
		"simulation-update": SimulationUpdateEvent
	}>();

	let canvasEl: HTMLCanvasElement;
	let offscreenCanvas: OffscreenCanvas;
	let canvasAPI: CoordinateCanvas2D | undefined;
	const canvasResolution = { x: 0, y: 0 };

	onMount(() => {
		offscreenCanvas = canvasEl.transferControlToOffscreen();
		canvasAPI = new CoordinateCanvas2D({ canvas: offscreenCanvas });
	});

	$: canvasAPI?.updateCanvasResolution(canvasResolution.x, canvasResolution.y);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: canvasAPI?.updateCoordinates(new Vector2(worldX, worldY));

	$: if (canvasAPI) {
		dispatch("simulation-update", { simulation: $simulation, api: canvasAPI });
	}
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
