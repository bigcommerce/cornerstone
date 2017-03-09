import async from 'async';

export default class PageManager {
    constructor(context) {
        this.context = context;
    }

    before(next) {
        next();
    }

    loaded(next) {
        next();
    }

    after(next) {
        next();
    }

    type() {
        return this.constructor.name;
    }

    load() {
        async.series([
            this.before.bind(this), // Executed first after constructor()
            this.loaded.bind(this), // Main module logic
            this.after.bind(this), // Clean up method that can be overridden for cleanup.
        ], (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
}
