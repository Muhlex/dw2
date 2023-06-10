import type { ActionReturn } from 'svelte/action';

import options, { type SimulationOptions } from '../options';
import type Simulation from '../models/Simulation';

let $options: SimulationOptions;
options.subscribe(value => $options = value);

enum MouseButton { Primary, Middle, Secondary };

export const interact = (node: HTMLElement, simulation: Simulation): ActionReturn => {
	const keys = { active: new Set<KeyboardEvent["key"]>() };

	const onKeydown = ({ key }: KeyboardEvent) => {
		keys.active.add(key);
	};
	const onKeyup = ({ key }: KeyboardEvent) => {
		keys.active.delete(key);
	};
	const onBlur = () => {
		keys.active.clear();
	};

	const onPointerdown = ({ currentTarget, clientX, clientY, button }: PointerEvent) => {
		const { x, y, width, height } = (currentTarget as typeof node).getBoundingClientRect();
		const offset = { x: clientX - x, y: clientY - y };
		const coords = {
			x: offset.x / width * simulation.world.size.x,
			y: offset.y / height * simulation.world.size.y,
		};

		switch (button) {
			case MouseButton.Primary:
				let amount = 0;
				if (keys.active.has("Shift")) amount += 10;
				if (keys.active.has("Control")) amount += 100;
				if (keys.active.has("Alt")) amount += 500;
				amount ||= 1;

				for (let i = 0; i < amount; i++) {
					simulation.spawnBoid(coords.x, coords.y, $options.boids);
				}
				break;

			case MouseButton.Secondary:
				simulation.spawnAttractor(coords.x, coords.y, $options.attractors);
				break;

			case MouseButton.Middle:
				break;
		}
	};

	const onContextmenu = (event: MouseEvent) => {
		event.preventDefault();
	}

	node.addEventListener("pointerdown", onPointerdown);
	node.addEventListener("contextmenu", onContextmenu);
	window.addEventListener("keydown", onKeydown);
	window.addEventListener("keyup", onKeyup);
	window.addEventListener("blur", onBlur);

	return {
		update(newSimulation) {
			simulation = newSimulation;
		},
		destroy() {
			node.removeEventListener("pointerdown", onPointerdown);
			node.removeEventListener("contextmenu", onContextmenu);
			window.removeEventListener("keydown", onKeydown);
			window.removeEventListener("keyup", onKeyup);
			window.removeEventListener("blur", onBlur);
		},
	};
};
