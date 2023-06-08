import Store from "./Store";
import Boid from "./Boid";

enum MouseButton { Primary, Middle, Secondary };

export default class Simulation extends Store {
	boids: Boid[] = [];

	constructor() {
		super();

		for (let i = 0; i < 12; i++) {
			const offset = i * 8;
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
		}[button]?.());
		this.notify();
	}

	reset() {
		this.boids = [];
		this.notify();
	}

	tick() {
		for (const boid of this.boids) {
			boid.velocity.rotate(0.1);
			boid.position.add(boid.velocity);
		}
		this.notify();
	}
}
