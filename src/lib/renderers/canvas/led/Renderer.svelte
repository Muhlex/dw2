<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export const renderOptions = writable({
		grid: { cols: 10, rows: 30 },
		boids: { scale: 3, intensity: 0.5 },
	});
</script>

<script lang="ts">
	import type Simulation from "../../../../models/sim/Simulation";
	import CanvasRenderer, { type SimulationFrameEvent } from "../CanvasRenderer.svelte";

	import Vector2 from "../../../../models/Vector2";
	import Boid from "../../../../models/sim/entities/Boid";

	export let simulation: Simulation;

	let blurRenderer: CanvasRenderer;

	$: ({ grid: { cols, rows }, boids: { scale: boidScale, intensity: boidIntensity } } = $renderOptions);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: colGap = worldX / cols;
	$: rowGap = worldY / rows;
	$: ledRadius = Math.min(colGap - worldX / cols * 0.2, rowGap - worldY / rows * 0.2) / 2;

	const render = ({ detail: { simulation, api } }: CustomEvent<SimulationFrameEvent>) => {
		api.clear();
		const boids = simulation.entities.get(Boid);

		for (let y = rowGap / 2; y < worldY; y += rowGap) {
			for (let x = colGap / 2; x < worldX; x += colGap) {
				let brightness = 0;
				for (const boid of boids) {
					const maxDistance = boid.size * boidScale;
					const distanceSq = boid.interpolated.values.position.distanceSq(new Vector2(x, y));
					if (distanceSq > maxDistance ** 2) continue;
					const distance = Math.sqrt(distanceSq);
					brightness += (1 - distance / maxDistance) * boidIntensity;
				}
				const hsl = `40, 50%, ${(0.2 + 0.75 * brightness) * 100}%`;
				api.ctx.fillStyle = `hsl(${hsl}, ${brightness * 0.8 + 0.2})`;
				api.circle(x, y, ledRadius);
				api.ctx.fill();
			}
		}

		const apiBlur = blurRenderer.canvas.api;
		if (!apiBlur) return;
		apiBlur.clear();
		apiBlur.ctx.drawImage(api.ctx.canvas, 0, 0);
	};
</script>

<div class="blur">
	<CanvasRenderer {simulation} bind:this={blurRenderer} />
</div>
<CanvasRenderer {simulation} on:frame={render} />

<style>
	.blur {
		display: contents;
	}
	.blur > :global(*) {
		filter: blur(32px);
	}
</style>
