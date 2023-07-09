// Exporting this from module context in the Renderer.svelte breaks everything:
export const COMPONENT = { R: 0, G: 1, B: 2, W: 3 };
export const COMPONENT_COUNT = Object.keys(COMPONENT).length;
