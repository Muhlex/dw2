import { pick } from "../util";

import Store from "./Store";
import Vector2 from "./Vector2";
import World from "./World";
import Boid from "./Boid";

enum MouseButton { Primary, Middle, Secondary };

export default class Simulation extends Store {
	world = new World(1000, 1000);
	boids: Boid[] = [];

	boidsConfig: Partial<Boid>;

	constructor() {
		super();
		this.resetConfig();
	}

	reset() {
		this.boids = [];
		this.notify();
	}

	spawnBoid(x = 0, y = 0) {
		this.boids.push(new Boid(x, y, this.boidsConfig));
	}

	spawnGrid(cols = 10, rows = 10) {
		const colGap = this.world.size.x / cols, rowGap = this.world.size.y / rows;
		for (let i = colGap / 2; i < this.world.size.x; i += colGap) {
			for (let j = rowGap / 2; j < this.world.size.y; j += rowGap) {
				this.spawnBoid(i, j);
			}
		}
		this.notify();
	}

	resetConfig() {
		this.boidsConfig = pick(new Boid(),
			"color", "size",
			"minSpeed", "maxSpeed",
			"avoidRadius", "avoidFactor",
			"visionRadius", "centeringFactor", "matchingFactor",
			"edgeMargin", "edgeTurnFactor",
		);
	}

	applyConfig() {
		for (const boid of this.boids) {
			Object.assign(boid, this.boidsConfig);
		}
	}

	tick() {
		for (const self of this.boids) {
			self.debug.centeringDelta.multiply(0);
			self.debug.matchingDelta.multiply(0);

			// Teleport boids to opposite edge when leaving an edge:
			// if (self.position.x < 0) self.position.x = this.world.size.x;
			// else if (self.position.x > this.world.size.x) self.position.x = 0;
			// if (self.position.y < 0) self.position.y = this.world.size.y;
			// else if (self.position.y > this.world.size.y) self.position.y = 0;

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
					const distance = self.position.distance(other.position);
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

			if (self.position.x < self.edgeMargin)
				self.velocity.x += self.edgeTurnFactor;
			else if (self.position.x > this.world.size.x - self.edgeMargin)
				self.velocity.x -= self.edgeTurnFactor;
			if (self.position.y < self.edgeMargin)
				self.velocity.y += self.edgeTurnFactor;
			else if (self.position.y > this.world.size.y - self.edgeMargin)
				self.velocity.y -= self.edgeTurnFactor;

			const speed = self.velocity.length;
			if (speed < self.minSpeed)
				self.velocity.divide(speed).multiply(self.minSpeed);
			if (speed > self.maxSpeed)
				self.velocity.divide(speed).multiply(self.maxSpeed);

			self.position.add(self.velocity);
		}
		this.notify();
	}

	onClick(x: number, y: number, button: MouseButton) {
		({
			[MouseButton.Primary]: () => {
				this.spawnBoid(x, y);
			},
			[MouseButton.Secondary]: () => {
				for (let i = 0; i < 10; i++) {
					this.spawnBoid(x, y);
				}
			},
			[MouseButton.Middle]: () => {
				for (let i = 0; i < 100; i++) {
					this.spawnBoid(x, y);
				}
			},
		}[button]?.());
		this.notify();
	}
}
