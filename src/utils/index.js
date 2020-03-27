// NOTE: At the moment I'm not sure if I really need that, but I assume
// I will in the short term.
class Index {
    constructor(extractor) {
        this.extractor = extractor;
        // TODO: We'll probably need to implement a better performing
        // data structure after that.
        this.forward = new Map();
        this.backward = new Map();
    }
    register(object) {
        assert(object.id, "Object must have an id", object);
        const key = this.extractor(object);
        if (this.forward.has(key)) {
            this.forward.push(object.id);
        } else {
            this.forward.set(key, [object.id]);
        }
        if (this.backward.has(object.id)) {
            if (this.backward.get(object.id).indexOf(key) === -1) {
                this.backward.push(key);
            }
        } else {
            this.backward.set(object.id, [key]);
        }
        return object;
    }
    unregister(object) {
        assert(object.id, "Object must have an id", object);
        const key = this.extractor(object);
        const la = this.forward.get(key);
        if (la) {
            const i = la.indexOf(object.id);
            if (i !== -1) {
                la.splice(i, 1);
            }
        }
        const lb = this.backward.get(object.id);
        if (lb) {
            const i = lb.indexOf(key);
            if (i !== -1) {
                lb.splice(i, 1);
            }
        }
        return object;
    }
}
