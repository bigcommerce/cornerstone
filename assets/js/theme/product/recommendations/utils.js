export function getSizeFromThemeSettings(setting) {
    const size = (setting || '').split('x');
    return {
        width: parseInt(size[0], 10) || 500,
        height: parseInt(size[1], 10) || 569,
    };
}

function findOverlay(el) {
    return el.find('.loadingOverlay');
}
export function showOverlay(el) {
    const $overlay = findOverlay(el);
    if ($overlay) {
        $overlay.show();
    }
}

export function hideOverlay(el) {
    const $overlay = findOverlay(el);
    if ($overlay) {
        $overlay.hide();
    }
}
