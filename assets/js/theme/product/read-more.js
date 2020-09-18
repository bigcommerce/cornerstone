export default class ReadMore {
    constructor() {
        $('#readmore-button').click(function () {
            let totalHeight;
            const $el = $(this);
            const $p = $el.parent();
            const $up = $p.parent();
            const $ps = $up.find("p:not('.read-more')");

            // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
            $ps.each(function () {
                totalHeight += $(this).outerHeight();
            });

            $up
                .css({
                    // Set height to prevent instant jumpdown when max height is removed
                    height: $up.height(),
                    'max-height': 9999,
                })
                .animate({
                    height: totalHeight,
                });

            // fade out read-more
            $p.fadeOut();

            // prevent jump-down
            return false;
        });
    }
}

