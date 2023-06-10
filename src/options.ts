import { writable } from "svelte/store";
import { pick } from "./util";
import Boid from "./models/Boid";
import Attractor from "./models/Attractor";

const getBoidsConfig = () => pick(
	new Boid(),
	"color", "size",
	"minSpeed", "maxSpeed",
	"avoidRadius", "avoidFactor",
	"visionRadius", "centeringFactor", "matchingFactor",
	"edgeMargin", "edgeTurnFactor",
);

const getAttractorsConfig = () => pick(new Attractor(), "radius", "strength", "inverse");

export type SimulationOptions = {
	render: {
		targetTps: number;
		debug: {
			avoidanceDelta: boolean;
			centeringDelta: boolean;
			matchingDelta: boolean;
			attractionDelta: boolean;
			avoidRadius: boolean;
			visionRadius: boolean;
			edgeMargin: boolean;
		};
	};
	boids: ReturnType<typeof getBoidsConfig>;
	attractors: ReturnType<typeof getAttractorsConfig>;
};

const options = writable<SimulationOptions>({
	render: {
		targetTps: 60,
		debug: {
			avoidanceDelta: false,
			centeringDelta: false,
			matchingDelta: false,
			attractionDelta: false,
			avoidRadius: false,
			visionRadius: false,
			edgeMargin: false,
		},
	},
	boids: getBoidsConfig(),
	attractors: getAttractorsConfig(),
});
export default options;

export const resetBoids = () => {
	options.update((options) => ({ ...options, boids: getBoidsConfig() }));
};
export const resetAttractors = () => {
	options.update((options) => ({ ...options, attractors: getAttractorsConfig() }));
};
