__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line

/**
 * This function gets added to the global window and then called
 * on page load with the current template loaded and JS Context passed in
 * @param pageType String
 * @param contextJSON
 * @returns {*}
 */
window.stencilBootstrap = function stencilBootstrap(pageType, contextJSON = null, loadGlobal = true) {
    const context = JSON.parse(contextJSON || {});
    window.stencilBootstrap = { context, pageType, loadGlobal };
};
