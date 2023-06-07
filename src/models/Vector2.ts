export default class Vector2 {
	x: number;
	y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return `[${this.x}, ${this.y}]`;
	}

	get angle() {
		const angle = Math.atan2(-this.y, -this.x) + Math.PI;
		return angle;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	add(vector: Vector2) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	rotate(radians: number) {
		const { x, y } = this;
		this.x = x * Math.cos(radians) - y * Math.sin(radians);
		this.y = x * Math.sin(radians) + y * Math.cos(radians);
		return this;
	}
}
