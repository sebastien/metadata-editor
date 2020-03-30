// @title Graph module
import { Journaled, JournaledList, JournaledMap } from '../utils/delta'

var COUNTER = 0
// NOTE: Nodes don't have a parent, it's only the perspective and the
// node view that will do it.

class Element extends Journaled {
// @doc

  constructor (type) {
    // @param type the type of the argument
    super()
    this.id = COUNTER++
    this.type = type
    this.attributes = new JournaledMap().attach(this, 'attributes')
  }

  attach (parent, key) {
    // @param parent the parent key
    // @param parent the parent key
    super.attach(parent, key)
    this.attributes.attach(this, 'attributes')
    return this
  }

  detach () {
    super.detach()
    this.attributes.detach()
    return this
  }

  setAttribute (name, value) {
    return this.attributes.set(name, value)
  }

  getAttribute (name) {
    return this.attributes.get(name)
  }

  hasAttribute (name) {
    return this.attributes.has(name)
  }
}

export class Node extends Element {
  constructor () {
    super()
    this.edges = new JournaledList().attach(this, 'relations')
  }

  attach (parent, key) {
    super.attach(parent, key)
    this.relations.attach(this, 'relations')
    return this
  }

  detach () {
    super.detach()
    this.relations.detach()
    return this
  }

  addEdge (name, target, value) {
    return this.edges.add(new Edge(name, this, target, value))
  }

  ensureEdge (name, target, value) {
    const r = this.related(name, target)
    if (r.length === 0) {
      return this.edges.add(new Edge(name, this, target, value))
    } else {
      return r[0]
    }
  }

  updateEdge (name, target, value) {
    const edge = this.ensureEdge(name, target)
    edge.value = value
    return edge
  }

  getEdges (name, target) {
    return this.edges.values.filter(_ => _.matches(this, name, target))
  }

  getEdge (name, target, value) {
    const l = this.edges.values
    const n = l.length
    var i = 0
    while (i < n) {
      const e = l[i]
      if (
        (name === undefined || e.name === name) &&
                (target === undefined || e.target === target) &&
                (value === undefined || e.value === value)
      ) {
        return e
      } else {
        i += 1
      }
    }
  }
}

export class Edge extends Element {
  constructor (type, origin, target) {
    super(type)
    this.origin = origin
    this.target = undefined
  }

  set value (value) {
    this.attributes.set('value', value)
  }

  get value () {
    return this.attributes.get('value')
  }

  matches (origin, type, target) {
    return (
      (type === undefined || this.type === type) &&
            (origin === undefined || this.origin === origin) &&
            (target === undefined || target.type === type)
    )
  }
}

export class NodeView {
  constructor (node, perspective) {
    this.node = node
    this.perspective = perspective
  }

  get children () {
    return this.node.getEdges(this.perspective.type)
  }

  setAttribute (name, value) {
    return this.node.setAttribute(name, value)
  }

  getAttribute (name) {
    return this.node.getAttribute(name)
  }

  hasAttribute (name) {
    return this.node.hasAttribute(name)
  }

  listAttributes () {
    return this.node.attributes.values
  }
}

export class Perspective {
  constructor (type, direction) {
    this.type = type
    this.direction = direction < 0 ? -1 : 1
  }

  project (nodes) {
    this.nodes = nodes
    this.views = nodes.map(_ => new NodeView(_, this))
    return this
  }
}
