import { copy } from '../utils/functional.js'
import { NodeView } from './graph'

const CANONICAL = '*'

class Semantic extends NodeView {
  constructor (type, id) {
    super()
    this.type = type
    this.id = id === undefined ? this.id : id
  }

  get label () {
    const v = this.getAttribute('label')
    return v ? v[CANONICAL] : undefined
  }

  setLabel (value, qualifier) {
    return this._setI18NAttribute('label', value, qualifier)
  }

  get definition () {
    const v = this.getAttribute('definition')
    return v ? v[CANONICAL] : undefined
  }

  setDefinition (value, qualifier) {
    return this._setI18NAttribute('definition', value, qualifier)
  }

  _setI18NAttribute (name, qualifier, value) {
    const a = copy(this.getAttribute(name)) || {}
    a[qualifier || CANONICAL] = value
    this.setAttribute(name, a)
    return this
  }
}

export class Entity extends Semantic {
  constructor (id) {
    super('Entity', id)
  }
}

export class Concept extends Semantic {
  constructor (id) {
    super('Concept', id)
  }
}

export class Relation extends Semantic {
  constructor (id) {
    super('Relation', id)
  }
}

export class Attribute extends Semantic {
  constructor (id) {
    super('Attribute', id)
  }
}

export const entity = (a, b) => new Entity(a, b)
export const concept = (a, b) => new Concept(a, b)
export const attribute = (a, b) => new Attribute(a, b)
export const relation = (a, b) => new Relation(a, b)
