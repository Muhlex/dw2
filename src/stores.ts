import { readable, derived } from "svelte/store";

export const coordinateSystem = readable<[number, number]>([100, 100]);
export const fps = readable(60);
export const frameDuration = derived(fps, $fps => 1000 / $fps);
