<script lang="ts" context="module">
	import { writable } from "svelte/store";
	import { renderOptions as renderOptionsCanvas } from "../../canvas/led/Renderer.svelte";

	export const renderOptions = writable({
		diffuse: { vertical: 1, horizontal: 1 },
	});
</script>

<script lang="ts">
	import Vector2 from "../../../../models/Vector2";
	import type Simulation from "../../../../models/sim/Simulation";
	import Boid from "../../../../models/sim/entities/Boid";

	export let simulation: Simulation;

	$: ({ grid, boids: { scale: boidScale, intensity: boidIntensity } } = $renderOptionsCanvas);
	$: ({ diffuse } = $renderOptions);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: colGap = worldX / grid.cols;
	$: rowGap = worldY / grid.rows;

	$: matrix = (() => {
		const result: number[] = Array(grid.cols * grid.rows).fill(0);
		const boids = $simulation.entities.get(Boid);

		let i = 0;
		for (let y = rowGap / 2; y < $simulation.world.size.y; y += rowGap) {
			for (let x = colGap / 2; x < $simulation.world.size.x; x += colGap) {
				for (const boid of boids) {
					const maxDistance = boid.size * boidScale;
					const distanceSq = boid.interpolated.values.position.distanceSq(new Vector2(x, y));
					if (distanceSq > maxDistance ** 2) continue;
					const distance = Math.sqrt(distanceSq);
					result[i] += (1 - distance / maxDistance) * boidIntensity;
				}
				i++;
			}
		}
		return result;
	})();
</script>

<div
	class="grids"
	style:--grid-cols={grid.cols}
	style:--grid-rows={grid.rows}
	style:--diffuse-horizontal={diffuse.horizontal}
	style:--diffuse-vertical={diffuse.vertical}
>
	<div class="grid">
		{#each matrix as brightness}
			<div class="cell">
				<div class="led" style:--brightness={brightness} />
			</div>
		{/each}
	</div>
	<div class="grid blur">
		{#each matrix as brightness}
			<div class="cell">
				<div class="led" style:--brightness={brightness} />
			</div>
		{/each}
	</div>
</div>

<style>
	.grids {
		position: absolute;
		inset: 0;
	}

	.grid {
		position: absolute;
		inset: 0;

		display: grid;
		grid-template-columns: repeat(var(--grid-cols), 1fr);
	}
	.grid:not(.blur) {
		filter: blur(calc(max(var(--diffuse-horizontal), var(--diffuse-vertical)) * 1px - 1px));
	}

	.cell {
		position: relative;
	}

	.led {
		position: absolute;
		margin: auto;
		inset: 0;
		max-width: 80%;
		max-height: 80%;
		aspect-ratio: 1;
		border-radius: 50%;

		--hsl: 40, 50%, calc(20% + 75% * var(--brightness));
		background-color: hsl(var(--hsl), calc(var(--brightness) * 0.8 + 0.2));
	}
	.blur .led {
		background-color: hsl(var(--hsl), var(--brightness));
		transform: scale(
			calc(1 + var(--diffuse-horizontal)),
			calc(1 + var(--diffuse-vertical))
		);
		filter: blur(12px);
	}
</style>
