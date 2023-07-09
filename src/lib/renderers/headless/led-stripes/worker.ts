import Vector2 from "../../../../models/Vector2";
import Boid from "../../../../models/sim/entities/Boid";

import { COMPONENT, COMPONENT_COUNT } from "./shared";

declare const self: Worker;

self.onmessage = ({ data }: MessageEvent<{
	options: { boidScale: number, boidIntensity: number },
	boids: { position: { x: number, y: number }, size: number }[],
	ledsMeta: {
		i: number;
		col: number;
		row: number;
		x: number;
		y: number;
	}[],
	matrix: Uint8ClampedArray,
}>) => {
	const { options, boids, ledsMeta, matrix } = data;

	const boidsHydrated = boids.map(boid => {
		const position = new Vector2(boid.position.x, boid.position.y);
		return new Boid({ ...boid, position });
	});

	const leds: { brightness: number }[] = [];
	for (const led of ledsMeta) {
		let brightness = 0;
		const ledPosition = new Vector2(led.x, led.y);
		for (const boid of boidsHydrated) {
			const maxDistance = boid.size * options.boidScale;
			const distanceSq = boid.position.distanceSq(ledPosition);
			if (distanceSq > maxDistance ** 2) continue;
			const distance = Math.sqrt(distanceSq);
			brightness += (1 - distance / maxDistance) * options.boidIntensity;
		}
		leds.push({ brightness: Math.min(brightness, 1) });
	}

	for (const [i, { brightness }] of leds.entries()) {
		const ledOffset = i * COMPONENT_COUNT;
		// Leads to physical brightness perception becoming *more linear*:
		const brightnessExp = brightness ** 2;
		matrix[ledOffset + COMPONENT.R] = 0;
		matrix[ledOffset + COMPONENT.G] = Math.ceil(brightnessExp * 255);
		matrix[ledOffset + COMPONENT.B] = Math.ceil(brightnessExp * 150);
		matrix[ledOffset + COMPONENT.W] = Math.ceil(brightnessExp * 70);
	}

	self.postMessage(matrix, [matrix.buffer]);
};
