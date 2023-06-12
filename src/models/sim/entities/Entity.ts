import Simulation from "../Simulation";
import Vector2 from "../../Vector2";

export default class Entity {
	static readonly className: string = "Entity";

	protected simulation: Simulation | undefined;
	position: Vector2;

	constructor(options: { position?: Vector2, x?: number, y?: number, simulation?: Simulation } = {}) {
		this.simulation = options.simulation;
		this.position = options.position || new Vector2(options.x, options.y);
	}

	setSimulation(simulation: Simulation) {
		this.simulation = simulation;
	}

	tick() {}
}
