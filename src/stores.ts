import { readable, derived } from "svelte/store";

export const fps = readable(60);
export const frameDuration = derived(fps, $fps => 1000 / $fps);
