<script lang="ts" context="module">
	import { writable } from "svelte/store";
	import { renderOptions as renderOptionsCanvas } from "../../canvas/led/Renderer.svelte";

	export const renderOptions = writable({
		websocket: { rate: 60 },
		debug: { enable: false },
	});
</script>

<script lang="ts">
	import { onDestroy } from "svelte";

	import { chunk } from "../../../../util";
	import { websockets, send, sendAll } from "../../../../websockets";

	import FrameRenderer, { type SimulationEvent } from "../../FrameRenderer.svelte";

	import type Simulation from "../../../../models/sim/Simulation";
	import Boid from "../../../../models/sim/entities/Boid";
	import Vector2 from "../../../../models/Vector2";

	$: ({ grid: { cols, rows }, boids: { scale: boidScale, intensity: boidIntensity } } = $renderOptionsCanvas);
	$: ({ x: worldX, y: worldY } = $simulation.world.size);
	$: colGap = worldX / cols;
	$: rowGap = worldY / rows;

	$: ({ debug: { enable: enableDebug } } = $renderOptions);

	export let simulation: Simulation;

	const COMPONENT = { R: 0, G: 1, B: 2, W: 3 };
	const COMPONENT_COUNT = Object.keys(COMPONENT).length;

	function* generateLeds() {
		/**
		 * This is our LED stripe setup:
		 *
		 *   │ ▲ │ ▲ │ ▲
		 *   │ │ │ │ │ │
		 *   │ │ │ │ │ │
		 *   ▼ │ ▼ │ ▼ │
		 * end         start
		 **/
		let i = 0;
		for (let col = cols - 1; col >= 0; col--) {
			const x = (col + 0.5) * colGap;
			const isOddCol = (cols - col) & 1; // when counting from the right
			for (let row = isOddCol ? rows - 1 : 0; row >= 0 && row < rows; isOddCol ? row-- : row++) {
				const y = (row + 0.5) * rowGap;
				yield { i, col, row, x, y };
				i++;
			}
		}
	}

	$: matrix = new Uint8ClampedArray(cols * rows * COMPONENT_COUNT);
	$: matrixPerLed = enableDebug ? chunk(matrix, COMPONENT_COUNT) : undefined;
	let ledCells: { col: number, row: number }[]; // physical position in the grid
	$: {
		void cols, rows;
		ledCells = [];
		for (const { col, row } of generateLeds()) {
			ledCells.push({ col, row });
		}
	}

	const render = ({ detail: { simulation } }: CustomEvent<SimulationEvent>) => {
		const boids = simulation.entities.get(Boid);
		const leds: { brightness: number }[] = [];

		for (const led of generateLeds()) {
			let brightness = 0;
			for (const boid of boids) {
				const maxDistance = boid.size * boidScale;
				const distanceSq = boid.interpolated.values.position.distanceSq(new Vector2(led.x, led.y));
				if (distanceSq > maxDistance ** 2) continue;
				const distance = Math.sqrt(distanceSq);
				brightness += (1 - distance / maxDistance) * boidIntensity;
			}
			leds.push({ brightness: Math.min(brightness, 1) });
		}

		for (const [i, { brightness }] of leds.entries()) {
			const ledOffset = i * COMPONENT_COUNT;
			// Leads to physical brightness perception becoming *more linear*:
			const brightnessExp = brightness ** 2;
			matrix[ledOffset + COMPONENT.R] = 0;
			matrix[ledOffset + COMPONENT.G] = Math.ceil(brightnessExp * 255);
			matrix[ledOffset + COMPONENT.B] = Math.ceil(brightnessExp * 150);
			matrix[ledOffset + COMPONENT.W] = Math.ceil(brightnessExp * 70);
		}
	};

	let wsRateIntervalId = -1;
	const updateWsInterval = (rate: number) => {
		clearInterval(wsRateIntervalId);

		const delay = 1000 / rate;
		if (delay === Infinity) return;

		wsRateIntervalId = setInterval(() => {
			const sliceSize = matrix.length / $websockets.length;
			for (let i = 0; i < $websockets.length; i++) {
				const offset = i * sliceSize;
				send(i, matrix.slice(offset, offset + sliceSize));
			}
		}, delay);
	};
	$: updateWsInterval($renderOptions.websocket.rate);
	onDestroy(() => {
		clearInterval(wsRateIntervalId);
		matrix.fill(0);
		sendAll(matrix);
	});
</script>

<FrameRenderer {simulation} on:frame={render} />
{#if enableDebug && matrixPerLed}
	<div class="grid" style:--cols={cols}>
		{#each matrixPerLed as led, ledIndex}
		{@const { col, row } = ledCells[ledIndex]}
			<div class="cell" style:grid-column={col + 1} style:grid-row={row + 1}>
				<div class="led-index">{ledIndex}</div>
				<div class="components">
					{#each led as component}
						<div class="component" style:--fraction={component / 255} />
					{/each}
				</div>
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
		gap: 1px;

		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}

	.cell {
		position: relative;

		display: flex;
		justify-content: center;
		align-items: center;

		border: 1px solid white;
		box-sizing: content-box;
		width: 100%;
		height: 100%;

		overflow: hidden;
	}

	.led-index {
		text-shadow: 0 0 0.25em black, 0 0 0.25em black, 0 0 0.5em black;
	}

	.components {
		position: absolute;
		inset: 0;
		z-index: -1;

		display: flex;
		flex-direction: column;
		justify-content: stretch;

		opacity: 0.5;
	}

	.component {
		flex-grow: 1;
		transform-origin: left;
		transform: scaleX(var(--fraction));
	}
	.component:nth-child(1) { background-color: salmon; }
	.component:nth-child(2) { background-color: palegreen; }
	.component:nth-child(3) { background-color: lightskyblue; }
	.component:nth-child(4) { background-color: whitesmoke; }
</style>
