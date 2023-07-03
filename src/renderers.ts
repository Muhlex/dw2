import HTMLDebugRenderer from "./lib/renderers/html/debug/Renderer.svelte";
import HTMLDebugControls from "./lib/renderers/html/debug/Controls.svelte";
import HTMLLEDRenderer from "./lib/renderers/html/led/Renderer.svelte";
import HTMLLEDControls from "./lib/renderers/html/led/Controls.svelte";
import CanvasBasicRenderer from "./lib/renderers/canvas/basic/Renderer.svelte";
import CanvasLEDRenderer from "./lib/renderers/canvas/led/Renderer.svelte";
import CanvasLEDControls from "./lib/renderers/canvas/led/Controls.svelte";
import HeadlessLEDRenderer from "./lib/renderers/headless/led-stripes/Renderer.svelte";
import HeadlessLEDControls from "./lib/renderers/headless/led-stripes/Controls.svelte";

import type { SvelteComponentTyped } from "svelte";
import type Simulation from "./models/sim/Simulation";

type Renderer = {
	name: string;
	component: typeof SvelteComponentTyped<{ simulation: Simulation }>
	controls?: typeof SvelteComponentTyped<Record<string, never>>;
};

type RendererGroup = {
	name: string;
	renderers: Renderer[];
}

const groups: RendererGroup[] = [{
	name: "HTML",
	renderers: [{
		name: "Debug",
		component: HTMLDebugRenderer,
		controls: HTMLDebugControls,
	}, {
		name: "LEDs",
		component: HTMLLEDRenderer,
		controls: HTMLLEDControls,
	}],
}, {
	name: "Canvas",
	renderers: [{
		name: "Basic",
		component: CanvasBasicRenderer,
	}, {
		name: "LEDs",
		component: CanvasLEDRenderer,
		controls: CanvasLEDControls,
	}],
}, {
	name: "Headless",
	renderers: [{
		name: "LED Stripes",
		component: HeadlessLEDRenderer,
		controls: HeadlessLEDControls,
	}],
}];
export default groups;

export const getRendererGroup = (() => {
	const rendererToGroup = new Map<Renderer, RendererGroup>();
	for (const group of groups) {
		for (const renderer of group.renderers) {
			rendererToGroup.set(renderer, group);
		}
	}
	return (renderer: Renderer) => rendererToGroup.get(renderer);
})();
