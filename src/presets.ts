import { get } from "svelte/store";
import options, { defaults } from "./options";

import Vector2 from "./models/Vector2";
import type Simulation from "./models/sim/Simulation";
import Boid from "./models/sim/entities/Boid";
import Attractor from "./models/sim/entities/Attractor";
import { renderOptions } from "./lib/renderers/canvas/led/Renderer.svelte";

let $options = get(options);
options.subscribe(value => $options = value);

const initPrototype = (sim: Simulation, cols: number) => {
	sim.world.size = new Vector2(105 * cols, 500);

	options.update(options => ({
		...options,
		targetTps: 20,
		entities: {
			...options.entities,
			Boid: {
				...defaults.getBoid(),
				color: "whitesmoke",
				minSpeed: 0.5,
				avoidRadius: 108,
				visionRadius: 120,
				edgeMargin: 50,
				edgeTurnFactor: 0.5,
				centeringFactor: 0.0001,
				matchingFactor: 0.015,
				prototypeTweaks: true,
			},
		},
	}));

	renderOptions.update(options => ({
		...options,
		grid: { cols, rows: 30 },
		boids: { intensity: 0.5, scale: 2.8 },
	}));

	sim.killAllOfClass(Boid);
	sim.spawnGrid((x, y) => new Boid({ x, y, ...$options.entities.Boid }), cols, 3);
};

export default {
	"Physical Prototype": {
		"Initialize 300": (sim: Simulation) => {
			initPrototype(sim, 10);
		},
		"Initialize 600": (sim: Simulation) => {
			initPrototype(sim, 20);
		},
	},
	"Smooth Follow": {
		"Initialize": (sim: Simulation) => {
			options.update(options => ({
				...options,
				targetTps: 20,
				entities: {
					...options.entities,
					Boid: {
						...defaults.getBoid(),
						color: "antiquewhite",
						size: 35,
						minSpeed: 0,
						maxSpeed: 0.5,
						avoidRadius: 80,
						avoidFactor: 0.004,
						visionRadius: 0,
						edgeMargin: 0,
						edgeTurnFactor: 0.04,
					},
				},
			}));

			sim.killAll();
			sim.spawnGrid((x, y) => new Boid({ x, y, ...$options.entities.Boid }), 14, 14);
		},
		"Attract Constant": (sim: Simulation) => {
			options.update(options => ({
				...options,
				entities: {
					...options.entities,
					Boid: {
						...options.entities.Boid,
						minSpeed: 1.5,
						maxSpeed: 5,
						avoidRadius: 40,
						avoidFactor: 0.04,
						visionRadius: 200,
						matchingFactor: 0.004,
						edgeMargin: 50,
						edgeTurnFactor: 0.2,
					},
					Attractor: {
						...defaults.getAttractor(),
						strength: { start: 0.25, end: 0.5 },
						radius: { start: 0, end: Math.sqrt(sim.world.size.x ** 2 + sim.world.size.y ** 2) },
					},
				},
			}));

			sim.entities.get(Boid).forEach(boid => boid.applyOptions($options.entities.Boid));
			sim.spawn(new Attractor({
				...$options.entities.Attractor,
				position: sim.world.size.copy().multiply(0.5),
			}));
		},
		"Attract Cascading": (sim: Simulation) => {
			const shortSide = Math.min(sim.world.size.x, sim.world.size.y);

			options.update(options => ({
				...options,
				entities: {
					...options.entities,
					Boid: {
						...options.entities.Boid,
						minSpeed: 1.5,
						maxSpeed: 5,
						avoidRadius: 40,
						avoidFactor: 0.04,
						visionRadius: 320,
						centeringFactor: 0.001,
						matchingFactor: 0.01,
						edgeMargin: 50,
						edgeTurnFactor: 0.2,
					},
					Attractor: {
						...defaults.getAttractor(),
						strength: { start: 0.3, end: 0 },
						radius: { start: shortSide / 8, end: shortSide / 2 },
					},
				},
			}));

			sim.entities.get(Boid).forEach(boid => boid.applyOptions($options.entities.Boid));
			sim.spawn(new Attractor({
				...$options.entities.Attractor,
				position: sim.world.size.copy().multiply(0.5),
			}));
		},
	},
};
