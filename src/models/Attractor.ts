import Entity from "./Entity";

export default class Attractor extends Entity {
	radius = 250;
	strength = 0.0015;
	inverse = false;

	constructor(options: ConstructorParameters<typeof Entity>[0] & Partial<Attractor> = {}) {
		super(options);

		Object.assign(this, options);
	}
}
