import Store from "./Store";
import World from "./World";
import Entity from "./Entity";

export default class Simulation extends Store {
	world = new World(1000, 1000);

	entities: Entity[] = [];
	private entitiesByClass = new Map<typeof Entity, Entity[]>();

	getEntitiesOfClass<T extends Entity>(entityClass: new (...args: any[]) => T): T[] {
		let entitiesOfClass = this.entitiesByClass.get(entityClass);
		if (!entitiesOfClass) {
			entitiesOfClass = [];
			this.entitiesByClass.set(entityClass, entitiesOfClass);
		}
		return entitiesOfClass as T[];
	}

	spawn(entity: Entity) {
		entity.setSimulation(this);
		this.entities.push(entity);
		this.getEntitiesOfClass(entity.constructor as new () => Entity).push(entity);

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

	killAll() {
		this.entities = [];
		this.entitiesByClass = new Map();

		this.notify();
	}

	tick() {
		for (const entity of this.entities) {
			entity.tick();
		}

		this.notify();
	}
}
