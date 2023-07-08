<script lang="ts">
	import type Attractor from "../../../../../models/sim/entities/Attractor";

	export let attractor: Attractor;

	const maxDisplayedStrength = 2;

	// destructuring here leaves us with updates only when the values are actually different
	$: ({ radius: { start: startRadius, end: endRadius } } = attractor);
	$: ({ strength: { start: startStrength, end: endStrength } } = attractor);

	$: [inner, outer] = [
		{ radius: startRadius, strength: startStrength },
		{ radius: endRadius, strength: endStrength },
	].sort((a, b) => a.radius - b.radius).map(({ radius, strength }) => ({
		radius,
		color: `hsl(\
${strength < 0 ? "350" : "230"},\
${strength === 0 ? 0 : 100}%,\
55%,\
${Math.min(Math.abs(strength) / maxDisplayedStrength * 0.8, 0.8) + 0.1})`,
	}));
</script>

<div
	class="attractor-line"
	style:--x={attractor.position.x}
	style:--y={attractor.position.y}
	style:--radius-inside={inner.radius}
	style:--radius-outside={outer.radius}
	style:--color-inside={inner.color}
	style:--color-outside={outer.color}
>
	<div class="attractor-line-graphic" />
</div>

<style>
	.attractor-line {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		transform: translate(-50%, -50%)
			translateX(calc(100% / var(--world-size-x) * var(--x)))
			translateY(calc(100% / var(--world-size-y) * var(--y)))
			scaleY(10);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.attractor-line-graphic {
		position: absolute;
		inset: 0;

		--radius: calc(var(--radius-outside) / var(--world-size-x));
		--scale: calc(var(--radius) * 2);
		--inside-fraction: calc(var(--radius-inside) / var(--world-size-x) / var(--radius));
		background-image: linear-gradient(to right,
			var(--color-outside),
			var(--color-inside) calc(50% * (1 - var(--inside-fraction))),
			transparent calc(50% * (1 - var(--inside-fraction))),
			transparent calc(50% + 50% * var(--inside-fraction)),
			var(--color-inside) calc(50% + 50% * var(--inside-fraction)),
			var(--color-outside)
		);
		transform: scaleX(var(--scale));
	}
</style>
