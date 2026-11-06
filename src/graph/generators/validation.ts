/** Shared closed-data validation for generic and explicit topology profiles. */
export const edgeLimit = 1_000_000;
export function dense(value: unknown, maximum: number): unknown[] {
  if (!Array.isArray(value)) throw new TypeError("Expected a dense array.");
  if (value.length > maximum) throw new RangeError("Generator array exceeds its size limit.");
  if (Reflect.ownKeys(value).length !== value.length + 1) throw new TypeError("Array has foreign or missing data properties.");
  const copy: unknown[] = [];
  for (let index = 0; index < value.length; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !("value" in descriptor)) throw new TypeError("Array requires own data indices.");
    copy.push(descriptor.value);
  }
  return copy;
}
export function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError("Generator parameter must be a finite number.");
  return value;
}
export function integer(value: unknown): number {
  const result = number(value);
  if (!Number.isInteger(result) || result <= 0) throw new RangeError("Generator integer must be positive.");
  return result;
}
export function boolean(value: unknown): boolean {
  if (value !== undefined && typeof value !== "boolean") throw new TypeError("Generator flag must be boolean.");
  return value ?? false;
}
