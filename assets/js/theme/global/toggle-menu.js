import $ from 'jquery';

export default function () {

    const $toggleMenu = $('[data-togglemenu]');
    const $body = $('body');
    let $targetMenuItem;
    let targetMenuItemID;

    function toggleMenu() {
        $toggleMenu.on('click', menuClicked);
        $body.on('click', blurMenu);
    }

    function menuClicked(e) {
        e.preventDefault();

        closeOtherMenus();

        $targetMenuItem = $(e.target);

        if (!$targetMenuItem.hasClass('is-open')) {
            toggleThisMenu($targetMenuItem);
        }

    }

    function toggleThisMenu($targetMenuItem) {
        targetMenuItemID = $targetMenuItem.data('togglemenu');

        $targetMenuItem.toggleClass('is-open').attr('aria-expanded', (i, attr) => {
            return attr == 'true' ? 'false' : 'true';
        });

        $(`#${targetMenuItemID}`).toggleClass('is-open').attr('aria-hidden', (i, attr) => {
            return attr == 'true' ? 'false' : 'true';
        });
    }

    function closeOtherMenus() {
        let $menuToClose = $toggleMenu.filter('.is-open');
        if ($menuToClose.length) {
            toggleThisMenu($menuToClose);
        }
    }

    function blurMenu(e) {
        if (!e.target.hasAttribute('data-togglemenu')) {
            closeOtherMenus();
        }
    }

    if ($toggleMenu.length) {
        toggleMenu();
    }

}
