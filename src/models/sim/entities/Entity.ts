import Simulation from "../Simulation";
import Vector2 from "../../Vector2";

export default class Entity {
	static readonly className: string = "Entity";

	protected simulation: Simulation | undefined;
	position: Vector2;

	protected lastTick;
	interpolated;

	constructor(options: { position?: Vector2, x?: number, y?: number, simulation?: Simulation } = {}) {
		this.position = options.position || new Vector2(options.x, options.y);
		this.simulation = options.simulation;

		this.lastTick = Entity.prototype.getLastTickCache.call(this);
		this.interpolated = { values: Entity.prototype.interpolate.call(this, 0, 1), available: false };
	}

	setSimulation(simulation: Simulation) {
		this.simulation = simulation;
	}

	applyOptions(options: Record<string, unknown>) {
		for (const key in options) {
			if (!(key in this)) continue;

			const option = options[key];
			const k = key as keyof this;
			if (this[k] instanceof Vector2 && option instanceof Vector2) {
				(this[k] as Vector2) = new Vector2(option.x, option.y);
			} else if (typeof this[k] === typeof option) {
				if (typeof this[k] === "object") {
					(this[k] as unknown) = structuredClone(option);
				} else {
					(this[k] as unknown) = option;
				}
			}
		}
	}

	protected getLastTickCache() {
		return {};
	}

	protected interpolate(t: number, u: number) {
		return {};
	}

	tick() {
		this.lastTick = this.getLastTickCache();
		this.interpolated.available = true;
		this.onTick();
	}

	protected onTick() {}

	frame(t: number, u: number) {
		this.interpolated.values = this.interpolate(t, u);
		this.onFrame();
	}

	protected onFrame() {}
}
