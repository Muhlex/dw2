import { writable } from "svelte/store";
import { pick } from "./util";

import Boid from "./models/sim/entities/Boid";
import Attractor from "./models/sim/entities/Attractor";

import HTMLRenderer from "./lib/renderers/html/Renderer.svelte";
import HTMLControls from "./lib/renderers/html/Controls.svelte";
import LEDRenderer from "./lib/renderers/led/Renderer.svelte";
import LEDControls from "./lib/renderers/led/Controls.svelte";

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

export const renderers = [{
	name: "HTML",
	component: HTMLRenderer,
	controls: HTMLControls,
}, {
	name: "LEDs",
	component: LEDRenderer,
	controls: LEDControls,
}];

export const getOptions = () => ({
	targetTps: 60,
	renderer: renderers[0],
	entities: {
		selected: Boid,
		Boid: defaults.getBoid(),
		Attractor: defaults.getAttractor(),
	}
});

export default writable(getOptions());
