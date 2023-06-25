<script lang="ts">
	import type Simulation from "../../../../models/sim/Simulation";
	import RendererBase, { type SimulationUpdateEvent } from "../RendererBase.svelte";

	import Boid from "../../../../models/sim/entities/Boid";

	export let simulation: Simulation;

	const onSimulationUpdate = ({ detail: { simulation, api } }: CustomEvent<SimulationUpdateEvent>) => {
		const ctx = api.ctx;
		const boids = simulation.entities.get(Boid);

		api.clear();
		for (const boid of boids) {
			const { position } = boid.interpolated.values;
			ctx.fillStyle = boid.color;
			api.circle(position.x, position.y, boid.size / 2);
			ctx.fill();
		}
	};

</script>

<RendererBase {simulation} on:simulation-update={onSimulationUpdate} />
