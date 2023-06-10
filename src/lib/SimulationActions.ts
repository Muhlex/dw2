import type { Action } from 'svelte/action';
import type { WithTarget } from "../util";
import type Simulation from "../models/Simulation";

enum MouseButton { Primary, Middle, Secondary };

export const interact: Action<HTMLElement, Simulation> = (node, simulation) => {
	const keys = {
		active: new Set<KeyboardEvent["key"]>(),
	};

	const onKeydown = ({ key }: KeyboardEvent) => {
		keys.active.add(key);
	};
	const onKeyup = ({ key }: KeyboardEvent) => {
		keys.active.delete(key);
	};
	const onBlur = () => {
		keys.active.clear();
	};

	const onPointerdown = ({ currentTarget, clientX, clientY, button }: WithTarget<PointerEvent, typeof node>) => {
		const { x, y, width, height } = currentTarget.getBoundingClientRect();
		const offset = { x: clientX - x, y: clientY - y };
		const coords = {
			x: offset.x / width * simulation.world.size.x,
			y: offset.y / height * simulation.world.size.y,
		};

		({
			[MouseButton.Primary]() {
				let amount = 0;
				if (keys.active.has("Shift")) amount += 10;
				if (keys.active.has("Control")) amount += 100;
				if (keys.active.has("Alt")) amount += 500;
				amount ||= 1;

				for (let i = 0; i < amount; i++) {
					simulation.spawnBoid(coords.x, coords.y);
				}
			},
			[MouseButton.Secondary]() {
			},
			[MouseButton.Middle]() {
			},
		}[button]?.());
	};

	node.addEventListener("pointerdown", onPointerdown);
	window.addEventListener("keydown", onKeydown);
	window.addEventListener("keyup", onKeyup);
	window.addEventListener("blur", onBlur);

	return {
		update(newSimulation) {
			simulation = newSimulation;
		},
		destroy() {
			node.removeEventListener("pointerdown", onPointerdown);
			window.removeEventListener("keydown", onKeydown);
			window.removeEventListener("keyup", onKeyup);
			window.removeEventListener("blur", onBlur);
		},
	};
};
