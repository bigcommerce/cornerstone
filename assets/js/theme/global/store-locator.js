import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Popover from './stencil-popover.js';
import urlUtils from '../common/utils/url-utils';

export default function () {
    const storeLocatorButton = document.getElementById('store-locator');
    console.log('STORE T', storeLocatorButton);
    // const 
    // const storeLocatorTemplate = $('#store-locator-template');
    const template = document.getElementById('popoverWrapper');


    const pop = new Popover(template, storeLocatorButton, {
        position: Popover.BOTTOM
    });

    // storeLocatorButton.click(() => {
    //     console.log('TEST', pop);
    // });

    // storeLocatorButton.click(() => {
    //     Popover.TOP = 'top';
    //     Popover.RIGHT = 'right';
    //     Popover.BOTTOM = 'bottom';
    //     Popover.LEFT = 'left';
        
    //     document.addEventListener('DOMContentLoaded', function() {
    //       let btn = document.querySelector('#popoverOpener button'),
    //         template = document.querySelector('.popover'),
    //         pop = new Popover(template, btn, {
    //           position: Popover.RIGHT
    //         }),
    //         links = template.querySelectorAll('.popover-content a');
    //       for (let i = 0, len = links.length; i < len; ++i) {
    //         let link = links[i];
    //         console.log(link);
    //         link.addEventListener('click', function(e) {
    //           e.preventDefault();
    //           pop.position(this.className);
    //           this.blur();
    //           return true;
    //         });
    //       }
    //     });
    // });
}