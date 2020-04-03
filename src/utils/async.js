class Deferred {
    constructor(delay, callback) {
        this.timeout = null;
        this.delay = delay || 0;
        this.callback = callback;
    }

    push(callback, delay) {
        if (delay !== undefined) {
            this.delay = delay;
        }
        if (callback !== undefined) {
            this.callback = callback;
        }
        this.cancel();
        if (this.delay == 0) {
            this.callback();
        } else {
            this.timeout = window.setTimeout(_ => this.callback(), this.delay);
        }
        return this;
    }

    cancel() {
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
        return this;
    }
}

export const defer = (delay, callback) => new Deferred(delay, callback);
