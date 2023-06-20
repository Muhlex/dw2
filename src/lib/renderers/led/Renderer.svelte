<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export const renderOptions = writable({
		grid: { cols: 12, rows: 25 },
		boids: { scale: 2, intensity: 0.8 },
	});
</script>

<script lang="ts">
	import Vector2 from "../../../models/Vector2";
	import type Simulation from "../../../models/sim/Simulation";
	import Boid from "../../../models/sim/entities/Boid";

	export let simulation: Simulation;

	$: ({ grid, boids: { scale: boidScale, intensity: boidIntensity } } = $renderOptions);

	$: matrix = (() => {
		const result: number[] = Array(grid.cols * grid.rows).fill(0);
		const boids = $simulation.entities.get(Boid);
		const colGap = $simulation.world.size.x / grid.cols, rowGap = $simulation.world.size.y / grid.rows;

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
	class="grid"
	style:--grid-cols={grid.cols}
	style:--grid-rows={grid.rows}
>
	{#each matrix as brightness}
		<div class="cell">
			<div class="led" style:--brightness={brightness} />
		</div>
	{/each}
</div>

<style>
	.grid {
		position: absolute;
		inset: 0;

		display: grid;
		grid-template-columns: repeat(var(--grid-cols), 1fr);
		column-gap: calc(100% / var(--grid-cols) / 2);
		row-gap: calc(100% / var(--grid-rows) / 2);
	}

	.cell {
		position: relative;
	}

	.led {
		position: absolute;
		margin: auto;
		inset: 0;
		max-width: 100%;
		max-height: 100%;
		aspect-ratio: 1;

		--hsl: 40, 50%, calc(20% + 75% * var(--brightness));
		background-color: hsl(var(--hsl), calc(var(--brightness) * 0.8 + 0.2));
		border-radius: 50%;
	}
	.led::before {
		content: "";
		display: block;

		position: absolute;
		inset: -16px;
		border-radius: 50%;
		background-color: hsl(var(--hsl), var(--brightness));
		z-index: -1;
		filter: blur(16px);
	}
</style>
