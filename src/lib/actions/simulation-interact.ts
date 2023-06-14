import { get } from 'svelte/store';
import type { ActionReturn } from 'svelte/action';

import options from '../../options';

import Vector2 from '../../models/Vector2';
import Simulation from '../../models/sim/Simulation';
import Boid from '../../models/sim/entities/Boid';
import Attractor from '../../models/sim/entities/Attractor';

let $options = get(options);
options.subscribe(value => $options = value);

enum MouseButton { Primary, Middle, Secondary };
type KeyboardActions = Record<KeyboardEvent["key"], () => void>;

export default (node: HTMLElement, simulation: Simulation): ActionReturn => {
	const keys: { active: Set<KeyboardEvent["key"]>, actions: { up: KeyboardActions, down: KeyboardActions } } = {
		active: new Set(),
		actions: {
			down: {
				// Number keys 0 to 10 for controlling tickrate
				...Object.fromEntries(Array(10).fill(undefined).map((_, index) => [index, () => {
					options.update(options => ({ ...options, targetTps: index * 10 }));
				}])),
				// Starting letters of classes for quick select
				...Object.fromEntries([Boid, Attractor].map(ctor => [ctor.className[0].toLowerCase(), () => {
					options.update(options => {
						options.entities.selected.constructor = ctor;
						return options;
					});
				}]))
			},
			up: {},
		}
	};

	const getTargetConsumesKey = (target: EventTarget) => {
		const tagName = target && "tagName" in target && target.tagName as string || undefined;
		return tagName ? ["INPUT", "TEXTAREA", "SELECT", "OPTION", "BUTTON"].includes(tagName) : false;
	};

	const onKeydown = ({ key, target }: KeyboardEvent) => {
		if (keys.active.has(key)) return;
		keys.active.add(key);

		if (target && getTargetConsumesKey(target)) return;
		keys.actions.down[key]?.();
	};
	const onKeyup = ({ key, target }: KeyboardEvent) => {
		if (!keys.active.has(key)) return;
		keys.active.delete(key);

		if (target && getTargetConsumesKey(target)) return;
		keys.actions.up[key]?.();
	};
	const onBlur = () => {
		keys.active.clear();
	};

	const screenToWorldPos = (x: number, y: number) => {
		const { left, top, width, height } = node.getBoundingClientRect();
		const offset = new Vector2(x - left, y - top);
		return new Vector2(
			offset.x / width * simulation.world.size.x,
			offset.y / height * simulation.world.size.y,
		);
	}

	const onPointerdown = ({ clientX, clientY, button }: PointerEvent) => {
		const coords = screenToWorldPos(clientX, clientY);

		let amount = 0;
		if (keys.active.has("Shift")) amount += 10;
		if (keys.active.has("Control")) amount += 100;
		if (keys.active.has("Alt")) amount += 500;
		amount ||= 1;

		const entOptions = $options.entities;

		switch (button) {
			case MouseButton.Primary:
				const constructorOptions = {
					x: coords.x, y: coords.y,
					...entOptions.defaults.get(entOptions.selected.constructor),
				};
				for (let i = 0; i < amount; i++) {
					simulation.spawn(new entOptions.selected.constructor(constructorOptions));
				}

				break;

			case MouseButton.Secondary:
				const targets = [...simulation.entities.get(entOptions.selected.constructor)]
					.map(entity => ({ entity, distanceSq: coords.distanceSq(entity.position) }))
					.sort((a, b) => a.distanceSq - b.distanceSq)
					.slice(0, amount);

				for (const { entity } of targets) {
					simulation.kill(entity);
				}

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
