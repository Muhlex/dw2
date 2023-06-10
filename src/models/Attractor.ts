import Vector2 from "./Vector2";

export default class Attractor {
	position: Vector2;

	radius = 250;
	strength = 0.001;
	inverse = false;

	constructor(x = 0, y = 0, options?: Partial<Attractor>) {
		this.position = new Vector2(x, y);

		Object.assign(this, options);
	}
}
