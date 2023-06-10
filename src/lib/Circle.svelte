<script lang="ts">
	import Vector2 from "../models/Vector2";

	export let radius: number;
	export let position = new Vector2(0, 0);
	export let color = "white";
	export let opacity = 1.0;
	export let fill = false;
</script>

<div
	class="circle"
	class:fill
	style:--position-x={position.x}
	style:--position-y={position.y}
	style:--radius={radius}
	style:--color={color}
	style:--opacity={opacity}
>
	<div class="circle-graphic" />
</div>

<style>
	.circle {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		aspect-ratio: 1;

		--scale: calc(var(--radius) * 2 / var(--world-size-x));
		transform: translate(-50%, -50%)
			translateX(calc(100% / var(--world-size-x) * var(--position-x)))
			translateY(calc(100% / var(--world-size-x) * var(--position-y)))
			scale(var(--scale));

		border: calc(1px / var(--scale)) solid;
		border-color: var(--color);
		border-radius: 50%;
		opacity: var(--opacity);
	}

	.circle.fill {
		border: none;
		background: var(--color);
	}
</style>
