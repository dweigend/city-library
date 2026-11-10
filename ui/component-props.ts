export type WithElementRef<T, E extends HTMLElement = HTMLElement> = T & { ref?: E | null };
export type WithoutChild<T> = T extends unknown ? Omit<T, "child"> : never;
export type WithoutChildren<T> = T extends unknown ? Omit<T, "children"> : never;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
