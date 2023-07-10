export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
	return Object.fromEntries(keys.filter(key => key in obj).map(key => [key, obj[key]])) as Pick<T, K>;
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function chunk<T>(array: T[], size: number): T[][];
export function chunk<T extends ArrayBufferView>(array: T, size: number) : T[];
export function chunk<
	T extends { length: number, slice: typeof Array.prototype.slice }
>(array: T, size: number): T[] {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any[] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
}
