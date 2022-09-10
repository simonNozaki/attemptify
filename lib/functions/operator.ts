/**
 * Get a value from a passed parameter directly.
 * @param {T} value
 * @return {T}
 */
export const get = <T>(value: T) => (): T => value;

/**
 * Return true if a first parameter and a second parameter is equal.
 * @param {T} v1
 * @param {T} v2
 * @return {boolean}
 */
export const eq = <T>(v1: T) => (v2: T): boolean => v1 === v2;
