export default function (context, $gallery) {
    let container_div = $gallery.attr('class');
        container_div = container_div.replace('modal-body', '').replace(' ', '');

    jQuery.fn.vGallery = function (options) {
        const element = jQuery(this);
        const galleryID = `#${element.attr("id")}`;

        const brand = $('.productView-details .productView-brand a').text();
            const title = $('.productView-details .productView-title').text();
        if ($('#video-gallery-pc-popup').length) {
            $('#video-gallery-pc-popup .modal-header-title').html(`<strong>${brand}</strong>${title}`);
        }

        if (!options) var options = {};
        const b = new themevaleGallery();
        b.init(element , options);

        $('[data-image-gallery-item]', $gallery).each(function () {
            b.add({ 'thumbnail': $(this).find('img').attr('src') ,'url': $(this).attr('data-image-gallery-zoom-image-url') });
        });

        $('[data-video-item]', $gallery).each(function () {
            b.add({ 'thumbnail': `//i.ytimg.com/vi/${$(this).attr('data-video-id')}/default.jpg`,'content': `<iframe class='youtube-iframe' width='100%'  src='https://www.youtube.com/embed/${$(this).attr('data-video-id')}?enablejsapi=1' frameborder='0' allowfullscreen></iframe>` });
        });

        b.addPopview();
    };

    function themevaleGallery() {
        let g_objGallery;
        let g_options = {
        };

        this.init = function (gallery, customOptions) {
            g_objGallery = jQuery(gallery);
            g_options = jQuery.extend(g_options, customOptions);
            this.data = [];
        };

        this.data = [];
        this.round = [];
        this.add = function (ops) {
            if (ops.url || ops.content) {
                const dfs = { 'thumbnail': '','url': '','type': '','content': '','w': 0,'height': 0,'loaded': false };
                ops = $.extend({},dfs,ops);

                if (ops.content)ops.u_content = ops.content;
                else {
                    if (!ops.type)ops.type = 'image';
                    if (ops.type = 'image') {
                        ops.u_content = `<img src='${ops.url}'>`;
                    }
                }

                if (!ops.thumbnail) ops.thumbnail = ops.url;
                if (ops.thumbnail) ops.u_thumbnail = `<img src='${ops.thumbnail}'>`;
                else ops.u_thumbnail = ops.u_content;
                if (!ops.u_thumbnail) ops.u_thumbnail = "<div class='thumbnail'></div>";

                this.data.push(ops);
            }
        };
        this.reround = function () {
            this.round = [];
            let pp;
            const c = this.data.length;
            for (let i = 0; i < c; i++) {
                pp = { 'next': i + 1,'prev': i - 1,'current': i };
                this.round[i] = pp;
                this.data[i].stt = i;
            }
            this.round[0].prev = c - 1;
            this.round[c - 1].next = 0;
        };
        this.addPopview = function (ops) {
            this.reround();
            const dfs = { 'width': '100%','height': '100%','view_slide': true,cur: 0,'time': 400,'center': true };
            ops = $.extend({},dfs,ops);
            ops.map = { 'di': {},'ve': {},'round': {} }; ops.stt = 0;
            const cthis = this;
            set();
            bindEvent();

            function set() {
                if ($(`.${container_div}.vgallery_popup`).length > 0) $(`.${container_div}.vgallery_popup`).remove();
                const s = `<div class='${container_div} vgallery_popup'><div class='acontent'><div class='bcontent'></div></div></div>`;

                if (g_objGallery.hasClass(container_div)) {
                    g_objGallery.html(s);
                } else {
                    g_objGallery.append(s);
                }
                g_objGallery.find('.vgallery_popup').hide();
                g_objGallery.find(`.${container_div}`).show();

                ops.ob = $(`.${container_div}.vgallery_popup`);
                ops.ob_ccontent = $('>.acontent',ops.ob);
                ops.ob_content = $('>.acontent>.bcontent',ops.ob);
                $(ops.ob_ccontent).css({ 'width': ops.width,'height': ops.height });
                if (ops.view_slide) draw_slide();
            }
            function aview(pp) {
                return `<li><span class='thumbbsd' data='${pp.stt}'>${pp.u_thumbnail}</span></li>`;
            }
            function draw_slide() {
                let s1 = ''; let s2 = '';

                for (var i = 0; i < cthis.data.length; i++) {
                    if (cthis.data[i].type) s1 += aview(cthis.data[i]);
                    else s2 += aview(cthis.data[i]);
                }
                if (s1)s1 = `<div class='gallery-thumbnail gallery-thumbnail-1'><h2></h2><ul>${s1}</ul></div>`;
                if (s2)s2 = `<div class='gallery-thumbnail gallery-thumbnail-2'><h2></h2><ul>${s2}</ul></div>`;
                const s = `<div class='content_slide'><div class='box1'><div class='btn-arrow btn-prev'></div><div class='galleryView'></div><div class='btn-arrow btn-next'></div></div><div class='box2'>${s1}${s2}</div></div>`;
                $(ops.ob_content).append(s);
                ops.ob_sct = $('.box1 > .galleryView');
                ops.ob_e = $('.thumbbsd',ops.ob);
                var i = -1;
                $.each(ops.ob_e,function () {
                    i++;
                    const v = $(this).attr('data');
                    ops.map.di[i] = v;
                    ops.map.ve[v] = i;
                });
                ar(ops.cur);
            }
            function ar(num) {
                if (num == -1) {
                    $(ops.ob_sct).html('');
                } else {
                    ops.cur = num;
                    ops.current = ops.map.ve[ops.cur];

                    $(ops.ob_e).removeClass('thumb-video');
                    $(ops.ob_e).eq(ops.map.ve[ops.cur]).addClass('thumb-video');
                    $(ops.ob_sct).animate({ 'opacity': 0 },ops.time / 2,() => {
                        $(ops.ob_sct).html(cthis.data[num].u_content);
                        $(ops.ob_sct).animate({ 'opacity': 1 },ops.time / 2);
                        $(ops.ob_sct).trigger('zoom.destroy').zoom({ touch: false, onZoomIn: true, onZoomOut: true });
                    });
                }
            }
            function bindEvent() {
                $('[data-image-gallery-main]', $gallery).bind('click', (e) => {
                    ar(ops.cur);
                    e.preventDefault();
                });
                $('[data-image-gallery-item]', $gallery).bind('hover', function (e) {
                    const num = $('[data-image-gallery-item]', $gallery).index(this);
                    if (num != -1) {
                        ops.cur = num;
                    }
                });
                $('[data-image-gallery-item]', $gallery).bind('click', function (e) {
                    let container_div = $gallery.attr('class');
                    container_div = container_div.replace('modal-body', '').replace(' ', '');
                    $('.vgallery_popup').hide();
                    $(`.${container_div}.vgallery_popup`).show();
                    console.log($('[data-image-gallery-item]', $gallery).index(this));
                    ar($('[data-image-gallery-item]', $gallery).index(this));

                    e.preventDefault();
                });
                $('[data-video-icon]', $gallery).bind('click', (e) => {
                    let container_div = $gallery.attr('class');
                    container_div = container_div.replace('modal-body', '').replace(' ', '');
                    $('.vgallery_popup').hide();
                    $(`.${container_div}.vgallery_popup`).show();
                    ar($('[data-image-gallery-item]', $gallery).length);
                    e.preventDefault();
                });
                $('.btn-next',ops.ob).bind('click',(e) => {
                    if (ops.current > ops.ob.length) ops.current = ops.cur;
                    const s = cthis.round[ops.current].next;
                    ar(ops.map.di[s]);
                    e.preventDefault();
                });
                $('.btn-prev',ops.ob).bind('click',(e) => {
                    if (ops.current > ops.ob.length) ops.current = ops.cur;
                    const s = cthis.round[ops.current].prev;
                    ar(ops.map.di[s]);
                    e.preventDefault();
                });
                $(ops.ob_e).bind('click',function () {
                    const inx = $(this).attr('data');
                    ar(inx);
                });
            }
        };
    }

    $(document).ready(() => {
        $("#gallery").vGallery({
            gridpanel_vertical_scroll: false,
        });
    });
}
