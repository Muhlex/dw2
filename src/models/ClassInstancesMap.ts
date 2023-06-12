export default class ClassInstancesMap<Class extends new (...args: any[]) => any> {
	#map = new Map<Class, Set<InstanceType<Class>>>();

	get<Subclass extends Class>(constructor: Subclass): Set<InstanceType<Subclass>> {
		let instances = this.#map.get(constructor);
		if (!instances) {
			instances = new Set<InstanceType<Class>>();
			this.#map.set(constructor, instances);
		}
		return instances;
	}

	has(instance: InstanceType<Class>) {
		return this.get(instance.constructor).has(instance);
	}

	add(instance: InstanceType<Class>) {
		this.get(instance.constructor).add(instance);
		return this;
	}

	delete(instance: InstanceType<Class>) {
		return this.get(instance.constructor).delete(instance);
	}

	clear() {
		return this.#map.clear();
	}

	get size() {
		let size = 0;
		for (const set of this.#map.values()) {
			size += set.size;
		}
		return size;
	}

	entries(): Iterable<[Class, InstanceType<Class>]> {
		const self = this;
		return {
			*[Symbol.iterator]() {
				for (const [constructor, set] of self.#map) {
					for (const instance of set) {
						yield [constructor, instance] satisfies [Class, InstanceType<Class>];
					}
				}
			}
		}
	}

	values(): Iterable<InstanceType<Class>> {
		const self = this;
		return {
			*[Symbol.iterator]() {
				for (const set of self.#map.values()) {
					yield* set.values();
				}
			}
		}
	}

	keys(): Iterable<Class> {
		const self = this;
		return {
			*[Symbol.iterator]() {
				yield* self.#map.keys();
			}
		}
	}

	[Symbol.iterator]() {
		return this.entries()[Symbol.iterator]();
	}
}
