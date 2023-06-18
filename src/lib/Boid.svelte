<script lang="ts">
	import type Boid from "../models/sim/entities/Boid";

	export let boid: Boid;

	$: render = boid.interpolated.available;
	$: ({ position: { x, y }, velocity: { angle } } = boid.interpolated.values);
	$: ({ color, size } = boid);
</script>

{#if render}
	<div
		class="boid"
		style:--x={x}
		style:--y={y}
		style:--angle={angle}
		style:--color={color}
		style:--size={size}
	>
		<div class="boid-graphic" />
	</div>
{/if}

<style>
	.boid {
		position: absolute;
		inset: 0;
		transform: translate(-50%, -50%)
			translateX(calc(100% / var(--world-size-x) * var(--x)))
			translateY(calc(100% / var(--world-size-y) * var(--y)))
			rotate(calc(1rad * var(--angle)))
			scale(calc(var(--size) / var(--world-size-x)));

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.boid-graphic {
		width: 100%;
		aspect-ratio: 1.5;
		background: var(--color);
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
	}
</style>
