export function swallow(value, returns) {
    return returns;
}

export function tee(functor, value) {
    return swallow(functor(value), value);
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

export function merge(value, other) {
    if (value === null || value === undefined) {
        return other;
    } else if (other === null || value === other) {
        return value;
    } else {
        // FIXME: This is a bit sketchy....
        return Object.assign({}, value, other);
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
