import HTMLDebugRenderer from "./lib/renderers/html/debug/Renderer.svelte";
import HTMLDebugControls from "./lib/renderers/html/debug/Controls.svelte";
import HTMLLEDRenderer from "./lib/renderers/html/led/Renderer.svelte";
import HTMLLEDControls from "./lib/renderers/html/led/Controls.svelte";
import CanvasBasicRenderer from "./lib/renderers/canvas/basic/Renderer.svelte";
import CanvasLEDRenderer from "./lib/renderers/canvas/led/Renderer.svelte";
import CanvasLEDControls from "./lib/renderers/canvas/led/Controls.svelte";

export default [{
	groupName: "HTML",
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
	groupName: "Canvas",
	renderers: [{
		name: "Basic",
		component: CanvasBasicRenderer,
	}, {
		name: "LEDs",
		component: CanvasLEDRenderer,
		controls: CanvasLEDControls,
	}],
}];
