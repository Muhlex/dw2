import CoordinateCanvas2D from "../coordinate-canvas-api";

import type Boid from "../../../../models/sim/entities/Boid";
import Vector2 from "../../../../models/Vector2";

let api: CoordinateCanvas2D;

export enum MessageType {
	Setup,
	Render,
}

export type SetupMessage = {
	type: MessageType.Setup,
	offscreenCanvas: OffscreenCanvas;
};

export type RenderMessage = {
	type: MessageType.Render;
	boids: Set<Boid>;
	worldX: number;
	worldY: number;
	colGap: number;
	rowGap: number;
	boidScale: number;
	boidIntensity: number;
	ledRadius: number;
};

self.onmessage = ({ data }: MessageEvent<SetupMessage | RenderMessage>) => {
	if (data.type === MessageType.Setup) {
		api = new CoordinateCanvas2D({ canvas: data.offscreenCanvas });
	} else {
		const { boids, worldX, worldY, colGap, rowGap, boidScale, boidIntensity, ledRadius } = data;
		api.clear();

		for (let y = rowGap / 2; y < worldY; y += rowGap) {
			for (let x = colGap / 2; x < worldX; x += colGap) {
				let brightness = 0;
				for (const boid of boids) {
					const maxDistance = boid.size * boidScale;
					const distanceSq = boid.interpolated.values.position.distanceSq(new Vector2(x, y));
					if (distanceSq > maxDistance ** 2) continue;
					const distance = Math.sqrt(distanceSq);
					brightness += (1 - distance / maxDistance) * boidIntensity;
				}
				const hsl = `40, 50%, ${(0.2 + 0.75 * brightness) * 100}%`;
				api.ctx.fillStyle = `hsl(${hsl}, ${brightness * 0.8 + 0.2})`;
				api.circle(x, y, ledRadius);
				api.ctx.fill();
			}
		}
	}
};
