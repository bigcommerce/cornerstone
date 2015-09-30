import $ from 'jquery';

export default function() {
    const $toggleMenu = $('[data-togglemenu]');
    const $body = $('body');

    function toggleThisMenu($targetMenuItem) {
        const targetMenuItemID = $targetMenuItem.data('togglemenu');

        $targetMenuItem.toggleClass('is-open').attr('aria-expanded', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });

        $(`#${targetMenuItemID}`).toggleClass('is-open').attr('aria-hidden', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });
    }

    function closeOtherMenus() {
        const $menuToClose = $toggleMenu.filter('.is-open');

        if ($menuToClose.length) {
            toggleThisMenu($menuToClose);
        }
    }

    function menuClicked(e) {
        e.preventDefault();
        e.stopPropagation();

        closeOtherMenus();

        const $targetMenuItem = $(e.currentTarget);

        if (!$targetMenuItem.hasClass('is-open')) {
            toggleThisMenu($targetMenuItem);
        }
    }

    function blurMenu(e) {
        if (!e.target.hasAttribute('data-togglemenu')) {
            closeOtherMenus();
        }
    }

    function toggleMenu() {
        $toggleMenu.on('click', menuClicked);
        $body.on('click', blurMenu);
    }

    if ($toggleMenu.length) {
        toggleMenu();
    }
}
