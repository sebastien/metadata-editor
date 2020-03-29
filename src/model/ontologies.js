import { Entity, Concept, Attribute, Relation } from "./semantic";
import { swallow, list } from "../utils/functional";

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
export const vocabulary = (a, b) => new Vocabulary(a, b);

//
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
