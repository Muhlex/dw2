import Vector2 from "../Vector2";

export default class World {
	size: Vector2;

	constructor(sizeX: number, sizeY: number) {
		this.size = new Vector2(sizeX, sizeY);
	}
}
