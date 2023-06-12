import Store from "../Store";
import ClassSet from "../ClassSet";

import World from "./World";
import Entity from "./entities/Entity";


export default class Simulation extends Store {
	world = new World(1000, 1000);

	entities = new ClassSet<typeof Entity>();

	spawn(entity: Entity) {
		entity.setSimulation(this);
		this.entities.add(entity);

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
		this.entities.delete(entity);
	}

	killAll() {
		this.entities.clear();

		this.notify();
	}

	killAllOfClass(constructor: typeof Entity) {
		this.entities.get(constructor).clear();
	}

	tick() {
		for (const entity of this.entities.values()) {
			entity.tick();
		}

		this.notify();
	}
}
