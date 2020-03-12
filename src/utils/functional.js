export function swallow(value) {
  return undefined;
}

export function list(value) {
  if (typeof value === "object") {
    return value instanceof Array ? value : Object.values(value);
  } else if (value === undefined || value === null) {
    return [];
  } else {
    return [value];
  }
}

export function head(value, count) {
  const v = list(value);
  return v.slice(0, count < 0 ? v.length + count : count);
}
