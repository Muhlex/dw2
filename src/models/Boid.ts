import Vector2 from "./Vector2";

export default class Boid {
	position: Vector2;
	velocity: Vector2;

	constructor(x: number, y: number) {
		this.position = new Vector2(x, y);
		this.velocity = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
	}
}
