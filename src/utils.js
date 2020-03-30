export function map(value, functor) {
  switch (typeof value) {
    case "object":
      if (value instanceof Array) {
        return value.map(functor);
      } else if (value === null) {
        return value;
      } else {
        const res = {};
        for (const k in value) {
          res[k] = functor(value[k], k);
        }
        return res;
      }
    default:
      return value;
  }
}

export function filter(value, predicate) {
  switch (typeof value) {
    case "object":
      if (value instanceof Array) {
        return value.filter(predicate);
      } else if (value === null) {
        return value;
      } else {
        const res = {};
        for (const k in value) {
          const v = value[k];
          if (predicate(v, k)) {
            res[k] = v;
          }
        }
        return res;
      }
    default:
      return value;
  }
}

export function reduce(value, functor, initial) {
  switch (typeof value) {
    case "object":
      if (value instanceof Array) {
        return value.reduce(functor, initial);
      } else if (value === null) {
        return initial;
      } else {
        var res = initial;
        for (const k in value) {
          res = functor(res, value[k], k);
        }
        return res;
      }
    default:
      return initial;
  }
}

export function assert(condition) {
  if (!condition) {
    console.error.apply(console, ["Assertion failed:"].concat(arguments));
  }
}
