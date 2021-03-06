import { assert, error } from './assert'

export class Operation {
  constructor (target, key, value, previous) {
    this.target = target
    this.key = key
    this.value = value
    this.previous = previous
    this.revision = -1
  }
}

export class Set extends Operation {}
export class Insert extends Operation {}
export class Remove extends Operation {
  constructor (target, key, previous) {
    super(target, key, undefined, previous)
  }
}
export class Init extends Operation {
  constructor (target, values, previous) {
    super(target, null, values, previous)
  }
}
export class Clear extends Operation {
  constructor (target, values, previous) {
    super(target, null, undefined, previous)
  }
}

export class Topic {
  constructor () {
    this.key = undefined
    this.parent = undefined
  }

  get path () {
    if (this.key === undefined) {
      return []
    } else {
      const r = [this.key]
      var p = this.parent
      while (p && p.key !== undefined) {
        r.splice(0, 0, p.key)
        p = p.parent
      }
      return r
    }
  }

  dispatch (thing, scope) {
    scope = scope || []
    if (this.parent) {
      scope.splice(0, 0, this.key)
      return this.parent.dispatch(thing, scope)
    } else {
      return scope
    }
  }
}
export class Journal {
  constructor () {
    this.operations = []
  }

  add (operation) {
    operation.revision = this.operations.length
    assert(
      operation === -1,
      'Given operation should have no revision, but has one',
      operation
    )
    this.operations.push(operation)
    return operation
  }

  checkout (context, minRev, maxRev) {}
}

export class Journaled extends Topic {
  static Wrap (value) {
    if (typeof value === 'object') {
      if (value instanceof Array) {
        return new JournaledList().load(value)
      } else {
        return new JournaledMap().load(value)
      }
    } else {
      return value
    }
  }

  static Unwrap (value) {
    if (typeof value === 'object' && value instanceof Journaled) {
      return value.dump()
    } else {
      return value
    }
  }

  constructor () {
    super()
    this.journal = undefined
    this.revision = 0
  }

  touch () {
    this.revision += 1
    return this
  }

  attach (parent, key) {
    if (parent !== undefined) {
      this.parent = parent
    }
    this.journal = this.parent.journal
    if (key !== undefined) {
      this.key = key
    }
    return this
  }

  detach () {
    this.key = undefined
    this.parent = undefined
    this.journal = undefined
    return this
  }

  dump () {
    error('NotImplemented')
  }

  dumpMeta () {
    error('NotImplemented')
  }

  load (value, meta) {
    error('NotImplemented')
  }

  loadMeta (value) {
    error('NotImplemented')
  }
}

export class JournaledList extends Journaled {
  constructor () {
    super()
    this.values = []
  }

  get length () {
    return this.values.length
  }

  // @group Query
  indexOf (value) {
    var i = 0
    const v = this.values
    const n = this.values.length
    while (i < n) {
      if (v[i] === value) {
        return i
      } else {
        i += 1
      }
    }
    return -1
  }

  // @group Transforms
  forEach (functor) {
    return this.values.forEach(functor)
  }

  map (functor) {
    return new JournaledList().init(this.values.map(functor))
  }

  filter (functor) {
    return new JournaledList().init(this.values.filter(functor))
  }

  reduce (functor, initial) {
    return new JournaledList().init(this.values.reduce(functor, initial))
  }

  // @group Journaled operations
  //
  clear () {
    if (this.journal && this.length > 0) {
      this.journal.add(new Clear(this.touch(), this.dump()))
    }
    this.values = []
    return this
  }

  init (values) {
    if (
      this.journal &&
            (values.length !== this.length ||
                values.filter((w, i) => this.values[i] !== values[i]).length >
                    0)
    ) {
      this.values = values.map(_ => _)
      this.journal.add(new Init(this.touch(), this.values, this.dump()))
    }
    return this
  }

  set (index, value) {
    const i = this._ensureIndex(index)
    if (this.values[i] !== value) {
      if (this.journal) {
        this.journal.add(new Set(this.touch(), i, value))
      }
    }
    return value
  }

  push (value) {
    return this.add(value)
  }

  add (value) {
    return this.set(this.length, value)
  }

  insert (index, value) {
    const i = this._ensureIndex(index)
    this.values.split(i, 0, value)
    if (this.journal) {
      this.journal.add(new Insert(this.touch(), i, value))
    }
    return this
  }

  remove (value) {
    const i = this.indexOf(value)
    if (i !== -1) {
      this.removeAt(i)
      return true
    } else {
      return false
    }
  }

  removeAt (index) {
    const i = index < 0 ? this.values.length + index : index
    if (i < this.values.length) {
      const previous = this.values[i]
      this.values.splice(i, 1)
      if (this.journal) {
        this.journal.add(new Remove(this.touch(), i, previous))
      }
      return previous
    } else {
      return undefined
    }
  }

  merge (operation) {
    error('NotImplemented')
  }

  dump () {
    return this.values.map(_ => (_ instanceof Journaled ? _.dump() : _))
  }

  dumpMeta () {
    return {
      revision: this.revision,
      key: this.key,
      parent: this.parent ? this.parent.path : null,
      children: this.reduce(
        this.values,
        (r, v, i) => {
          r[i] = v instanceof Journaled ? v.dumpMeta() : null
        },
        {}
      )
    }
  }

  _ensureIndex (index) {
    const i = index < 0 ? this.values.length + index : index
    while (this.values.length < i) {
      this.values.push(undefined)
    }
    return i
  }
}

export class JournaledMap extends Journaled {
  constructor () {
    super()
    this.values = []
  }

  get length () {
    var n = 0
    // eslint-disable-next-line
        for (const _ in this.values) {
      n += 1
    }
    return n
  }

  keyOf (value) {
    const v = this.values
    const n = this.values.length
    for (const k in n) {
      if (value === v[k]) {
        return k
      }
    }
    return undefined
  }

  // @group Transforms
  forEach (functor) {
    const l = this.values
    for (const k in l) {
      functor(l[k], k)
    }
    return this
  }

  map (functor) {
    return new JournaledList().init(
      Object.keys(this.values).map(_ => functor(this.values[_], _))
    )
  }

  filter (functor) {
    return new JournaledList().init(
      Object.keys(this.values).filter(_ => functor(this.values[_], _))
    )
  }

  reduce (functor, initial) {
    return new JournaledList().init(
      Object.keys(this.values).reduce(
        (r, _) => functor(r, this.values[_], _),
        initial
      )
    )
  }

  clear () {
    if (this.journal && this.length > 0) {
      this.journal.add(new Clear(this.touch(), this.dump()))
    }
    this.values = {}
    return this
  }

  init (values) {
    if (
      this.journal &&
            (values.length !== this.length ||
                values.filter((w, i) => this.values[i] !== values[i]).length >
                    0)
    ) {
      this.values = values.map(_ => _)
      this.journal.add(new Init(this.touch(), this.values, this.dump()))
    }
    return this
  }

  get (key) {
    return this.values[key]
  }

  has (key) {
    return this.values[key] !== undefined
  }

  set (key, value) {
    if (this.values[key] !== value) {
      if (this.journal) {
        this.journal.add(new Set(this.touch(), key, value))
      }
    }
    return value
  }

  remove (value) {
    const k = this.keyOf(value)
    if (k !== undefined) {
      this.removeAt(k)
      return true
    } else {
      return false
    }
  }

  removeAt (key) {
    const previous = this.values[key]
    if (this.journal && previous !== undefined) {
      delete this.values[key]
      this.journal.add(new Remove(this.touch(), key, previous))
    }
    return previous
  }

  merge (operation) {
    error('NotImplemented')
  }
}

export const wrap = Journaled.Wrap
export const unwrap = Journaled.Unwrap
