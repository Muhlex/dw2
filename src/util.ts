export const pick = <T extends object, K extends keyof T>(obj: T, ...keys: K[]) => (
	Object.fromEntries(keys.filter(key => key in obj).map(key => [key, obj[key]])) as Pick<T, K>
);

export const remap = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
	return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
