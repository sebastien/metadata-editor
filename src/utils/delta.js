import { assert } from "./assert";

export class Operation {
    constructor(target, key, value, previous) {
        this.target = target;
        this.key = key;
        this.value = value;
        this.previous = previous;
        this.revision = -1;
    }
}

export class Set extends Operation {}
export class Remove extends Operation {
    constructor(target, key, previous) {
        super(target, key, undefined, previous);
    }
}
export class Init extends Operation {
    constructor(target, values, previous) {
        super(target, null, values, previous);
    }
}
export class Clear extends Operation {
    constructor(target, values, previous) {
        super(target, null, undefined, previous);
    }
}

export class Topic {
    constructor() {
        this.key = undefined;
        this.parent = undefined;
    }
    get path() {
        if (this.key === undefined) {
            return [];
        } else {
            const r = [this.key];
            var p = this.parent;
            while (p && p.key !== undefined) {
                r.splice(0, 0, p.key);
                p = p.parent;
            }
            return r;
        }
    }
    dispatch(thing, scope) {
        scope = scope ? scope : [];
        if (this.parent) {
            scope.splice(0, 0, this.key);
            return this.parent.dispatch(thing, scope);
        } else {
            return scope;
        }
    }
}
export class Journal {
    constructor() {
        this.operations = [];
    }
    add(operation) {
        operation.revision = this.operations.length;
        assert(
            operation === -1,
            "Given operation should have no revision, but has one",
            operation
        );
        this.operations.push(operation);
        return operation;
    }
    checkout(context, minRev, maxRev) {}
}

class Journaled extends Topic {
    static Wrap(value) {
        if (typeof value === "object") {
            if (value instanceof Array) {
                return new JournaledList().load(value);
            } else {
                return new JournaledMap().load(value);
            }
        } else {
            return value;
        }
    }
    static Unwrap(value) {
        if (typeof value === "object" && value instanceof Journaled) {
            return value.dump();
        } else {
            return value;
        }
    }
    constructor() {
        super();
        this.journal = undefined;
        this.revision = 0;
    }

    map(functor) {
        error("NotImplemented");
    }
    filter(functor) {
        error("NotImplemented");
    }
    reduce(functor, initial) {
        error("NotImplemented");
    }
    touch() {
        this.revision += 1;
        return self;
    }
    attach(parent, key) {
        this.parent = parent;
        this.journal = parent.journal;
        this.key = key;
    }

    dump() {
        return this._values.map(_ => (_ instanceof Journaled ? _.dump() : _));
    }
    load(value, meta) {
        error("NotImplemented");
    }
    dumpMeta() {
        return {
            revision: this.revision,
            key: this.key,
            parent: this.parent ? this.parent.path : null,
            children: this.reduce(
                this.values,
                (r, v, i) => {
                    r[i] = v instanceof Journaled ? v.dumpMeta() : null;
                },
                {}
            )
        };
    }
    loadMeta(value) {
        error("NotImplemented");
    }
}

export class JournaledList {
    constructor() {
        this._values = [];
    }
    get length() {
        return this._values.length;
    }
    // @group Query
    indexOf(value) {
        var i = 0;
        const v = this._values;
        const n = this._values.length;
        while (i < n) {
            if (v[i] === value) {
                return i;
            } else {
                i += 1;
            }
        }
        return -1;
    }
    // @group Transforms
    map(functor) {
        return new JournalledList().init(this._values.map(functor));
    }
    filter(functor) {
        return new JournalledList().init(this._values.filter(filter));
    }
    reduce(functor, initial) {
        return new JournalledList().init(this._values.reduce(reduce, initial));
    }

    // @group Journalled operations
    //
    clear() {
        if (this.journal && this.length > 0) {
            journal.add(new Clear(this.touch(), this.dump()));
        }
        this._values = [];
        return this;
    }
    init(values) {
        if (
            this.journal &&
            (values.length != this.length ||
                values.filter((w, i) => this._values[i] !== values[i]).length >
                    0)
        ) {
            this._values = values.map(_ => _);
            journal.add(new Init(this.touch(), this._values, this.dump()));
        }
        return this;
    }
    set(index, value) {
        const i = _ensureIndex(index);
        if (this._values[i] !== value) {
            if (this.journal) {
                journal.add(new Set(this.touch(), i, value));
            }
        }
        return value;
    }
    add(value) {
        return set(this.length, value);
    }
    insert(index, value) {
        const i = _ensureIndex(index);
        this._values.split(i, 0, value);
        if (this.journal) {
            journal.add(new Insert(this.touch(), i, value));
        }
        return this;
    }
    remove(value) {
        const i = this.indedOf(value);
        if (i !== -1) {
            this.removeAt(index);
            return true;
        } else {
            return false;
        }
    }
    removeAt(index) {
        const i = index < 0 ? this._values.length + index : index;
        if (i < this._values.length) {
            const previous = this._values[i];
            this._values.splice(i, 1);
            if (this.journal) {
                journal.add(new Remove(this.touch(), i, previous));
            }
            return previous;
        } else {
            return undefined;
        }
    }
    merge(operation) {
        error("NotImplemented");
    }
    dump() {
        return this._values.map(_ => (_ instanceof Journaled ? _.dump() : _));
    }
    _ensureIndex(index) {
        const i = index < 0 ? this._values.length + index : index;
        while (this._values.length < i) {
            this._values.push(undefined);
        }
        return i;
    }
}

export class JournaledMap {
    get length() {
        var n = 0;
        for (const _ in this._values) {
            n += 1;
        }
        return n;
    }
    keyOf(value) {
        const v = this._values;
        const n = this._values.length;
        for (const k in n) {
            if (value === v[k]) {
                return k;
            }
        }
        return undefined;
    }

    // @group Transforms
    map(functor) {
        return new JournalledList().init(
            Object.keys(this._values).map(_ => functor(this._values[_], _))
        );
    }
    filter(functor) {
        return new JournalledList().init(
            Object.keys(this._values).filter(_ => functor(this._values[_], _))
        );
    }
    reduce(functor, initial) {
        return new JournalledList().init(
            Object.keys(this._values).reduce(
                (r, _) => functor(r, this._values[_], _),
                initial
            )
        );
    }
    clear() {
        if (this.journal && this.length > 0) {
            journal.add(new Clear(this.touch(), this.dump()));
        }
        this._values = {};
        return this;
    }
    init(values) {
        if (
            this.journal &&
            (values.length != this.length ||
                values.filter((w, i) => this._values[i] !== values[i]).length >
                    0)
        ) {
            this._values = values.map(_ => _);
            journal.add(new Init(this.touch(), this._values, this.dump()));
        }
        return this;
    }
    get(key) {
        return this_values[key];
    }
    has(key) {
        return this._values[key] !== undefined;
    }
    set(key, value) {
        if (this._values[key] !== value) {
            if (this.journal) {
                journal.add(new Set(this.touch(), key, value));
            }
        }
        return value;
    }
    remove(value) {
        const k = this.keyOf(value);
        if (k !== undefined) {
            this.removeAt(k);
            return true;
        } else {
            return false;
        }
    }
    removeAt(key) {
        const previous = this._values[key];
        if (this.journal && previous !== undefined) {
            delete this._values[key];
            journal.add(new Remove(this.touch(), i, previous));
        }
        return previous;
    }
    merge(operation) {
        error("NotImplemented");
    }
}

export const wrap = Journaled.Wrap;
export const unwrap = Journaled.Unwrap;
