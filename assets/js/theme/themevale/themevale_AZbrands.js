import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';

export default class AZBrands {
    loaded(limit) {
        const $brands = $('[data-brands-list]');
        if ($brands.length > 0) {
            const $atozBrands = $(document.getElementById($brands.data('azbrands')));
            if ($atozBrands.length > 0) {
                this.generateAtoZBrands($atozBrands);
                this.updateAtoZBrands($brands, $atozBrands);
            }
            const url = $brands.data('brands-list-next');
            if (url) {
                this.loadMoreBrands($brands, url, true, limit);
            }
        }
    }

    generateAtoZBrands($atozBrands) {
        const azBrandsTableID = `${$atozBrands.attr('id')}Table`;
        const $atozBrandsTable = $(`#${azBrandsTableID}`);

        $atozBrandsTable.append('<li data-letter=""><a href="#">All</a></li>');
        const ch = '#';
        $atozBrands.append(`<div class="azBrands-group" data-letter="${ch}" id="azBrands-code-123"><h3 class="azBrands-group-title">${ch}</h3><ul class="brandList"></ul></div>`);
        $atozBrandsTable.append(`<li data-letter="${ch}"><a href="#azBrands-code-123" data-target="azBrands-code-123">${ch}</a></li>`);

        for (let i = 97; i < 123; i++) {
            let ch = '#';
            if (i < 123) {
                ch = String.fromCharCode(i);
            }
            $atozBrands.append(`<div class="azBrands-group" data-letter="${ch}" id="azBrands-code-${i}"><h3 class="azBrands-group-title">${ch}</h3><ul class="brandList"></ul></div>`);
            $atozBrandsTable.append(`<li data-letter="${ch}"><a href="#azBrands-code-${i}" data-target="azBrands-code-${i}">${ch}</a></li>`);
        }

        $atozBrands.addClass('active-all');
        $atozBrands.children().addClass('is-active');
        $atozBrandsTable.children(':first').addClass('is-active');

        $atozBrandsTable.on('click', 'a', (event) => {
            event.preventDefault();

            const $a = $(event.target);

            $atozBrandsTable.children('li').removeClass('is-active');
            $a.parent().addClass('is-active');

            const target = $a.data('target');
            if (target) {
                $atozBrands.children('.azBrands-group').removeClass('is-active');
                $atozBrands.children(`#${target}`).addClass('is-active');
                $atozBrands.removeClass('active-all');
            } else {
                $atozBrands.children('.azBrands-group').addClass('is-active');
                $atozBrands.addClass('active-all');
            }
        });
    }

    updateAtoZBrands($brands, $atozBrands) {
        const $atozBrandsTable = $(`#${$atozBrands.attr('id')}Table`);
        $brands.children('.brand').each((i, el) => {
            const $el = $(el);
            const code = String($el.data('brand-code'));
            const letter = code.charAt(0).toLowerCase();

            let $group = $atozBrands.children(`[data-letter=${letter}]`);
            if ($group.length === 0) {
                $group = $atozBrands.children(':first');
            }

            let $li = $atozBrandsTable.children(`[data-letter=${letter}]`);
            if ($li.length === 0) {
                $li = $atozBrandsTable.children(':last');
            }

            const $brandList = $group.find('.brandList');

            let $elIns;
            $brandList.children('.brand').each((j, el2) => {
                const $el2 = $(el2);
                const code2 = $el2.data('brand-code');

                if (code < code2) {
                    $elIns = $el2;
                } else {
                    return false;
                }
            });
            if ($elIns) {
                $el.insertAfter($elIns);
            } else {
                $el.appendTo($brandList);
            }
        });

        setTimeout(() => {
            $('#azBrands .azBrands-group ul').each(function (e) {
                const check = ($(this).find("li").length);
                if (check === 0) {
                    $(this).prev(".azBrands-group-title").addClass("not_valued");
                }
            });

            $atozBrands.children().each(function () {
                const temp = $(this).find(".azBrands-group-title.not_valued").text().trim();
                $atozBrandsTable.children().each(function () {
                    if ($(this).find('a').text().trim() == temp) {
                        $(this).find('a').addClass('disable');
                    }
                });
            });
        }, 3000);
    }

    loadMoreBrands($brands, url, recursive, limit) {
        utils.api.getPage(url, {
            template: 'themevale/brands-list',
            config: {
                brands: {
                    limit,
                },
            },
        }, (err, resp) => {
            const $brandsList = $(resp).find('[data-brands-list]');
            $brands.append($brandsList.children());

            const $atozBrands = $(document.getElementById($brands.data('azbrands')));
            if ($atozBrands.length > 0) {
                this.updateAtoZBrands($brands, $atozBrands);
            }

            const nextUrl = $brandsList.data('brands-list-next');
            if (nextUrl && recursive) {
                this.loadMoreBrands($brands, nextUrl, recursive, limit);
            }
        });
    }
}
