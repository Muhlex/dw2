import Store from "./Store";
import Vector2 from "./Vector2";
import World from "./World";
import Boid from "./Boid";

enum MouseButton { Primary, Middle, Secondary };

export default class Simulation extends Store {
	world = new World(1000, 1000);
	boids: Boid[] = [];

	constructor() {
		super();

		for (let i = 0; i < 10; i++) {
			const offset = i * 100;
			this.boids.push(new Boid(offset, offset));
		}
	}

	onClick(x: number, y: number, button: MouseButton) {
		({
			[MouseButton.Primary]: () => {
				this.boids.push(new Boid(x, y));
			},
			[MouseButton.Secondary]: () => {
				for (let i = 0; i < 10; i++) {
					this.boids.push(new Boid(x, y));
				}
			},
			[MouseButton.Middle]: () => {
				for (let i = 0; i < 100; i++) {
					this.boids.push(new Boid(x, y));
				}
			},
		}[button]?.());
		this.notify();
	}

	reset() {
		this.boids = [];
		this.notify();
	}

	tick() {
		for (const self of this.boids) {
			// Teleport boids to opposite edge when leaving an edge:
			if (self.position.x < 0) self.position.x = this.world.size.x;
			else if (self.position.x > this.world.size.x) self.position.x = 0;
			if (self.position.y < 0) self.position.y = this.world.size.y;
			else if (self.position.y > this.world.size.y) self.position.y = 0;

			const separationDeltaSum = new Vector2();
			for (const other of this.boids) {
				if (self === other) continue;

				const distance = self.position.distance(other.position);

				if (distance <= self.separationRadius) {
					const delta = self.position.copy()
						.subtract(other.position)
						.divide(Math.max(distance, 1))
						.multiply(self.separationRadius - distance);
					separationDeltaSum.add(delta);
				}
			}
			self.debug.separationDeltaSum = separationDeltaSum;
			self.velocity.add(separationDeltaSum.multiply(self.avoidFactor));

			self.position.add(self.velocity);
		}
		this.notify();
	}
}
