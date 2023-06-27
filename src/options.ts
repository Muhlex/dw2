import { writable } from "svelte/store";
import { pick } from "./util";

import type Entity from "./models/sim/entities/Entity";
import Boid from "./models/sim/entities/Boid";
import Attractor from "./models/sim/entities/Attractor";

import rendererGroups from "./renderers";

export const defaults = {
	getBoid: () => pick(new Boid(),
		"color", "size",
		"minSpeed", "maxSpeed",
		"avoidRadius", "avoidFactor",
		"visionRadius", "centeringFactor", "matchingFactor",
		"edgeMargin", "edgeTurnFactor",
	),
	getAttractor: () => pick(new Attractor(), "radius", "strength"),
};

export const getOptions = () => {
	const selected: typeof Entity = Boid;
	return {
		targetTps: 60,
		renderer: rendererGroups[0].renderers[0],
		showControls: true,
		entities: {
			selected,
			Boid: defaults.getBoid(),
			Attractor: defaults.getAttractor(),
		},
	};
};

export default writable(getOptions());
