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

	get lengthSq() {
		return this.x * this.x + this.y * this.y;
	}

	get length() {
		return Math.sqrt(this.lengthSq);
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	add(vector: Vector2) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	subtract(vector: Vector2) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}

	multiply(scalar: number): this;
	multiply(vector: Vector2): this;
	multiply(scalarOrVector: number | Vector2) {
		if (typeof scalarOrVector === "number") {
			this.x *= scalarOrVector;
			this.y *= scalarOrVector;
		} else {
			this.x *= scalarOrVector.x;
			this.y *= scalarOrVector.y;
		}
		return this;
	}

	divide(scalar: number): this;
	divide(vector: Vector2): this;
	divide(scalarOrVector: number | Vector2) {
		if (typeof scalarOrVector === "number") {
			this.x /= scalarOrVector;
			this.y /= scalarOrVector;
		} else {
			this.x /= scalarOrVector.x;
			this.y /= scalarOrVector.y;
		}
		return this;
	}

	normalize() {
		return this.divide(this.length || 1);
	}

	rotate(radians: number) {
		const { x, y } = this;
		this.x = x * Math.cos(radians) - y * Math.sin(radians);
		this.y = x * Math.sin(radians) + y * Math.cos(radians);
		return this;
	}

	equals(vector: Vector2) {
		return (vector.x === this.x) && (vector.y === this.y);
	}
}
