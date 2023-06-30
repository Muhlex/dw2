import Vector2 from "../../../models/Vector2";

class CoordinateCanvas {
	protected canvas;
	private coordinates = new Vector2();
	private conversionScale = new Vector2();

	constructor(options: { canvas: HTMLCanvasElement | OffscreenCanvas, width: number, height: number, coordinates: Vector2 }) {
		const { canvas, width, height, coordinates } = options;
		this.canvas = canvas;
		this.updateCanvasResolution(width, height);
		this.updateCoordinates(coordinates);
	}

	updateCanvasResolution(x: number, y: number) {
		this.canvas.width = x;
		this.canvas.height = y;
		this.updateConversionScale();
	}

	updateCoordinates(coordinateSystem: Vector2) {
		this.coordinates.set(coordinateSystem);
		this.updateConversionScale();
	}

	private updateConversionScale() {
		this.conversionScale = new Vector2(this.canvas.width, this.canvas.height).divide(this.coordinates);
	}

	toCanvas(coords: Vector2): Vector2;
	toCanvas(x: number, y: number): Vector2;
	toCanvas(xOrCoords: Vector2 | number, y?: number) {
		const vector = (xOrCoords instanceof Vector2)
			? xOrCoords.copy()
			: new Vector2(xOrCoords, y);
		return vector.multiply(this.conversionScale);
	}
}

export default class CoordinateCanvas2D extends CoordinateCanvas {
	ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

	constructor(options: { canvas: HTMLCanvasElement | OffscreenCanvas, coordinates?: Vector2 }) {
		const { canvas, coordinates } = options;
		super({
			canvas,
			width: canvas.width, height: canvas.height,
			coordinates: coordinates || new Vector2(),
		});
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("2D canvas context unavailable.");
		this.ctx = ctx;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	circle(x: number, y: number, radius: number) {
		const screenPos = this.toCanvas(x, y);
		const screenRadius = this.toCanvas(radius, radius);
		this.ctx.beginPath();
		this.ctx.ellipse(screenPos.x, screenPos.y, screenRadius.x, screenRadius.y, 0, 0, Math.PI * 2);
	}
}
