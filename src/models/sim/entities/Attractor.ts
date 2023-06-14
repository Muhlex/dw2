import { remap } from "../../../util";
import Vector2 from "../../Vector2";
import Entity from "./Entity";

export default class Attractor extends Entity {
	static readonly className = "Attractor";

	radius = { start: 50, end: 200 };
	strength = { start: 0.75, end: 0 };

	constructor(options: ConstructorParameters<typeof Entity>[0] & Partial<Attractor> = {}) {
		super(options);
		this.applyOptions(options);
	}

	attract(entity: Entity & { velocity: Vector2 }) {
		const delta = this.position.copy().subtract(entity.position);
		const distanceSq = delta.lengthSq;
		const outside = distanceSq > Math.max(this.radius.start, this.radius.end) ** 2;
		const inside = distanceSq < Math.min(this.radius.start, this.radius.end) ** 2;
		if (outside || inside) return new Vector2(0, 0);

		const distance = Math.sqrt(distanceSq);
		const strength = remap(
			distance,
			this.radius.start, this.radius.end,
			this.strength.start, this.strength.end,
		);
		delta
			.divide(Math.max(distance, 1)) // normalize
			.multiply(strength);
		entity.velocity.add(delta);
		return delta;
	}
}
