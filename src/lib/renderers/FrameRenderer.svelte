<script lang="ts" context="module">
	export type SimulationEvent = { simulation: Simulation };
</script>

<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from "svelte";

	import type Simulation from "../../models/sim/Simulation";

	export let simulation: Simulation;

	const dispatch = createEventDispatcher<{
		"mount": SimulationEvent;
		"frame": SimulationEvent;
	}>();

	const render = () => dispatch("frame", { simulation });
	onMount(() => simulation.renderCallbacks.add(render));
	onDestroy(() => simulation.renderCallbacks.delete(render));

	onMount(() => dispatch("mount", { simulation }));
</script>
