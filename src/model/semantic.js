import { swallow, list } from "../utils/functional";

// TODO: We should probably do a Managed class
// TODO: This module should be reformatted and include proper documentation.

const CANONICAL = "#canonical";
const ANY = undefined;

class Quadruple {
  constructor(subject, relation, object, value) {
    this.subject = relation;
    this.relation = relation;
    this.object = object;
    this.value = value;
  }
  match(quad) {
    return (
      (this.subject === quad.subject || this.subject === undefined) &&
      (this.relation === quad.relation || this.relation === undefined) &&
      (this.object === quad.object || this.object === undefined) &&
      (this.value === quad.value || this.value === undefined)
    );
  }
  traverse(quad, direction) {
    const target = direction === -1 ? this.subject : this.object;
    return target ? target.relations : [];
  }
}

class QuadStore {
  constructor() {
    this.quadruples = [];
  }
  register(quad) {
    this.quadruples.push(quad);
    return quad;
  }
  query(quad, callback) {
    if (!callback) {
      const res = [];
      this.query(quad, _ => {
        res.push(_);
      });
      return res;
    } else {
      this.quadruples.forEach(_ => {
        quad.match(_) && callback(quad);
      });
      return true;
    }
  }
}
const STORE = new QuadStore();
export const quad = (s, r, o, v) => new Quadruple(s, r, o, v);

class Semantic {
  constructor(id, store) {
    this.id = id;
    this.store = store || STORE;
    this.labels = {};
    this.scope = undefined;
    this.relations = [];
    this.definitions = {};
  }
  get label() {
    return this.labels[CANONICAL];
  }
  get definition() {
    return this.definitions[CANONICAL];
  }
  scoped(value) {
    this.scope = value;
    return this;
  }
  is(value, ref) {
    this.definitions[ref || CANONICAL] = value;
    return this;
  }
  as(value, ref) {
    this.labels[ref || CANONICAL] = value;
    return this;
  }

  rel(relation, object, qualifier) {
    this.relations.push(
      this.store.register(new Quadruple(this, relation, object, qualifier))
    );
    return this;
  }
}

export class Concept extends Semantic {
  constructor(id) {
    super(id);
    this.attributes = [];
  }

  addRelation(relation) {
    this.relations.push(relation);
  }
  addAttribute(attribute) {
    this.attributes.push(attribute);
  }
}

export class Attribute extends Semantic {}

export class Relation extends Semantic {
  constructor(id, subject, object, qualifier) {
    super(id);
    this.subject = subject;
    this.object = object;
    this.qualifier = qualifier;
  }
}

export class Entity extends Semantic {}

export class SemanticFactory {
  constructor(callback) {
    this.callback = _ => swallow(callback(_), _);
  }
  attribute(id) {
    return this.callback(new Attribute(id));
  }
  concept(id) {
    return this.callback(new Concept(id));
  }
  relation(id) {
    return this.callback(new Relation(id));
  }
  entity(id) {
    return this.callback(new Entity(id));
  }
}

// FIXME: This should be merged into "semantic.js"

export class Vocabulary extends SemanticFactory {
  constructor(id, label) {
    super(_ => {
      this.catalogue[_.id] = _;
    });
    this.label = label;
    this.groups = {};
    this.catalogue = {};
  }
  define(callback) {
    return swallow(callback(this, this.catalogue), this);
  }
  group(name, ...rest) {
    this.groups[name] = (this.groups[name] || []).concat(rest);
    return this;
  }
  getTerms() {
    const prefix = this.label ? this.label + ":" : "";
    return list(this.catalogue).map(_ => {
      return {
        id: _.label ? null : prefix + _.id,
        label: _.label || _.id,
        description: _.definition,
        value: _
      };
    });
  }
}

// NOTE: These vocabularies should be extracted out in a separate file. They should be
// curated so that the more complex/less frequent relations/attributes appear last.
export const vocabulary = (a, b) => new Vocabulary(a, b);

// SEE: https://www.w3.org/TR/rdf-schema/
export const RDFS = vocabulary(
  "https://www.w3.org/TR/rdf-schema/#",
  "rdfs"
).define((def, rdfs) => {
  def
    .concept("Resource")
    .is("All things in RDFs are *resources*")
    .scoped("technical");
  def.concept("Class").is("Defines a group of resources");
  def.concept("Literal");
  def.concept("Property").is("A property of a resource");
  def.concept("Datatype");

  def
    .relation("subClassOf", rdfs.Class, rdfs.Class)
    .as("is a")
    .is("Class A is a subclass of class B");

  def.attribute("range").rel(rdfs.isa, rdfs.Property);
  def.attribute("domain").rel(rdfs.isa, rdfs.Property);
  def.attribute("type").rel(rdfs.isa, rdfs.Property);
});

// SEE: https://www.w3.org/2009/08/skos-reference/skos.html#
export const SKOS = new vocabulary(
  "http://www.w3.org/2004/02/skos/core#",
  "skos"
).define((def, skos) => {
  def.group(
    "Concepts",
    def.concept("Collection"),
    def.concept("Concept").is("an idea or a notion, a unit of thought")
  );
  def.group(
    "Description",
    def.attribute("definition"),
    def.attribute("label"),
    def.attribute("example")
  );
  def
    .relation("narrower")
    .is("tells that concept A is more specific (narrow) than concept B");
  def
    .relation("broader")
    .is("tells that concept A is less specific (broader) than concept B");
  def.relation("related").is("tells that concept A is related to concept B");
});
