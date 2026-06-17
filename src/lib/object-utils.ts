export function deepSet<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split(".");
  const result = structuredClone(obj) as Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = result;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    const arrayMatch = key.match(/^([a-zA-Z_]\w*)\[(\d+)\]$/);
    if (arrayMatch) {
      const prop = arrayMatch[1];
      const index = parseInt(arrayMatch[2], 10);

      if (!current[prop]) {
        current[prop] = [];
      }

      if (i === keys.length - 1) {
        current[prop][index] = value;
      } else {
        if (!current[prop][index]) {
          current[prop][index] = {};
        }
        current = current[prop][index];
      }
    } else {
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key] || typeof current[key] !== "object") {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }

  return result as T;
}
