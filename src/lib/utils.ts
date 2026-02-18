/**
 * Creates a lazy-initialized object that only creates the instance when first accessed.
 *
 * @param fn - Function that creates the object instance
 * @returns Proxy object that lazily initializes on first property access
 */
export function lazy<T extends object>(fn: () => T): T {
	let instance: T | undefined;

	return new Proxy<T>({} as T, {
		get: (_, prop) => {
			if (!instance) {
				instance = fn();
			}
			return instance[prop as keyof T];
		},
	});
}

/**
 * Creates a lazy-initialized object that requires dependencies to be provided via function call.
 * The object must be called as a function with dependencies before any properties can be accessed.
 *
 * @param fn - Function that creates the object instance using provided dependencies
 * @returns Proxy object that can be called to initialize with dependencies, then accessed normally
 * @throws Error if properties are accessed before calling with dependencies
 */
export function lazyInvokable<TDeps extends unknown[], T extends object>(
	fn: (...deps: TDeps) => T,
): T & ((...deps: TDeps) => void) {
	let instance: T | undefined;
	let initialized = false;

	return new Proxy<T & ((...deps: TDeps) => void)>(
		(() => {}) as T & ((...deps: TDeps) => void),
		{
			apply: (_, __, args: TDeps) => {
				if (initialized) {return;}
				instance = fn(...args);
				initialized = true;
			},
			get: (_, prop) => {
				if (!initialized) {
					throw new Error(
						"lazyInvokable must be called with dependencies before accessing properties",
					);
				}
				return instance?.[prop as keyof T];
			},
		},
	);
}
