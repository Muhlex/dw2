import Store from "../Store";
import ClassInstancesMap from "../ClassInstancesMap";

import World from "./World";
import Entity from "./entities/Entity";

export default class Simulation extends Store {
	world = new World(1000, 1000);
	entities = new ClassInstancesMap<typeof Entity>();

	renderCallbacks = new Set<(simulation: Simulation) => void>();

	spawn(entity: Entity) {
		entity.setSimulation(this);
		this.entities.add(entity);
		entity.spawn();

		this.notify();
	}

	spawnGrid(create: (x: number, y: number) => Entity, cols = 10, rows = 10) {
		const colGap = this.world.size.x / cols, rowGap = this.world.size.y / rows;
		for (let x = colGap / 2; x < this.world.size.x; x += colGap) {
			for (let y = rowGap / 2; y < this.world.size.y; y += rowGap) {
				this.spawn(create(x, y));
			}
		}
	}

	kill(entity: Entity) {
		entity.kill();
		this.entities.delete(entity);
		this.notify();
	}

	killAll() {
		for (const entity of this.entities.values()) {
			entity.kill();
		}
		this.entities.clear();
		this.notify();
	}

	killAllOfClass(constructor: typeof Entity) {
		const entities = this.entities.get(constructor);
		for (const entity of entities.values()) {
			entity.kill();
		}
		entities.clear();
		this.notify();
	}

	tick() {
		for (const entity of this.entities.values()) {
			entity.tick();
		}
		this.notify();
	}

	frame(interpFrac: number) {
		const reverseInterpFrac = 1 - interpFrac;
		for (const entity of this.entities.values()) {
			entity.frame(interpFrac, reverseInterpFrac);
		}
		this.notify();

		for (const callback of this.renderCallbacks) {
			callback(this);
		}
	}
}
