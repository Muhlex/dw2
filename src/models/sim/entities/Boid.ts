import Entity from "./Entity";
import Attractor from "./Attractor";
import AttractorLine from "./AttractorLine";
import Vector2 from "../../Vector2";

import { remap } from "../../../util";

export default class Boid extends Entity {
	static override readonly className = "Boid";

	velocity: Vector2;

	color: string;
	size = 25;

	minSpeed = 3;
	maxSpeed = 8;

	avoidRadius = 40;
	avoidFactor = 0.04;

	visionRadius = 100;
	centeringFactor = 0.0005;
	matchingFactor = 0.04;

	edgeMargin = 200;
	edgeTurnFactor = 0.12;

	prototypeTweaks = false;

	meta = {
		avoidanceDelta: new Vector2(),
		centeringDelta: new Vector2(),
		matchingDelta: new Vector2(),
		attractionDelta: new Vector2(),
	};

	protected override lastTick;
	override interpolated;

	constructor(options: ConstructorParameters<typeof Entity>[0] & Partial<Boid> = {}) {
		super(options);
		this.velocity = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
		this.color = `hsl(${Math.random()}turn 100% 70%)`;
		this.applyOptions(options);

		this.lastTick = Boid.prototype.getLastTickCache.call(this);
		this.interpolated = { values: Boid.prototype.interpolate.call(this, 0, 1), available: false };
	}

	protected override getLastTickCache() {
		return { position: this.position.copy(), velocity: this.velocity.copy() };
	}

	protected override interpolate(t: number, u: number) {
		return {
			position: this.position.copy().lerp(this.lastTick.position, u),
			velocity: this.velocity.copy().lerp(this.lastTick.velocity, u),
		};
	}

	protected override onTick() {
		if (!this.simulation) return;

		// Other Boids
		this.meta.centeringDelta.multiply(0);
		this.meta.matchingDelta.multiply(0);

		const avoidanceDelta = new Vector2();
		const visiblePositionsMean = new Vector2();
		const visibleVelocitiesMean = new Vector2();
		let visibleCount = 0;

		for (const other of this.simulation.entities.get(Boid)) {
			if (this === other) continue;

			const distanceSq = this.position.distanceSq(other.position);
			const visionRadiusSq = this.visionRadius ** 2;
			const avoidRadiusSq = this.avoidRadius ** 2;
			if (distanceSq > visionRadiusSq && distanceSq > avoidRadiusSq) continue;

			if (distanceSq <= avoidRadiusSq) {
				const distance = Math.sqrt(distanceSq);
				const delta = this.position.copy()
					.subtract(other.position)
					.divide(Math.max(distance, 1))
					.multiply(this.avoidRadius - distance);
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
				.subtract(this.position).multiply(this.centeringFactor);
			const matchingDelta = visibleVelocitiesMean.copy()
				.subtract(this.velocity).multiply(this.matchingFactor);
			this.velocity.add(centeringDelta).add(matchingDelta);

			this.meta.centeringDelta = centeringDelta;
			this.meta.matchingDelta = matchingDelta;
		}

		avoidanceDelta.multiply(this.avoidFactor);
		this.velocity.add(avoidanceDelta);
		this.meta.avoidanceDelta = avoidanceDelta;

		// Attractors
		this.meta.attractionDelta.multiply(0);
		const attractors = [
			...this.simulation.entities.get(Attractor),
			...this.simulation.entities.get(AttractorLine),
		];
		for (const attractor of attractors) {
			this.meta.attractionDelta.add(attractor.attract(this));
		}

		if (this.prototypeTweaks) {
			const attractionLength = this.meta.attractionDelta.length;
			this.maxSpeed = remap(attractionLength, 0, 1, 5, 30);
			this.avoidRadius = attractionLength > 0 ? 60 : 108;
		}

		// World
		if (this.position.x < this.edgeMargin)
			this.velocity.x += this.edgeTurnFactor;
		else if (this.position.x > this.simulation.world.size.x - this.edgeMargin)
			this.velocity.x -= this.edgeTurnFactor;
		if (this.position.y < this.edgeMargin)
			this.velocity.y += this.edgeTurnFactor;
		else if (this.position.y > this.simulation.world.size.y - this.edgeMargin)
			this.velocity.y -= this.edgeTurnFactor;

		// Apply & limit speed
		const speed = this.velocity.length;
		if (speed < this.minSpeed)
			this.velocity.divide(speed).multiply(this.minSpeed);
		if (speed > this.maxSpeed)
			this.velocity.divide(speed).multiply(this.maxSpeed);

		this.position.add(this.velocity);
	}
}
