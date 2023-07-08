import { remap } from "../../../util";
import Vector2 from "../../Vector2";
import Attractor from "./Attractor";
import Entity from "./Entity";

export default class AttractorLine extends Attractor {
	static override readonly className = "AttractorLine";

	constructor(options: ConstructorParameters<typeof Entity>[0] & Partial<Attractor> = {}) {
		super(options);
		this.applyOptions(options);
	}

	override attract(entity: Entity & { velocity: Vector2 }) {
		const delta = this.position.x - entity.position.x;
		const distance = Math.abs(delta);

		const outside = distance > Math.max(this.radius.start, this.radius.end);
		const inside = distance < Math.min(this.radius.start, this.radius.end);
		if (outside || inside) return new Vector2(0, 0);

		const strength = remap(
			distance,
			this.radius.start, this.radius.end,
			this.strength.start, this.strength.end,
		);
		const direction = delta < 0 ? -1 : 1;
		const attractionDelta = new Vector2(strength * direction, 0);
		entity.velocity.add(attractionDelta);
		return attractionDelta;
	}
}
