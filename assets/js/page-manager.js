import { api } from 'bigcommerce/stencil-utils';
import { defaultModal } from './theme/global/modal';
import _ from 'lodash';

export default class PageManager {
    constructor() {
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

    getPageModal(url, options, callback) {
        const modal = defaultModal();

        /* eslint-disable no-param-reassign */
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!_.isObject(options)) {
            options = {};
        }
        /* eslint-enable no-param-reassign */

        modal.open();

        api.getPage(url, options, (err, content) => {
            if (err) {
                modal.updateContent(this.context.genericError);

                if (typeof callback === 'function') {
                    return callback(err, {
                        modal: modal,
                    });
                }

                throw err;
            }

            modal.updateContent(content);

            if (typeof callback === 'function') {
                callback(null, {
                    modal: modal,
                    content: content,
                });
            }
        });
    }
}
