import AttractorLine from "./AttractorLine";
import Entity from "./Entity";

export default class DistanceSensor extends Entity {
	static override readonly className = "DistanceSensor";

	private _distance = 0;
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
		this._distance = value;

		this.onDistanceChange(value);
	}

	onDistanceChange(distance: number) {
		const attractFactor = distance === 0 ? 0 : Math.max(0, 150 - distance) / 150;
		this.attractor.strength = { start: 0.1, end: 0.4 * attractFactor };
		this.attractor.radius = { start: 40, end: 200 * attractFactor };
	}

	override onSpawn() {
		this.simulation?.spawn(this.attractor);
	}

	override onKill() {
		this.simulation?.kill(this.attractor);
	}
}
