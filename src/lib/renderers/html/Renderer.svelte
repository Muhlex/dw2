<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export const renderOptions = writable({
		debug: {
			avoidanceDelta: false,
			centeringDelta: false,
			matchingDelta: false,
			attractionDelta: false,
			avoidRadius: false,
			visionRadius: false,
			edgeMargin: false,
		},
	});
</script>

<script lang="ts">
	import Vector2 from "../../../models/Vector2";

	import type Simulation from "../../../models/sim/Simulation";
	import Boid from "../../../models/sim/entities/Boid";
	import Attractor from "../../../models/sim/entities/Attractor";

	import BoidComponent from "./components/Boid.svelte";
	import AttractorComponent from "./components/Attractor.svelte";
	import Arrow from "./components/Arrow.svelte";
	import Circle from "./components/Circle.svelte";
	import Rect from "./components/Rect.svelte";

	export let simulation: Simulation;

	$: boids = [...$simulation.entities.get(Boid)];
	$: attractors = [...$simulation.entities.get(Attractor)];
</script>

{#each attractors as attractor (attractor)}
	<AttractorComponent {attractor} />
{/each}
{#each boids as boid (boid)}
	<BoidComponent {boid} />
	{#if $renderOptions.debug.edgeMargin}
		<Rect
			color={boid.color}
			opacity={0.25}
			position={new Vector2(boid.edgeMargin, boid.edgeMargin)}
			size={$simulation.world.size.copy().subtract(new Vector2(boid.edgeMargin * 2, boid.edgeMargin * 2))}
		/>
	{/if}
	{#if $renderOptions.debug.avoidanceDelta}
		<Arrow
			color="red"
			position={boid.position}
			direction={boid.debug.avoidanceDelta.copy().multiply(1000)}
		/>
	{/if}
	{#if $renderOptions.debug.centeringDelta}
		<Arrow
			color="lime"
			position={boid.position}
			direction={boid.debug.centeringDelta.copy().multiply(1000)}
		/>
	{/if}
	{#if $renderOptions.debug.matchingDelta}
		<Arrow
			color="yellow"
			position={boid.position}
			direction={boid.debug.matchingDelta.copy().multiply(1000)}
		/>
	{/if}
	{#if $renderOptions.debug.attractionDelta}
		<Arrow
			color="white"
			position={boid.position}
			direction={boid.debug.attractionDelta.copy().multiply(1000)}
		/>
	{/if}
	{#if $renderOptions.debug.avoidRadius}
		<Circle color="red" position={boid.position} radius={boid.avoidRadius} />
	{/if}
	{#if $renderOptions.debug.visionRadius}
		<Circle color="white" position={boid.position} radius={boid.visionRadius} />
	{/if}
{/each}
