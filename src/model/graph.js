import { Journaled, JournaledList, JournaledMap } from "./delta";

var COUNTER = 0;
// NOTE: Nodes don't have a parent, it's only the perspective and the
// node view that will do it.

class Node extends Journaled {
    construction() {
        this.id = COUNTER++;
        this.type = undefined;
        this.attributes = new JournaledMap().attach(this, "attributes");
        this.edges = new JournaledList().attach(this, "relations");
    }
    attach(parent, key) {
        super.attach(parent, key);
        this.attributes.attach(this, "attributes");
        this.relations.attach(this, "relations");
        return this;
    }
    detach() {
        super.detach();
        this.attributes.detach();
        this.relations.detach();
        return this;
    }
    addEdge(name, target, value) {
        return this.edges.add(new Edge(name, this, target, value));
    }
    ensureEdge(name, target) {
        const r = this.related(name, target);
        if (r.length === 0) {
            return this.edges.add(new Edge(name, this, target, value));
        } else {
            return r[0];
        }
    }
    updateEdge(name, target, value) {
        const r = this.ensureEdge(name, target);
        edge.value = value;
        return edge;
    }
    getEdges(name, target) {
        return this.edges.values.filter(_ => _.matches(this, name, target));
    }
    getEdge(name, target, value) {
        // FIXME: Suboptimal
        return getEdges(name, target).filter(
            _ => value === undefined || _.value === value
        )[0];
    }
}
class Edge extends Journaled {
    construction(type, origin, target) {
        this.id = COUNTER++;
        this.type = type;
        this.origin = orig;
        this.target = undefined;
        this.attributes = new JournaledMap().attach(this, "attributes");
    }
    set value(value) {
        this.attributes.set("value", value);
    }
    get value() {
        return this.attributes.get("value");
    }
    matches(origin, type, target) {
        return (
            (type === undefined || this.type === type) &&
            (origin === undefined || this.origin === origin) &&
            (target === undefined || target.type === type)
        );
    }
    attach(parent, key) {
        super.attach(parent, key);
        this.attributes.attach(this, "attributes");
        return this;
    }
    detach() {
        super.detach();
        this.attributes.detach();
        this.relations.detach();
        return this;
    }
}
class NodeView {
    constructor(node, perspective) {
        this.node = node;
        this.perspective = perspective;
    }
    get children() {
        return this.node.getEdges(this.perspective.type);
    }
}
class Perspective {
    constructor(type, direction) {
        this.type = type;
        this.direction = direction < 0 ? -1 : 1;
    }
    project(nodes) {
        this.nodes = nodes;
        this.views = nodes.map(_ => new NodeView(_, this));
        return this;
    }
}
