import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Popover from './stencil-popover.js';
import urlUtils from '../common/utils/url-utils';

export default function () {
    const storeLocatorButton = document.getElementById('store-locator');
    const template = document.getElementById('popoverWrapper');


    const pop = new Popover(template, storeLocatorButton, {
        position: Popover.BOTTOM
    });
}