export function swallow(value, returns) {
    return returns;
}

export function len(value) {
    const t = typeof value;
    if (t === "string") {
        return value.length;
    } else if (t === "object") {
        if (value instanceof Array || value instanceof String) {
            return value.length;
        } else {
            var i = 0;
            for (const _ in value) {
                i += 1;
            }
            return i;
        }
    } else {
        return 0;
    }
}

export function slice(value, start, end) {
    const n = len(value);
    start = start === undefined ? 0 : start;
    end = end === undefined ? n : end;
    start = start < 0 ? n + start : start;
    end = end < 0 ? n + end : end;
    const i = Math.min(start, end);
    const j = Math.max(start, end);
    const t = typeof value;
    if (t === "string") {
        return value.substring(i, j);
    } else if (t === "object") {
        if (value instanceof Array) {
            return value.slice(i, j);
        } else {
            var res = {};
            var ki = 0;
            for (var k in value) {
                if (i <= ki && k < j) {
                    res[k] = value[k];
                }
                ki += 1;
            }
            return res;
        }
    } else {
        return undefined;
    }
}

export function tee(functor, value) {
    return swallow(functor(value), value);
}

export function cmp(a, b) {
    if (a === undefined) {
        return b === undefined ? 0 : -cmp(b, a);
    }
    const ta = typeof a;
    const tb = typeof b;
    if (ta === tb) {
        switch (ta) {
            case "string":
                return a.localeCompare(b);
            case "object":
                if (a === b) {
                    return 0;
                } else if (a instanceof Array) {
                    const la = a.length;
                    const lb = b.length;
                    if (la < lb) {
                        return -1;
                    } else if (la > b) {
                        return 1;
                    } else {
                        var i = 0;
                        while (i < la) {
                            const v = cmp(a[i], b[i]);
                            if (v !== 0) {
                                return v;
                            }
                        }
                        return 0;
                    }
                } else {
                    return -1;
                }
            default:
                return a === b ? 0 : a > b ? 1 : -1;
        }
    } else {
        return a === b ? 0 : a > b ? 1 : -1;
    }
}
export function sorted(collection, key) {
    const extractor =
        typeof key === "function"
            ? key
            : key
            ? _ => (_ ? _[key] : undefined)
            : idem;
    const res =
        collection instanceof Array ? [].concat(collection) : list(collection);
    res.sort((a, b) => (key ? cmp(extractor(a), extractor(b)) : cmp(a, b)));
    return res;
}

export function bool(value) {
    if (typeof value === "object") {
        if (value instanceof Array) {
            return value.length > 0;
        } else {
            for (const k in value) {
                return true;
            }
            return false;
        }
    } else {
        return value ? true : false;
    }
}
export function copy(value) {
    if (typeof value === "object") {
        if (value instanceof Array) {
            return [].concat(value);
        } else {
            const r = {};
            Object.assign(r, value);
            return r;
        }
    } else {
        return value;
    }
}

export function firstdef(value) {
    switch (arguments.length) {
        case 0:
            return undefined;
        case 1:
            return firstdef.apply(this, value);
        default:
            var i = 0;
            while (i < arguments.length) {
                const v = arguments[i];
                if (v !== undefined) {
                    return v;
                }
                i += 1;
            }
            return undefined;
    }
}

export function idem(value) {
    return value;
}

export function isEmpty(value) {
    if (value === undefined || value === null) {
        return true;
    } else if (typeof value === "object") {
        return value instanceof Array
            ? value.length > 0
            : Object.keys(value).length > 0;
    } else {
        return false;
    }
}

export function items(value) {
    if (value === undefined || value === null) {
        return [];
    } else if (typeof value === "object") {
        return value instanceof Array
            ? value.map((v, i) => [i, v])
            : Object.entries(value);
    } else {
        return [value];
    }
}

export function dict(value) {
    if (typeof value === "object") {
        if (value instanceof Array) {
            return value.reduce((r, v) => {
                r[v[0]] = v[1];
                return r;
            }, {});
        } else {
            return value;
        }
    } else {
        // FIXME: Sketchy, should have a better defined behaviour.
        return value;
    }
}

export function list(value) {
    if (value === undefined || value === null) {
        return [];
    } else if (typeof value === "object") {
        return value instanceof Array ? value : Object.values(value);
    } else {
        return [value];
    }
}

/** Iterates through the given value, supporting arrays and objects until
 * functor returns `false` or the iterator runs out.
 */
// TODO: Better document.
export function iter(value, functor, processor, initial) {
    if (value === undefined || value === null) {
        return undefined;
    } else if (typeof value === "object") {
        var v = undefined;
        var r = initial;
        if (value instanceof Array) {
            var i = 0;
            const n = value.length;
            while (i < n) {
                v = value[i];
                const rr = r;
                r = functor(v, i, r, value);
                if (r === false) {
                    return (processor || idem)(v, i, rr, value);
                }
                i += 1;
            }
            return i === 0 ? undefined : (processor || idem)(v, i, r, value);
        } else {
            var k = undefined;
            for (k in value) {
                v = value[k];
                const rr = r;
                r = functor(v, k, r, value);
                if (r === false) {
                    return (processor || idem)(v, k, rr, value);
                }
            }
            return k === undefined
                ? undefined
                : (processor || idem)(v, k, r, value);
        }
    } else {
        return (processor || idem)(functor(value, undefined, initial));
    }
}

export function first(value, functor) {
    return iter(value, (v, i) => functor(v, i) !== true);
}

export function head(value, count) {
    const v = list(value);
    return count === undefined || count === 0
        ? v[0]
        : v.slice(0, count < 0 ? v.length + count : count);
}

export function nth(value, index) {
    const v = list(value);
    return v[index < 0 ? v.length + index : index];
}

export function setnth(value, index, v) {
    return list(value).map((_, i) => (i === index ? v : _));
}

export function merge(value, other, replace) {
    if (value === null || value === undefined) {
        return other;
    } else if (other === null || value === other) {
        return value;
    } else {
        for (var k in other) {
            const v = value[k];
            const w = other[k];
            if (v === undefined || (replace && v !== w)) {
                value[k] = w;
            }
        }
        return value;
    }
}

export function groupBy(collection, extractor) {
    return list(collection).reduce((r, v, i) => {
        const k = extractor(v, i);
        r[k] = r[k] || [];
        r[k].push(v);
        return r;
    }, {});
}

export function last(value) {
    return nth(value, -1);
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
