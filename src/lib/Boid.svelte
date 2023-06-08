<script lang="ts">
	import type Boid from "../models/Boid";

	import { coordinateSystem } from "../stores";

	export let boid: Boid;
</script>

<div
	class="boid"
	style:--coordinate-system-x={$coordinateSystem[0]}
	style:--coordinate-system-y={$coordinateSystem[1]}
	style:--x={boid.position.x}
	style:--y={boid.position.y}
	style:--angle={boid.velocity.angle}
>
	<div class="boid-graphic" />
</div>

<style>
	.boid {
		position: absolute;
		inset: 0;
		transform: translate(-50%, -50%)
			translateX(calc(100% / var(--coordinate-system-x) * var(--x)))
			translateY(calc(100% / var(--coordinate-system-y) * var(--y)))
			rotate(calc(1rad * var(--angle)));

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.boid-graphic {
		width: 5%;
		height: 2.5%;
		background-color: white;
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
	}
</style>
