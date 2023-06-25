import HTMLDebugRenderer from "./lib/renderers/html/debug/Renderer.svelte";
import HTMLDebugControls from "./lib/renderers/html/debug/Controls.svelte";
import CanvasBasicRenderer from "./lib/renderers/canvas/basic/Renderer.svelte";
import LEDRenderer from "./lib/renderers/html/led/Renderer.svelte";
import LEDControls from "./lib/renderers/html/led/Controls.svelte";

export default [{
	groupName: "HTML",
	renderers: [{
		name: "Debug",
		component: HTMLDebugRenderer,
		controls: HTMLDebugControls,
	}, {
		name: "LEDs",
		component: LEDRenderer,
		controls: LEDControls,
	}],
}, {
	groupName: "Canvas",
	renderers: [{
		name: "Basic",
		component: CanvasBasicRenderer,
	}],
}];
