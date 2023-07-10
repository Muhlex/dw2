import AttractorLine from "./AttractorLine";
import Entity from "./Entity";

import { clamp, remap } from "../../../util";

export default class DistanceSensor extends Entity {
	static override readonly className = "DistanceSensor";

	private _distance = 0;
	maxDistance = Infinity;
	attractFactor = 0;

	private attractor: AttractorLine;

	constructor(options: ConstructorParameters<typeof Entity>[0] & Partial<DistanceSensor> = {}) {
		super(options);
		this.attractor = new AttractorLine({ strength: { start: 0, end: 0 } });
		this.applyOptions(options);

		this.attractor.position = this.position;
	}

	get distance() {
		return this._distance;
	}
	set distance(value) {
		if (value === 0) value = this.maxDistance + 50;
		this._distance = value;

		this.onDistanceChange(value);
	}

	onDistanceChange(distance: number) {
		if (!this.simulation) return;

		this.attractFactor = distance <= this.maxDistance
			? clamp(remap(distance, 10, this.maxDistance, 1, 0.5), 0.75, 1)
			: 0;
		this.attractor.strength = { start: 0.2 * this.attractFactor, end: 4 * this.attractFactor };
		this.attractor.radius = { start: 0, end: (this.simulation?.world.size.x || 0) };
	}

	override onSpawn() {
		this.simulation?.spawn(this.attractor);
	}

	override onKill() {
		this.simulation?.kill(this.attractor);
	}
}
