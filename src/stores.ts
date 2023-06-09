import { writable, derived } from "svelte/store";

export const targetFps = writable(60);
export const targetFrameDuration = derived(targetFps, $fps => 1000 / $fps);
