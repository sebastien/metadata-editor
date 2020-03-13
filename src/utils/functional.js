export function swallow(value) {
  return undefined;
}

export function items(value) {
  if (typeof value === "object") {
    return value instanceof Array
      ? value.map((v, i) => [i, v])
      : Object.entries(value);
  } else if (value === undefined || value === null) {
    return [];
  } else {
    return [value];
  }
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

export function nth(value, index) {
  const v = list(value);
  return v[index < 0 ? v.length + index : index];
}

export function sum(value) {
  return list(value).reduce((r, v) => r + v, 0);
}

export function max(value) {
  return list(value).reduce((r, v, i) => (i === 0 ? v : Math.max(r, v)));
}

export function min(value) {
  return list(value).reduce((r, v, i) => (i === 0 ? v : Math.min(r, v)));
}

export function minmax(value) {
  return list(value).reduce((r, v, i) => {
    if (i === 0) {
      return [v, v];
    } else {
      r[0] = Math.min(r[0], v);
      r[1] = Math.max(r[1], v);
      return r;
    }
  }, null);
}

export function rescale(n, range) {
  return (n - range[0]) / (range[1] - range[0]);
}

export function sprintf() {
  var str_repeat = function(i, m) {
    for (var o = []; m > 0; o[--m] = i) {}
    return o.join("");
  };
  var i = 0,
    a,
    f = arguments[i++],
    o = [],
    m,
    p,
    c,
    x;
  while (f) {
    if ((m = /^[^\x25]+/.exec(f))) {
      o.push(m[0]);
    } else if ((m = /^\x25{2}/.exec(f))) {
      o.push("%");
    } else if (
      (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(
        f
      ))
    ) {
      if ((a = arguments[m[1] || i++]) == null || a == undefined) {
        return console.error(
          "std.core.sprintf: too few arguments, expected ",
          arguments.length,
          "got",
          i - 1,
          "in",
          arguments[0]
        );
      }
      if (/[^s]/.test(m[7]) && typeof a != "number") {
        return console.error(
          "std.core.sprintf: expected number at",
          i - 1,
          "got",
          a,
          "in",
          arguments[0]
        );
      }
      switch (m[7]) {
        case "b":
          a = a.toString(2);
          break;
        case "c":
          a = String.fromCharCode(a);
          break;
        case "d":
          a = parseInt(a);
          break;
        case "e":
          a = m[6] ? a.toExponential(m[6]) : a.toExponential();
          break;
        case "f":
          a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
          break;
        case "o":
          a = a.toString(8);
          break;
        case "s":
          a = (a = String(a)) && m[6] ? a.substring(0, m[6]) : a;
          break;
        case "u":
          a = Math.abs(a);
          break;
        case "x":
          a = a.toString(16);
          break;
        case "X":
          a = a.toString(16).toUpperCase();
          break;
      }
      a = /[def]/.test(m[7]) && m[2] && a > 0 ? "+" + a : a;
      c = m[3] ? (m[3] == "0" ? "0" : m[3].charAt(1)) : " ";
      x = m[5] - String(a).length;
      p = m[5] ? str_repeat(c, x) : "";
      o.push(m[4] ? a + p : p + a);
    } else {
      return console.error(
        "functional.sprintf: reached state that shouldn't have been reached."
      );
    }
    f = f.substring(m[0].length);
  }
  return o.join("");
}
