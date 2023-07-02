<script lang="ts" context="module">
	import { writable } from "svelte/store";
	import { renderOptions as renderOptionsCanvas } from "../../canvas/led/Renderer.svelte";

	export const renderOptions = writable({
		websocket: {
			url: "",
		},
		data: {
			componentMaxValue: 255,
		},
		debug: { enable: false },
	});
</script>

<script lang="ts">
	import { chunk } from "../../../../util";
	import FrameRenderer, { type SimulationEvent } from "../../FrameRenderer.svelte";

	import type Simulation from "../../../../models/sim/Simulation";
	import Boid from "../../../../models/sim/entities/Boid";
	import Vector2 from "../../../../models/Vector2";

	$: ({ grid: { cols, rows }, boids: { scale: boidScale, intensity: boidIntensity } } = $renderOptionsCanvas);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: colGap = worldX / cols;
	$: rowGap = worldY / rows;

	$: ({ debug: { enable: enableDebug }, data: { componentMaxValue } } = $renderOptions);

	export let simulation: Simulation;

	const COMPONENT = { R: 0, G: 1, B: 2, W: 3 };
	const COMPONENT_COLORS = ["salmon", "palegreen", "lightskyblue", "white"];
	const COMPONENTS = Object.keys(COMPONENT).length;

	let matrixFlat: number[];
	$: matrixFlat = Array(cols * rows).fill(0);
	let matrix: number[][] | undefined;
	$: matrix = enableDebug ? chunk(matrixFlat, COMPONENTS) : undefined;

	const render = ({ detail: { simulation } }: CustomEvent<SimulationEvent>) => {
		matrixFlat.fill(0);
		const boids = simulation.entities.get(Boid);

		let i = 0;
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
				matrixFlat[i + COMPONENT.W] = brightness;
				for (let compIndex = 0; compIndex < COMPONENTS; compIndex++) {
					matrixFlat[i + compIndex] = Math.min(
						Math.floor(matrixFlat[i + compIndex] * componentMaxValue),
						componentMaxValue,
					);
				}
				i += COMPONENTS;
			}
		}
	};
</script>

<FrameRenderer {simulation} on:frame={render} />
{#if enableDebug && matrix}
	<div class="grid" style:--cols={cols}>
		{#each matrix as led}
			<div class="cell">
				{#each led as component, i}
					<span class="component" style:--color={COMPONENT_COLORS[i]}>
						{String(component).padStart(3, "0")}
					</span>
				{/each}
			</div>
		{/each}
	</div>
{/if}

<style>
	.grid {
		position: absolute;
		inset: 0;

		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		grid-gap: 1px;

		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: 0.75em;
	}

	.cell {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		column-gap: 0.5em;

		border: 1px solid gray;
		box-sizing: content-box;
		width: 100%;
		height: 100%;

		overflow-y: hidden;
	}

	.component {
		line-height: 1;
		color: var(--color);
	}
</style>
