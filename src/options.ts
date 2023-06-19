import { writable } from "svelte/store";
import { pick } from "./util";

import Boid from "./models/sim/entities/Boid";
import Attractor from "./models/sim/entities/Attractor";

export const defaults = {
	getBoid: () => pick(new Boid(),
		"color", "size",
		"minSpeed", "maxSpeed",
		"avoidRadius", "avoidFactor",
		"visionRadius", "centeringFactor", "matchingFactor",
		"edgeMargin", "edgeTurnFactor"
	),
	getAttractor: () => pick(new Attractor(), "radius", "strength")
};

export const getOptions = () => ({
	targetTps: 60,
	render: {
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
	entities: {
		selected: Boid,
		Boid: defaults.getBoid(),
		Attractor: defaults.getAttractor(),
	}
});

export default writable(getOptions());
