import { get } from 'svelte/store';
import type { ActionReturn } from 'svelte/action';

import options from '../../options';

import Vector2 from '../../models/Vector2';
import type Simulation from '../../models/sim/Simulation';
import type Entity from '../../models/sim/entities/Entity';

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

	const onPointerdown = ({ currentTarget, clientX, clientY, button }: PointerEvent) => {
		const { x, y, width, height } = (currentTarget as typeof node).getBoundingClientRect();
		const offset = new Vector2(clientX - x, clientY - y);
		const coords = new Vector2(
			offset.x / width * simulation.world.size.x,
			offset.y / height * simulation.world.size.y,
		);

		let amount = 0;
		if (keys.active.has("Shift")) amount += 10;
		if (keys.active.has("Control")) amount += 100;
		if (keys.active.has("Alt")) amount += 500;
		amount ||= 1;

		switch (button) {
			case MouseButton.Primary:

				for (let i = 0; i < amount; i++) {
					simulation.spawn(new $options.spawn.constructor({ x: coords.x, y: coords.y, ...$options.defaults.get($options.spawn.constructor) }))
				}
				break;

			case MouseButton.Secondary:
				for (let i = 0; i < amount; i++) {
					const closest: { entity?: Entity, distanceSq: number } = { distanceSq: Infinity };
					for (const entity of simulation.entities.values()) {
						const distanceSq = coords.distanceSq(entity.position);
						if (distanceSq < closest.distanceSq) {
							Object.assign(closest, { entity, distanceSq });
						}
					}
					if (closest.entity) simulation.kill(closest.entity);
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
