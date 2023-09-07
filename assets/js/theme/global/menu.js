const PLUGIN_KEY = 'menu';

export default function menu() {
    const $menu = $(`[data-${PLUGIN_KEY}]`);
    const $mobileMenu = $('[data-main-nav-mobile]');
    const $mobileOverlay = $('[data-mobile-nav-overlay]');
    const closeIcon = 'https://cdn11.bigcommerce.com/s-40wxilo4jg/product_images/uploaded_images/icon-menu-x.png';
    const openIcon = 'https://cdn11.bigcommerce.com/s-40wxilo4jg/product_images/uploaded_images/icon-hamburger-menu.png';

    const toggleSub = document.querySelectorAll('[data-submenu-toggle]');

    // Bind event listener for submenus
    toggleSub.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const menuSub = toggle.parentNode;
            if (menuSub.classList.contains('active')) {
                this.setAttribute('aria-expanded', 'false');
                menuSub.classList.remove('active');
            } else {
                // Remove 'active' class from all submenus
                toggleSub.forEach(toggle2 => {
                    toggle2.parentNode.classList.remove('active');
                    this.setAttribute('aria-expanded', 'false');
                });
                // Add 'active' the submenu clicked on
                menuSub.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    const showMobile = () => {
        $menu.find('img').attr('src', closeIcon);
        $mobileOverlay.addClass('nav-view');
    };

    const hideMobile = () => {
        $menu.find('img').attr('src', openIcon);
        $mobileMenu.removeClass('nav-view');
        $mobileOverlay.removeClass('nav-view');
    };

    const toggleMobile = () => {
        $menu.on('click', () => {
            $mobileMenu.toggleClass('nav-view');
            if ($mobileMenu.hasClass('nav-view')) {
                showMobile();
            } else {
                hideMobile();
            }
        });
    };

    window.onresize = () => {
        if ($(window).width() > 1000) {
            hideMobile();
        }
    };
    toggleMobile();

    
    const header = document.getElementById('header');

    window.addEventListener('scroll', function(e) {
        if(this.window.pageYOffset >= 100){
            if(!header.classList.contains('scrolled')){
                header.classList.toggle('scrolled');
            } 
        } else {
            if(header.classList.contains('scrolled')) {
              header.classList.toggle('scrolled');
            }
        }
    });

}
