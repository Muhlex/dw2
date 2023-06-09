<script lang="ts">
	import Vector2 from "../models/Vector2";

	export let size: Vector2;
	export let position = new Vector2(0, 0);
	export let color = "white";
	export let opacity = 1.0;
	export let fill = false;
</script>

<div
	class="rect"
	class:fill
	style:--position-x={position.x}
	style:--position-y={position.y}
	style:--size-x={size.x}
	style:--size-y={size.y}
	style:--color={color}
	style:--opacity={opacity}
>
	<div class="rect-graphic" />
</div>

<style>
	.rect {
		position: absolute;
		inset: 0;

		--scale-x: calc(var(--size-x) / var(--world-size-x));
		--scale-y: calc(var(--size-y) / var(--world-size-y));
		transform-origin: left top;
		transform:
			translateX(calc(100% / var(--world-size-x) * var(--position-x)))
			translateY(calc(100% / var(--world-size-y) * var(--position-y)))
			scale(var(--scale-x), var(--scale-y));

		--horz-width: calc(1px / var(--scale-y));
		--vert-width: calc(1px / var(--scale-x));
		border-top-width: var(--horz-width);
		border-bottom-width: var(--horz-width);
		border-left-width: var(--vert-width);
		border-right-width: var(--vert-width);

		border-width: var(--horz-width) var(--vert-width);
		border-style: solid;
		border-color: var(--color);
		opacity: var(--opacity);
	}

	.rect.fill {
		border: none;
		background-color: var(--color);
	}
</style>
