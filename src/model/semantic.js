import { swallow, list, first, bool } from "../utils/functional";
import { assert, error } from "../utils/assert";
import { Journaled } from "../utils/delta";

// TODO: We should probably do a Managed class
// TODO: This module should be reformatted and include proper documentation.
// TODO: Implement a revision scheme, which might be useful for react

const CANONICAL = "#canonical";

export class Quadruple {
    constructor(subject, relation, object, value) {
        this.subject = subject;
        this.relation = relation;
        this.object = object;
        this.value = value;
    }
    update(subject, relation, object, value) {
        var modified = false;
        if (this.subject !== subject && subject !== undefined) {
            this.subject = subject;
            modified = true;
        }
        if (this.relation !== relation && relation !== undefined) {
            this.relation = relation;
            modified = true;
        }
        if (this.object !== object && object !== undefined) {
            this.object = object;
            modified = true;
        }
        if (this.value !== value && value !== undefined) {
            this.value = value;
            modified = true;
        }
        return modified;
    }
    match(quad) {
        const matches = (a, b) =>
            a === b || a === undefined || (typeof b === "function" && b(a));
        return (
            matches(this.subject, quad.subject) &&
            matches(this.relation, quad.relation) &&
            matches(this.object, quad.object) &&
            matches(this.value, quad.value)
        );
    }
    traverse(quad, direction) {
        const target = direction === -1 ? this.subject : this.object;
        return target ? target.relations : [];
    }
    toJSON() {
        const json = _ => (typeof _ === "object" ? _.id : _);
        return {
            subject: json(this.subject),
            relation: json(this.relation),
            object: json(this.object),
            value: json(this.value)
        };
    }
}

export class QuadStore {
    constructor() {
        this.quadruples = new JournalledList();
    }
    register(quad) {
        this.quadruples.push(quad);
        return quad;
    }
    unregister(quad) {
        error("QuadStore.unregister: Not supported");
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

export class IndexedQuadStore extends QuadStore() {}

export class SemanticStore extends QuadStore {
    constructor() {
        super();
        // We aggregate/index the semantic elements by type.
        this.attributes = {};
        this.concepts = {};
        this.relations = {};
    }
    register(semantic) {
        if (semantic instanceof Attribute) {
            assert(!this.attributes[semantic.id]);
            this.attributes[semantic.id] = semantic;
        } else if (semantic instanceof Concept) {
            assert(!this.concepts[semantic.id]);
            this.concepts[semantic.id] = semantic;
        } else if (semantic instanceof Relation) {
            assert(!this.relations[semantic.id]);
            this.relations[semantic.id] = semantic;
        } else if (semantic instanceof Quadruple) {
            this.quadruples.push(semantic);
        } else {
            error("Semantic type not supported", semantic);
        }
        return semantic;
    }
    ensureConcept(id, strict) {
        if (id instanceof Concept) {
            this.concepts[id.id] = id;
            return id;
        } else if (!this.concepts[id] && strict !== false) {
            this.concepts[id] = new Concept(id);
        }
        return this.concepts[id];
    }
    ensureAttribute(id, strict) {
        if (id === undefined) {
            return undefined;
        } else if (id instanceof Attribute) {
            this.attributes[id.id] = id;
            return id;
        } else if (!this.attributes[id] && strict !== false) {
            this.attributes[id] = new Attribute(id);
        }
        return this.attributes[id];
    }
    ensureRelation(id, strict) {
        if (id === undefined) {
            return undefined;
        } else if (id instanceof Relation) {
            this.relation[id.id] = id;
            return id;
        } else if (!this.relations[id] && strict !== false) {
            this.relations[id] = new Relation(id);
        }
        return this.relations[id];
    }
}

export const STORE = new SemanticStore();
export const quad = (s, r, o, v) => new Quadruple(s, r, o, v);

export class Semantic {
    constructor(id, store) {
        this.id = id;
        this.store = store || STORE;
        // NOTE: These should actually be a cache maintained from the store
        this.labels = {};
        this.definitions = {};
        this.relations = [];
        this.attributes = [];
        // We register the element into the store
        this.store.register(this);
    }
    get label() {
        return this.labels[CANONICAL];
    }
    get definition() {
        return this.definitions[CANONICAL];
    }
    /* MANIPUALTION API */
    setDefinition(value, qualifier) {
        this.definitions[qualifier || CANONICAL] = value;
        return this;
    }
    setLabel(value, qualifier) {
        this.labels[qualifier || CANONICAL] = value;
        return this;
    }
    listAttributes(attribute, qualifier) {
        const a = this.store.ensureAttribute(attribute, true);
        return this.attributes.filter(
            _ =>
                (attribute === undefined || _.relation === a) &&
                (qualifier === undefined || _.value === qualifier)
        );
    }
    getAttribute(attribute, qualifier) {
        const a = this.store.ensureAttribute(attribute, true);
        return first(
            this.attributes,
            _ => _.relation === a && _.qualifier === qualifier
        );
    }
    getAttributeValue(attribute, qualifier) {
        const a = this.getAttribute(attribute, qualifier);
        return a ? a.object : undefined;
    }
    setAttributeValue(attribute, value, qualifier) {
        const a = this.getAttribute(attribute, qualifier);
        if (a) {
            a.object = value;
        }
        return a;
    }
    hasAttribute(attribute, qualifier) {
        return bool(this.getAttribute(attribute, qualifier));
    }
    clearAttributes(attribute, qualifier) {
        const a = this.store.ensureAttribute(attribute, true);
        this.attributes = this.attributes.filter(
            _ =>
                !(
                    (a === undefined || _.relation === a) &&
                    (qualifier === undefined || _.qualifier === qualifier)
                )
        );
        return this.attributes;
    }
    setAttribute(attribute, value, qualifier) {
        const a = this.getAttribute(attribute, qualifier);
        if (a) {
            a.object = value;
            return a;
        } else {
            return this.addAttribute(attribute, value, qualifier);
        }
    }
    addAttribute(attribute, value, qualifier) {
        const a = this.store.register(
            new Quadruple(
                this,
                this.store.ensureAttribute(attribute),
                value,
                qualifier
            )
        );
        this.attributes.push(a);
        return a;
    }
    removeAttribute(attribute, qualifier) {
        error("Not implemented");
    }
    clearRelations(relation, qualifier) {
        const a = this.store.ensureRelation(relation, true);
        this.relations = this.relations.filter(
            _ =>
                !(
                    (a === undefined || _.relation === a) &&
                    (qualifier === undefined || _.qualifier === qualifier)
                )
        );
        return this.relations;
    }

    addRelation(verb, object, value) {
        const r = this.store.register(
            new Quadruple(this, this.store.ensureRelation(verb), object, value)
        );
        this.relations.push(r);
        return r;
    }

    toJSON() {
        return {
            id: this.id,
            definitions: this.definitions,
            labels: this.labels,
            relations: this.relations.map(_ => _.toJSON()),
            attributes: this.attributes.map(_ => _.toJSON())
        };
    }
}

export class Concept extends Semantic {}
export class Attribute extends Semantic {}
export class Relation extends Semantic {}
export class Entity extends Semantic {}

export class DeclarativeAdapter {
    constructor(semantic) {
        this.target = semantic;
    }
    is(value, ref) {
        this.target.setDefinition(value, ref);
        return this;
    }
    as(value, ref) {
        this.target.setLabel(value, ref);
        return this;
    }
    rel(relation, object, qualifier) {
        this.target.addRelation(relation, object, qualifier);
        return this;
    }
    attr(attribute, value, qualifier) {
        this.target.addAttribute(attribute, value, qualifier);
        return this;
    }
}

export class SemanticFactory {
    constructor(callback) {
        this.callback = _ => swallow(callback(_), _);
    }
    attribute(id) {
        return new DeclarativeAdapter(this.callback(new Attribute(id)));
    }
    concept(id) {
        return new DeclarativeAdapter(this.callback(new Concept(id)));
    }
    relation(id) {
        return new DeclarativeAdapter(this.callback(new Relation(id)));
    }
    entity(id) {
        return new DeclarativeAdapter(this.callback(new Entity(id)));
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
export const concept = (a, b) => new Concept(a, b);
export const attribute = (a, b) => new Attribute(a, b);
export const relation = (a, b) => new Relation(a, b);

// SEE: https://www.w3.org/TR/rdf-schema/
export const RDFS = vocabulary(
    "https://www.w3.org/TR/rdf-schema/#",
    "rdfs"
).define((def, rdfs) => {
    def.concept("Resource").is("All things in RDFs are *resources*");
    //.scoped("technical");
    def.concept("Class").is("Defines a group of resources");
    def.concept("Literal");
    def.concept("Property").is("A property of a resource");
    def.concept("Datatype");

    def.relation("subClassOf", rdfs.Class, rdfs.Class)
        .as("is a")
        .is("Class A is a subclass of class B");

    def.attribute("range").rel(rdfs.isa, rdfs.Property);
    def.attribute("domain").rel(rdfs.isa, rdfs.Property);
    def.attribute("type").rel(rdfs.isa, rdfs.Property);
});

// SEE: https://www.w3.org/2009/08/skos-reference/skos.html#
export const SKOS = new Vocabulary(
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
    def.relation("narrower").is(
        "tells that concept A is more specific (narrow) than concept B"
    );
    def.relation("broader").is(
        "tells that concept A is less specific (broader) than concept B"
    );
    def.relation("related").is("tells that concept A is related to concept B");
});
