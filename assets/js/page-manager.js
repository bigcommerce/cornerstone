export default class PageManager {
    constructor() {
    }

    before(callback) {
        callback();
    }

    loaded(callback) {
        callback();
    }

    after(callback) {
        callback();
    }

    type() {
        return this.constructor.name;
    }
}
