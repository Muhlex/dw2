import Store from "./Store";
import Boid from "./Boid";

export default class Simulation extends Store {
	boids: Boid[] = [];

	constructor() {
		super();

		for (let i = 0; i < 12; i++) {
			const offset = i * 8;
			this.boids.push(new Boid(offset, offset));
		}
	}

	tick() {
		for (const boid of this.boids) {
			boid.velocity.rotate(0.1);
			boid.position.add(boid.velocity);
		}
		this.notify();
	}
}
