import Simulation from "../Simulation";
import Vector2 from "../../Vector2";

export default class Entity {
	static readonly className: string = "Entity";

	protected simulation: Simulation | undefined;
	position: Vector2;

	protected lastTick: { position: Vector2 };
	interpolated;

	constructor(options: { position?: Vector2, x?: number, y?: number, simulation?: Simulation } = {}) {
		this.position = options.position || new Vector2(options.x, options.y);
		this.simulation = options.simulation;

		this.lastTick = this.cloneState();
		this.interpolated = { values: Entity.prototype.interpolate.call(this, 0, 1), available: false };
	}

	setSimulation(simulation: Simulation) {
		this.simulation = simulation;
	}

	applyOptions(options: Record<string, unknown>) {
		const clone = structuredClone(options);
		delete clone.x, delete clone.y;
		Object.assign(this, clone);
	}

	protected cloneState() {
		const { interpolated, lastTick, ...shallowClone } = this;
		return structuredClone(shallowClone);
	}

	protected interpolate(t: number, u: number) {
		return {}
	}

	onBeforeTick() {
		this.lastTick = this.cloneState();
		this.interpolated.available = true;
	}

	onTick() {}

	onBeforeFrame(t: number, u: number) {
		this.interpolated.values = this.interpolate(t, u);
	}
}
