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
		"prototypeTweaks",
	),
	getAttractor: () => pick(new Attractor(), "radius", "strength"),
};

export const getOptions = () => {
	const selected: typeof Entity = Boid;
	const attractorOptions = defaults.getAttractor();
	return {
		targetTps: 60,
		renderers: [rendererGroups[0].renderers[0]],
		showControls: true,
		entities: {
			selected,
			Boid: defaults.getBoid(),
			Attractor: attractorOptions,
			AttractorLine: attractorOptions,
		},
		websockets: {
			sonarMaxRange: 150,
		},
	};
};

export default writable(getOptions());
