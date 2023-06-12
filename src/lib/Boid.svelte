<script lang="ts">
	import type Boid from "../models/sim/entities/Boid";

	export let boid: Boid;
</script>

<div
	class="boid"
	style:--x={boid.position.x}
	style:--y={boid.position.y}
	style:--angle={boid.velocity.angle}
	style:--color={boid.color}
	style:--size={boid.size}
>
	<div class="boid-graphic" />
</div>

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
