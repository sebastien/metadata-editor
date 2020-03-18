import { assert } from "../utils";

export class Topic {
  constructor(name) {
    this.name = name;
    this.children = {};
    this.handlers = undefined;
    this.parent = undefined;
  }
  get root() {
    return this.parent ? this.parent.root : this;
  }
  add(child) {
    assert(child.name);
    this.set(child.name, child);
    return child;
  }
  set(key, child) {
    child.name = key;
    child.parent = this;
    this.children[child.name] = child;
    child.parent = this;
    return this;
  }
  resolve(path) {
    return (path instanceof Array ? path : path.split(".")).reduce(
      (r, v, k) => (r ? r.children[v] : undefined),
      this
    );
  }
  ensure(path) {
    return (path instanceof Array ? path : path.split(".")).reduce(
      (r, v, k) => (r.children[v] ? r.children[v] : this.add(v)),
      this
    );
  }
  bind(handler) {
    this.handlers = this.handlers ? this.handlers : [];
    if (this.handlers.indexOf(handler) === -1) {
      this.handlers.push(handler);
    }
    return this;
  }
  unbind(handler) {
    if (!this.hanlders) {
      return this;
    }
    const i = this.handlers.indexOf(handler);
    if (i !== -1) {
      this.handlers.splice(i, 1);
    }
    return this;
  }
  walk(handler) {
    if (handler(this) !== false) {
      for (const k of this.children) {
        const c = this.children[k];
        if (this.walk(c) === false) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
}
export const ROOT = new Topic();
window.topics = ROOT;
