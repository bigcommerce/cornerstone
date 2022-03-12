export default class themevaleMenu {
    constructor() {
    }

    menuItem(num) {
        return {
            themevaleMegaMenu(param) {
                // Defaut params
                param = $.extend({
                dropAlign: 'left',
                dropWidth: '493px',
                dropType: 'imageLeft',
                cateColumns: 1,
                bottomMegamenu: 'none',
                disabled: false,
                bottomCates: '',
                imagesTop: '',
                label: '',
                }, param);

                $(`.navPages > ul.navPages-list:not(.navPages-list--user) > li:nth-child(${num})`).each((idx, el) => {
                    if (param.disabled === false) {
                        const subMegaMenu = $(el).children('.navPage-subMenu');
                        const navPages_action = $(el).children('.navPages-action');

                        $(el).addClass('hasMegamenu');
                        subMegaMenu.removeClass('subMenu').addClass('navPage-subMegaMenu');

                        // label: New, Sale, Hot
                        if (param.label === 'new') {
                            navPages_action.after('<p class="navPages-label-wrap"><span class="navPages-label new-label">New</span></p>');
                        } else if (param.label === 'sale') {
                            navPages_action.after('<p class="navPages-label-wrap"><span class="navPages-label sale-label">Sale</span></p>');
                         } else if (param.label === 'hot') {
                            navPages_action.after('<p class="navPages-label-wrap"><span class="navPages-label hot-label">Hot</span></p>');
                        }

                        // dropdown Alignment
                        if (param.dropAlign === 'fullWidth') {
                            $(el).addClass('fullWidth');
                        } else if (param.dropAlign === 'center') {
                            $(el).addClass('alignCenter');
                        } else if (param.dropAlign === 'right') {
                            $(el).addClass('alignRight');
                        } else if (param.dropAlign == 'left-edge') {
                            $(el).addClass('alignLeftEdge');
                        } else {
                            $(el).addClass('alignLeft');
                        }

                        // dropdown Type
                        if (param.dropType === 'imageLeft') {
                            subMegaMenu.addClass('imageLeft');
                            subMegaMenu.wrapInner('<div class="cateArea colRight"></div>');
                            subMegaMenu.append(`<div class="imageArea colLeft">${param.images}</div>`);
                        } else if (param.dropType === 'imageRight') {
                            subMegaMenu.addClass('imageRight');
                            subMegaMenu.wrapInner('<div class="cateArea colLeft"></div>');
                            subMegaMenu.append(`<div class="imageArea colRight">${param.images}</div>`);
                        } else if (param.dropType === 'noImage') {
                            subMegaMenu.addClass('noImage').wrapInner('<div class="cateArea"></div>');
                            subMegaMenu.find('.cateArea').css({
                                'max-width': '100%'
                            });
                        } else if (param.dropType === 'imageTop') {
                            subMegaMenu.addClass('imageTop').wrapInner('<div class="cateArea"></div>');
                        }

                        // dropdown Width
                        if ((param.dropAlign === 'fullWidth')) {
                            subMegaMenu.wrapInner('<div class="container"></div>');
                            subMegaMenu.css({
                                'width': '100%'
                            });
                        } else {
                            subMegaMenu.css({
                                'width': param.dropWidth
                            });
                        }

                        // cateColumns
                        if (param.cateColumns === 2) {
                            subMegaMenu.find('.cateArea').addClass('columns-2');
                        } else if (param.cateColumns === 3) {
                            subMegaMenu.find('.cateArea').addClass('columns-3');
                        } else if (param.cateColumns === 4) {
                            subMegaMenu.find('.cateArea').addClass('columns-4');
                        } else if (param.cateColumns === 5) {
                            subMegaMenu.find('.cateArea').addClass('columns-5');
                        } else if (param.cateColumns === 6) {
                            subMegaMenu.find('.cateArea').addClass('columns-6');
                        }

                        // imageAreaWidth
                        subMegaMenu.find('.imageArea').css({
                            'width': '100%',
                            'max-width': param.imageAreaWidth
                        });

                        // cateAreaWidth
                        if (subMegaMenu.hasClass('noImage')) {
                            subMegaMenu.find('.cateArea').css({
                                'width': '100%',
                                'max-width': '100%'
                            });
                        } else {
                            subMegaMenu.find('.cateArea').css({
                                'width': '100%',
                                'max-width': param.cateAreaWidth
                            });
                        }

                        if (param.bottomCates.length && (param.bottomCates !== '')) {
                            subMegaMenu.find('.cateArea').addClass('has-bottom-cates');
                            subMegaMenu.find('.cateArea > ul').append(`<div class="bottomCate" style="max-width: ${param.cateAreaWidth}">${param.bottomCates}</div>`);
                        }

                        if (param.imagesTop.length && (param.imagesTop !== '')) {
                            function megamenuImageTop($_image_array) {
                                let j = 1;
                                for (let i = 0; i < $_image_array.length; i++) {
                                    j += 1;
                                    subMegaMenu.find(`.cateArea > ul > li:nth-child(${j}) > .navPages-action`).after($_image_array[i]);
                                }
                            }
                            megamenuImageTop(param.imagesTop);
                        }

                        if (param.bottomMegamenu.length && (param.bottomMegamenu !== 'none')) {
                            subMegaMenu.append(`<div class="bottomMegamenu">${param.bottomMegamenu}</div>`);
                        }
                    } else {
                        const navPages_action = $(el).children('.navPages-action');
                        // label: New, Sale, Hot
                        if (param.label === 'new') {
                            navPages_action.after('<p class="navPages-label-wrap"><span class="navPages-label new-label">New</span></p>');
                        } else if (param.label === 'sale') {
                            navPages_action.after('<p class="navPages-label-wrap"><span class="navPages-label sale-label">Sale</span></p>');
                        } else if (param.label === 'hot') {
                            navPages_action.after('<p class="navPages-label-wrap"><span class="navPages-label hot-label">Hot</span></p>');
                        }
                    }
                });
                return this;
            }
        };
}
}
