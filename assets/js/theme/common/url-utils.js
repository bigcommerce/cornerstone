import $ from 'jquery';
import Url from 'url';

const urlUtils = {
    getUrl: (object = null) => {
        const href = Url.parse(window.location.href, true);
        let url = href.path;

        if (object) {
            if (object === 'raw') {
                url = href;
            } else if (object === 'query') {
                url = JSON.stringify(href.query);
            } else if (href[object] !== null) {
                url = href[object];
            } else {
                url = null; // url is null since object was not found but declared
            }
        }

        return url;
    },

    goToUrl: (url) => {
        window.history.pushState({}, document.title, url);
        $(window).trigger('statechange');
    },

    replaceParams: (url, params) => {
        const parsed = Url.parse(url, true);
        let param;

        // Let the formatter use the query object to build the new url
        parsed.search = null;

        for (param in params) {
            if (params.hasOwnProperty(param)) {
                parsed.query[param] = params[param];
            }
        }

        return Url.format(parsed);
    },

    buildQueryString: (queryData) => {
        let out = '';
        let key;
        for (key in queryData) {
            if (queryData.hasOwnProperty(key)) {
                if (Array.isArray(queryData[key])) {
                    let ndx;

                    for (ndx in queryData[key]) {
                        if (queryData[key].hasOwnProperty(ndx)) {
                            out += `&${key}=${queryData[key][ndx]}`;
                        }
                    }
                } else {
                    out += `&${key}=${queryData[key]}`;
                }
            }
        }

        return out.substring(1);
    },
};

export default urlUtils;
