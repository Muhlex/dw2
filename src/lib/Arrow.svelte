<script lang="ts">
	import Vector2 from "../models/Vector2";

	export let direction: Vector2;
	export let position = new Vector2(0, 0);
	export let color = "white";
</script>

<div
	class="arrow"
	style:--position-x={position.x}
	style:--position-y={position.y}
	style:--direction-x={direction.x}
	style:--direction-y={direction.y}
	style:--angle={direction.angle}
	style:--length={direction.length}
	style:--color={color}
>
	<div class="arrow-graphic" />
</div>

<style>
	.arrow {
		position: absolute;
		inset: 0;

		--scale-x: calc(var(--length) / var(--world-size-x));
		transform-origin: left center;
		transform: translateY(-50%)
			translateX(calc(100% / var(--world-size-x) * var(--position-x)))
			translateY(calc(100% / var(--world-size-y) * var(--position-y)))
			rotate(calc(1rad * var(--angle)))
			scaleX(var(--scale-x));

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.arrow-graphic {
		position: relative;
		width: 100%;
		height: 1px;
		background-color: var(--color);
	}
	.arrow-graphic::after {
		content: "";
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%) scaleX(calc(1 / var(--scale-x)));
		background-color: inherit;

		width: 8px;
		height: 8px;
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
	}
</style>
