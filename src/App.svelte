<script lang="ts">
	import { onMount, onDestroy } from "svelte";

	import options from "./options";
	import { websockets, listenMessage, unlistenMessage, type MessageCallback } from "./websockets";

	import Simulation from "./models/sim/Simulation";
	import Boid from "./models/sim/entities/Boid";
	import DistanceSensor from "./models/sim/entities/DistanceSensor";

	import SimulationComponent from "./lib/Simulation.svelte";
	import Settings from "./lib/controls/Settings.svelte";
	import Parameters from "./lib/controls/Parameters.svelte";
	import Presets from "./lib/controls/Presets.svelte";

	const simulation = new Simulation();
	simulation.spawnGrid((x, y) => {
		return new Boid({ x, y, ...$options.entities.Boid });
	}, 5, 5);

	const knownSockets = new Set<WebSocket>();
	const socketSensors = new Map<WebSocket, DistanceSensor[]>();

	$: if ($websockets.length !== knownSockets.size) {
		if ($websockets.length > knownSockets.size) { // socket(s) opened
			for (const socket of $websockets) {
				if (knownSockets.has(socket)) continue;
				onSocketOpen(socket);
			}
		} else { // socket(s) closed
			for (const socket of knownSockets) {
				if ($websockets.includes(socket)) continue;
				onSocketEnd(socket);
			}
		}
	}

	const recalculateSensorPositions = () => {
		const socketWidth = simulation.world.size.x / $websockets.length;
		for (const [i, socket] of $websockets.entries()) {
			const socketOffset = socketWidth * ($websockets.length - 1 - i);
			const sensors = socketSensors.get(socket);
			if (!sensors) continue;
			const sensorGap = socketWidth / sensors.length;
			for (const [j, sensor] of sensors.entries()) {
				sensor.position.x = socketOffset + sensorGap * (j + 0.5);
			}
		}
	};

	$: {
		void $simulation.world.size.x;
		recalculateSensorPositions();
	}

	const onSocketOpen = (socket: WebSocket) => {
		knownSockets.add(socket);
		socketSensors.set(socket, []);
	};
	const onSocketEnd = (socket: WebSocket) => {
		knownSockets.delete(socket);
		const sensors = socketSensors.get(socket);
		if (!sensors) throw new Error("Closed uninitialized WebSocket.");
		for (const sensor of sensors) simulation.kill(sensor);
		socketSensors.delete(socket);
		recalculateSensorPositions();
	};

	const onSocketMessage: MessageCallback = async ({ socket, event }) => {
		const blob = event.data as Blob;
		const buffer = await blob.arrayBuffer();
		const BYTES_PER_DISTANCE = 4;
		const distances: number[] = [];
		for (let offset = 0; offset < buffer.byteLength; offset += BYTES_PER_DISTANCE) {
			distances.push(new DataView(buffer, offset, BYTES_PER_DISTANCE).getUint32(0, true));
		}

		const sensors = socketSensors.get(socket);
		if (!sensors) throw new Error("Received WebSocket message for uninitialized WebSocket.");
		if (sensors.length !== distances.length) {
			for (const sensor of sensors) simulation.kill(sensor);
			sensors.length = 0;
			for (const distance of distances) {
				const sensor = new DistanceSensor({ distance, maxDistance: $options.websockets.sonarMaxRange });
				sensors.push(sensor);
				simulation.spawn(sensor);
			}
			recalculateSensorPositions();
		}
		for (const [i, sensor] of sensors.entries()) {
			sensor.distance = distances[i];
		}
	};
	onMount(() => listenMessage(onSocketMessage));
	onDestroy(() => unlistenMessage(onSocketMessage));
</script>

<main style:--controls-visible={Number($options.showControls)}>
	<div class="simulation">
		<SimulationComponent {simulation} />
	</div>
	{#if $options.showControls}
		<div class="controls">
			<div class="settings">
				<Settings {simulation} />
			</div>
			<div class="params">
				<Parameters {simulation} />
			</div>
			<div class="presets">
				<Presets {simulation} />
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		flex-grow: 1;
		padding: 1em;

		display: grid;
		grid-template-areas:
			"settings simulation params"
			"settings presets    params";
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1fr auto;
		gap: calc(1em * var(--controls-visible));

		overflow: hidden;
	}

	.simulation {
		grid-area: simulation;
		position: relative;
	}

	.controls {
		display: contents;
	}
	.controls > * {
		z-index: 1;
	}

	.settings, .params {
		margin: -1em;
		padding: 1em;
		min-height: calc(100% + 2em);
		height: 0;
		overflow-y: auto;

		display: flex;
		flex-direction: column;
	}

	.settings {
		grid-area: settings;
		min-width: clamp(160px, 20vw, 320px);
		margin-right: 0;
	}
	.params {
		grid-area: params;
		min-width: clamp(200px, 20vw, 400px);
		margin-left: 0;
		padding-left: 0;
	}

	.presets {
		grid-area: presets;
		display: flex;

		overflow-x: auto;
	}

	/* Cannot use regular justify-content: center due to overflow: */
	.presets :global(> *:first-child) { margin-left: auto; }
	.presets :global(> *:last-child) { margin-right: auto; }
</style>
