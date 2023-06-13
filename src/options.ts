import { writable } from "svelte/store";
import { pick } from "./util";

import Entity from "./models/sim/entities/Entity";
import Boid from "./models/sim/entities/Boid";
import Attractor from "./models/sim/entities/Attractor";

class SimulationEntityDefaults {
	getters = {
		[Boid.className]: () => pick(new Boid(),
			"color", "size",
			"minSpeed", "maxSpeed",
			"avoidRadius", "avoidFactor",
			"visionRadius", "centeringFactor", "matchingFactor",
			"edgeMargin", "edgeTurnFactor"
		),
		[Attractor.className]: () => pick(new Attractor(), "radius", "strength", "inverse"),
	}

	values = {
		[Boid.className]: this.getters.Boid(),
		[Attractor.className]: this.getters.Attractor(),
	}

	get(constructor: typeof Entity) {
		return this.values[constructor.className as (keyof typeof this.values)] || {};
	}

	reset(constructor: typeof Entity) {
		const key = constructor.className as (keyof typeof this.values);
		const getter = this.getters[key];
		(this.values[key] as ReturnType<typeof getter>) = getter();
		options.update(o => o);
	}
}

export type SimulationOptions = {
	targetTps: number;
	render: {
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
	entities: {
		selected: {
			constructor: typeof Entity;
		};
		defaults: SimulationEntityDefaults;
	};
};

const options = writable<SimulationOptions>({
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
		selected: { constructor: Boid },
		defaults: new SimulationEntityDefaults(),
	}
});
export default options;
