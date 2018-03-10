import svgInjector from 'svg-injector';

export default function () {
    svgInjector(document.querySelectorAll('svg[data-src]'));
}
