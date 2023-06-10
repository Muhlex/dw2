import Store from "./Store";
import Vector2 from "./Vector2";
import World from "./World";
import Boid from "./Boid";
import Attractor from "./Attractor";

export default class Simulation extends Store {
	world = new World(1000, 1000);
	boids: Boid[] = [];
	attractors: Attractor[] = [];

	clear() {
		this.boids = [];
		this.attractors = [];
		this.notify();
	}

	spawnBoid(x = 0, y = 0, options?: Partial<Boid>) {
		this.boids.push(new Boid(x, y, options));
	}

	spawnBoidGrid(cols = 10, rows = 10, options?: Partial<Boid>) {
		const colGap = this.world.size.x / cols, rowGap = this.world.size.y / rows;
		for (let i = colGap / 2; i < this.world.size.x; i += colGap) {
			for (let j = rowGap / 2; j < this.world.size.y; j += rowGap) {
				this.spawnBoid(i, j, options);
			}
		}
		this.notify();
	}

	spawnAttractor(x = 0, y = 0, options?: Partial<Attractor>) {
		this.attractors.push(new Attractor(x, y, options));
	}

	applyBoidsOptions(options: Partial<Boid>) {
		for (const boid of this.boids) {
			Object.assign(boid, options);
		}
	}

	tick() {
		for (const self of this.boids) {
			// Other Boids
			self.debug.centeringDelta.multiply(0);
			self.debug.matchingDelta.multiply(0);

			const avoidanceDelta = new Vector2();
			const visiblePositionsMean = new Vector2();
			const visibleVelocitiesMean = new Vector2();
			let visibleCount = 0;

			for (const other of this.boids) {
				if (self === other) continue;

				const distanceSq = self.position.distanceSq(other.position);
				const visionRadiusSq = self.visionRadius ** 2;
				const avoidRadiusSq = self.avoidRadius ** 2;
				if (distanceSq > visionRadiusSq && distanceSq > avoidRadiusSq) continue;

				if (distanceSq <= avoidRadiusSq) {
					const distance = Math.sqrt(distanceSq);
					const delta = self.position.copy()
						.subtract(other.position)
						.divide(Math.max(distance, 1))
						.multiply(self.avoidRadius - distance);
					avoidanceDelta.add(delta);
				} else if (distanceSq <= visionRadiusSq) {
					// For now, sum up other's values. Get mean afterwards.
					visiblePositionsMean.add(other.position);
					visibleVelocitiesMean.add(other.velocity);
					visibleCount++;
				}
			}

			if (visibleCount > 0) {
				visiblePositionsMean.divide(visibleCount);
				visibleVelocitiesMean.divide(visibleCount);

				const centeringDelta = visiblePositionsMean.copy()
					.subtract(self.position).multiply(self.centeringFactor);
				const matchingDelta = visibleVelocitiesMean.copy()
					.subtract(self.velocity).multiply(self.matchingFactor);
				self.velocity.add(centeringDelta).add(matchingDelta);

				self.debug.centeringDelta = centeringDelta;
				self.debug.matchingDelta = matchingDelta;
			}

			avoidanceDelta.multiply(self.avoidFactor);
			self.velocity.add(avoidanceDelta);
			self.debug.avoidanceDelta = avoidanceDelta;

			// Attractors
			const attractionDelta = new Vector2();
			for (const attractor of this.attractors) {
				const distanceSq = self.position.distanceSq(attractor.position);
				if (distanceSq <= attractor.radius ** 2) {
					const distance = Math.sqrt(distanceSq);
					const delta = attractor.position.copy().subtract(self.position);
					if (!attractor.inverse) {
						delta.divide(Math.max(distance, 1)).multiply(attractor.radius - distance);
					}
					attractionDelta.add(delta.multiply(attractor.strength));
				}
			}

			self.velocity.add(attractionDelta);
			self.debug.attractionDelta = attractionDelta;

			// World
			if (self.position.x < self.edgeMargin)
				self.velocity.x += self.edgeTurnFactor;
			else if (self.position.x > this.world.size.x - self.edgeMargin)
				self.velocity.x -= self.edgeTurnFactor;
			if (self.position.y < self.edgeMargin)
				self.velocity.y += self.edgeTurnFactor;
			else if (self.position.y > this.world.size.y - self.edgeMargin)
				self.velocity.y -= self.edgeTurnFactor;

			// Apply & limit speed
			const speed = self.velocity.length;
			if (speed < self.minSpeed)
				self.velocity.divide(speed).multiply(self.minSpeed);
			if (speed > self.maxSpeed)
				self.velocity.divide(speed).multiply(self.maxSpeed);

			self.position.add(self.velocity);
		}

		this.notify();
	}
}
