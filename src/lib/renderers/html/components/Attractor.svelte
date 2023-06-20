<script lang="ts">
	import type Attractor from "../../../../models/sim/entities/Attractor";

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
	class="attractor"
	style:--x={attractor.position.x}
	style:--y={attractor.position.y}
	style:--radius-inside={inner.radius}
	style:--radius-outside={outer.radius}
	style:--color-inside={inner.color}
	style:--color-outside={outer.color}
>
	<div class="attractor-graphic" />
</div>

<style>
	.attractor {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		aspect-ratio: 1;

		transform: translate(-50%, -50%)
			translateX(calc(100% / var(--world-size-x) * var(--x)))
			translateY(calc(100% / var(--world-size-x) * var(--y)));

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.attractor-graphic {
		position: absolute;
		inset: 0;
		border-radius: 50%;

		--radius: calc(var(--radius-outside) / var(--world-size-x));
		--scale: calc(var(--radius) * 2);
		--inside-fraction: calc(var(--radius-inside) / var(--world-size-x) / var(--radius));
		background: radial-gradient(
			closest-side, transparent, transparent calc(100% * var(--inside-fraction) - (1px / var(--scale))),

			var(--color-inside) calc(100% * var(--inside-fraction)),
			var(--color-outside)
		);
		transform: scale(var(--scale));
	}
</style>
