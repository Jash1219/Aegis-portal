export function applyMutations(
  baseline: Record<string, unknown>,
  scenarioMutations: Record<string, unknown>,
  userInputs: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = structuredClone(baseline);

  function applyDeep(target: Record<string, unknown>, source: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(source)) {
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        if (!(key in target) || typeof target[key] !== "object" || target[key] === null) {
          target[key] = {};
        }
        applyDeep(target[key] as Record<string, unknown>, value as Record<string, unknown>);
      } else {
        target[key] = value;
      }
    }
  }

  applyDeep(payload, scenarioMutations);

  for (const [key, value] of Object.entries(userInputs)) {
    if (value !== undefined && value !== "") {
      const keys = key.split(".");
      let current: Record<string, unknown> = payload;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current) || typeof current[keys[i]] !== "object") {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Record<string, unknown>;
      }
      current[keys[keys.length - 1]] = value;
    }
  }

  return payload;
}
