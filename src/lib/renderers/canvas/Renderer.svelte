<script lang="ts">
  import { onMount } from "svelte";
	import CoordinateCanvas2D from "../../../canvas-api";

	import Vector2 from "../../../models/Vector2";
	import type Simulation from "../../../models/sim/Simulation";
	import Boid from "../../../models/sim/entities/Boid";

	export let simulation: Simulation;

	let canvasEl: HTMLCanvasElement;
	let canvasAPI: CoordinateCanvas2D | undefined;
	const canvasResolution = { x: 0, y: 0 };

	onMount(() => {
		canvasAPI = new CoordinateCanvas2D({ canvas: canvasEl });
	});

	$: canvasAPI?.updateCanvasResolution(canvasResolution.x, canvasResolution.y);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: canvasAPI?.updateCoordinates(new Vector2(worldX, worldY));

	$: if (canvasAPI) {
		const api = canvasAPI, ctx = canvasAPI.ctx;
		const boids = $simulation.entities.get(Boid);

		api.clear();
		for (const boid of boids) {
			const { position } = boid.interpolated.values;
			ctx.fillStyle = boid.color;
			api.circle(position.x, position.y, boid.size / 2);
			ctx.fill();
		}
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
