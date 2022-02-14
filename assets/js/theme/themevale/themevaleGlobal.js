import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import jqueryCookie from 'jquery.cookie';
import themevale_AddOption from './themevale_AddOptionForProduct';

export default function(context) {
    function variantImageColor(){
        $(document).on('click', '.card .card-option .form-option', function(){
        var self = $(this),
            newImageVariant = self.data('image'),
            productItemElm = self.closest('.card');

            self.parents('.card-option').find('.form-option').removeClass('active');
            self.addClass('active');
            
            if (newImageVariant != "undefined") {
                productItemElm.find('.card-img-container > img').attr({
                    "srcset": newImageVariant,
                    "src": newImageVariant
                });
                return false;
            }
        });
    }
    variantImageColor();
    function headerPC() {
        if ($('.header').hasClass('themevale-header-layout-2')) {

            if ($('.header').hasClass('is_sticky')) {
                var heightHeader = $('.navPages-container .navPages').outerHeight();
            } else {
                var heightHeader = $('.header').outerHeight();
            }
        } else {
            if ($('.header').hasClass('is_sticky')) {
                var heightHeader = $('.themevale_header').outerHeight();
            } else {
                var heightHeader = $('.header').outerHeight();
            }
        }

         $('.themevale_dropdown').css('top', heightHeader);

         // Margin Top Home Slideshow For Layout 2
         if ($('.header').hasClass('themevale-header-layout-2')) {
            if ($('.header').hasClass('is_sticky')) {
                var height = $('.navPages-container .navPages').height();
            } else {
                var height = $('.themevale_header').height() + $('.navPages-container .navPages').height();
            }
            var top = 0 - height;
            $('.heroCarousel').css('margin-top', top);
         }

        // Dropdown Right Menu
        $('.right-nav .mobileMenu-toggle').on('click', function(ev) {
            ev.preventDefault();
            $(this).toggleClass('is-open');
            $('body').toggleClass('themevale_open_rightMenu');
            $('.search-nav .search-icon').removeClass('is-open');
            $('.wrapper-top-cart .cart-icon').removeClass('is-open');
        });

        $('.right-nav .mobileMenu-toggle .themevale_close').on('click', function(ev) {
            $('body').removeClass('themevale_open_rightMenu');
        });

        // Dropdown Search
        $('.search-nav .search-icon').on('click', function(ev) {
            ev.preventDefault();
            $(this).toggleClass('is-open');
            $('body').toggleClass('themevale_open_search');
            $('.right-nav .mobileMenu-toggle').removeClass('is-open');
            $('.wrapper-top-cart .cart-icon').removeClass('is-open');
            searchProductsBlock();

            const $previewCartList = $('.dropdown--quickSearch');
            $previewCartList.mCustomScrollbar('destroy');
            if ($previewCartList.length) {
                $previewCartList.mCustomScrollbar({
                    scrollInertia: 400,
                    mouseWheel:true
                });
            }
        });


        $('.search-nav .search-icon .themevale_close').on('click', function(ev) {
            $('body').removeClass('themevale_open_search');
        });

        // Dropdown Cart
        $('.wrapper-top-cart .cart-icon').on('click', function(ev) {
            ev.preventDefault();
            $(this).toggleClass('is-open');
            $('body').toggleClass('themevale_open_cart');
            $('.right-nav .mobileMenu-toggle').removeClass('is-open');
            $('.search-nav .search-icon').removeClass('is-open');
        });

        $('.wrapper-top-cart .cart-icon .themevale_close').on('click', function(ev) {
            $('body').removeClass('themevale_open_cart');
        });

        $(document).on('click', function(ev) {

            if ($(ev.target).closest('.right-nav').length === 0 && $(ev.target).closest('.right-nav .mobileMenu-toggle').length === 0 && $('body').hasClass('themevale_open_rightMenu')) {
                $('body').removeClass('themevale_open_rightMenu');
                $('.right-nav .mobileMenu-toggle').removeClass('is-open');
            }
 
            if ($(ev.target).closest('.search-nav').length === 0 && $(ev.target).closest('.search-nav .search-icon').length === 0 && $('body').hasClass('themevale_open_search')) {
                $('body').removeClass('themevale_open_search');
                $('.search-nav .search-icon').removeClass('is-open');
            }
        
            if ($(ev.target).closest('.wrapper-top-cart').length === 0 && $(ev.target).closest('.wrapper-top-cart .cart-icon').length === 0 && $('body').hasClass('themevale_open_cart')) {
                $('body').removeClass('themevale_open_cart');
                $('.wrapper-top-cart .cart-icon').removeClass('is-open');
            }
        });

    }

    if ($(window).width() > 1024) {
        headerPC();
    }

    // Header Mobile
    //====================================

    function activeMenu_Mobile() {
        if ($(window).width() <= 1024) {
            if ($('#quickSearch .dropdown--quickSearch').length) {
                $('#quickSearch .dropdown--quickSearch .dropdown--quickSearch-inner').appendTo(' #search-mobile .dropdown--quickSearch');
            }
            if ($('#menu .navPages').length) {
                $('#menu .navPages').appendTo('#menuMobile');
            }
            $('.imageTop .cateArea > .navPage-subMenu-list > .navPage-subMenu-item-child').each(function() {
                $(this).find('.imageTop-item').appendTo($(this).find('.navPage-subMenu-title'));
            });
            
        } else {
            if (!$('#quickSearch .dropdown--quickSearch').length) {
                $('#search-mobile #dropdown--quickSearch .dropdown--quickSearch-inner').appendTo('#quickSearch .dropdown--quickSearch');
            }
            if (!$('#menu .navPages').length) {
                $('#menuMobile .navPages').appendTo('#menu');
            }
        }
    }
    activeMenu_Mobile();

    function toggleAccount_mobile() {
        
        $('.accountMobile').on('click', function(e) {
            $('body').addClass('themevale_open-Account');
        });

        $('#account-mobile .themevale_close2').on('click', function(e) {
            $('body').removeClass('themevale_open-Account');
        });
        
        $('.themevale_background').on('click', function(e) {
            if ($('body').hasClass('themevale_open-Account')) {
                $('body').removeClass('themevale_open-Account');
            }
        });
    }
    toggleAccount_mobile();

    function toggleCart_mobile() {
        
        $('.cartMobile').on('click', function(e) {
            $('body').addClass('themevale_open-Cart');
        });

        $('#cart-mobile .themevale_close2').on('click', function(e) {
            $('body').removeClass('themevale_open-Cart');
        });

        $('.themevale_background').on('click', function(e) {
            if ($('body').hasClass('themevale_open-Cart')) {
                $('body').removeClass('themevale_open-Cart');
            }
        });
    }
    toggleCart_mobile()

    function toggleSearch_mobile() {
        
        $('.searchMobile').on('click', function(e) {
            $('body').addClass('themevale_open_search');
            searchProductsBlock();
        });

        

        $('#search-mobile .themevale_close2').on('click', function(e) {
            $('body').removeClass('themevale_open_search');
        });

        $('.themevale_background').on('click', function(e) {
            if ($('body').hasClass('themevale_open_search')) {
                $('body').removeClass('themevale_open_search');
            }
        });
    }

    toggleSearch_mobile();

    //Carousel Mage Menu 
    function carouselMegaMenu() {
        $('.featuredProductCarousel').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll:1,
            dots: false,
            arrows: true
        });

        $(".navPages-list li").mouseover(function() {
            $('.featuredProductCarousel').get(0).slick.setPosition();
        });
        $(".navPages .navPages-action .navPages-action-moreIcon").on("click", function() {
            $('.featuredProductCarousel').get(0).slick.setPosition();
        });

        $('.featuredProductCarousel .product').each(function(index) {
            var title = $(this).find('.card-title > a').text().trim();
            if (title.length > 40) {
              var truncated = title.substring(0, 40).split(" ").slice(0, -1).join(" ") + "…";
              $(this).find('.card-title > a').text(truncated);
            }
        });
    }
    
    if ($('.featuredProductCarousel').length) {
        carouselMegaMenu();
    }
    
    // Product in Quick Search Popup
    function searchProductsBlock() {
        var productIDS = context.themeSettings.search_product_block_id;
        var listIDs = JSON.parse("[" + productIDS + "]");

        for (var i = 0; i < listIDs.length; i++) {
             var productId = listIDs[i];

             if ($('.search_product_block .productGrid').length) {
               if ($('.search_product_block .productGrid li').length <=0) {
                    utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {
                        var data_product_id = $('.productView-title', $(response)).attr('data-product-id');
                        var brand = $('.productView-brand a', $(response)).text();
                        var name = $('.productView-title', $(response)).text();
                        var img = $('.productView-image', $(response)).find('img').attr('src');
                        var url = $('.productView-title', $(response)).data('url');
                        var price = $('.productView-price', $(response)).html();                    
                        var html = '<li class="product">\
                                        <article class="card" data-product-id="'+data_product_id+'">\
                                            <figure class="card-figure">\
                                            <div class="card-img-container">\
                                                <a href="'+url+'"><img class="card-image" src="'+img+'" alt="'+name+'" title="'+name+'"></a>\
                                            </div>\
                                            </figure>\
                                            <div class="card-body">\
                                                <p class="card-text card-brand" data-test-info-type="brandName">'+brand+'</p>\
                                                <h4 class="card-title"><a href="'+url+'">'+name+'</a></h4>\
                                                <div class="card-text card-price">'+price+'</div>\
                                            </div>\
                                        </article>\
                                    </li>';

                        $('#search_product_block .productGrid').append(html);
                    });
               }
                 
            }
        }
    }
    

    /* ======= Homepage ============*/

    // Count Down Hero Carousel
    function countDownHeroCarousel() {
        var countDown = context.themeSettings.hero_carousel_countdown;
        var position = (parseInt(context.themeSettings.hero_carousel_countdown_position) + 1);
        var btn2 = context.themeSettings.hero_carousel_button_2;
        
        $('.heroCarousel .slide-item:nth-child(' + position + ')').each(function(index) {
            $(this).find('.heroCarousel-content .heroCarousel-description').after('<div class="countDowntimer" data-count-down="'+countDown+'"></div>');
            $(this).find('.heroCarousel-content .btn-group').append('<span class="heroCarousel-action button button--primary button--large button2">'+btn2+'</span>');
            $(this).find('.heroCarousel-content .btn-group').addClass('two-button');
            $(this).addClass('has-count-down');
        });
    }
    countDownHeroCarousel();

    function initCountdown (id) {
        if ($('.countDowntimer').length) {
            // Set the date we're counting down to        
            var countDownDate = new Date( $('.countDowntimer').attr('data-count-down')).getTime();

            // Update the count down every 1 second
            var countdownfunction = setInterval(function() {

                // Get todays date and time
                var now = new Date().getTime();
        
                // Find the distance between now an the count down date
                var distance = countDownDate - now;
        
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(countdownfunction);
                    $(".countDowntimer").html('');
                } else {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
                    // Output the result in an element with id="countDowntimer"
                    var strCountDown = "<div class='clock-item'><span class='num'>"+ days + "</span><span class='text'>days</span></div><div class='clock-item'><span class='num'>"+ hours + "</span><span class='text'>hours</span></div><div class='clock-item'><span class='num'>" + minutes + "</span><span class='text'>mins</span></div><div class='clock-item'><span class='num'>" + seconds + "</span><span class='text'>secs</span></div>";
                    $(".countDowntimer").html(strCountDown);
                }
            }, 1000);
        }
    }
    initCountdown();

    // Count Down on Sticky Add To Cart
    function initCountdown2 (id) {
        if ($('.countDowntimer2').length) {
            // Set the date we're counting down to        
            var countDownDate2 = new Date( $('.countDowntimer2').attr('data-count-down2')).getTime();

            // Update the count down every 1 second
            var countdownfunction2 = setInterval(function() {

                // Get todays date and time
                var now = new Date().getTime();
        
                // Find the distance between now an the count down date
                var distance2 = countDownDate2 - now;
        
                // If the count down is over, write some text 
                if (distance2 < 0) {
                    clearInterval(countdownfunction2);
                    $(".countDowntimer2").html('');
                } else {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance2 / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance2 % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance2 % (1000 * 60)) / 1000);
            
                    // Output the result in an element with id="countDowntimer"
                    var strCountDown2 = "<div class='clock-item'><span class='num'>"+ days + "</span><span class='text'>D : </span></div><div class='clock-item'><span class='num'>"+ hours + "</span><span class='text'>H : </span></div><div class='clock-item'><span class='num'>" + minutes + "</span><span class='text'>M : </span></div><div class='clock-item'><span class='num'>" + seconds + "</span><span class='text'>S</span></div>";
                    $(".countDowntimer2").html(strCountDown2);
                }
            }, 1000);
        }
    }
    initCountdown2();

    // Add To Wishlist
     $('body').on('click', '.card .wishlist', (e) => {
        e.preventDefault();
        var $this_wl = $(e.currentTarget);
        var url_awl = $this_wl.attr('href');

        if ($('body').hasClass('wl-login')) {
            $.post(url_awl).done(function() {
                window.location.href = url_awl;
            });
        }
        else {
            window.location.href = '/login.php';
        }
    });
     
    // Click Active Products Tab
     function clickActiveProductsTab() {
        $('.themevale_tabs > li').on('click', function(ev) {
             $('.themevale_tabs-contents .slick-slider').slick('refresh');
        });
     }
     clickActiveProductsTab();

    // Home Category Tab Product New
    function home_category_banner_block_slider(id_tab){
        var column = context.themeSettings.homepage_carousel_products_column;
        if(!$('#'+id_tab+' .productCarousel').hasClass('slick-slider')) {

            $('#'+id_tab+' .productCarousel').slick({
                  nav: true,
                  dots: true,
                  arrows: false,
                  slidesToShow: 1,
                  infinite: false,
                  slidesToScroll: 1,
                  mobileFirst: true,
                  responsive: [
                    {
                    'breakpoint': 1550,
                        'settings': {
                            'arrows': true,
                            'dots': false,
                            'slidesToScroll': column,
                            'slidesToShow': column
                        }
                    },
                    {
                    'breakpoint': 1440,
                        'settings': {
                            'arrows': true,
                            'dots': false,
                            'slidesToScroll': 5,
                            'slidesToShow': 5
                        }
                    },
                    {
                    'breakpoint': 1280,
                        'settings': {
                            'arrows': true,
                            'dots': false,
                            'slidesToScroll': 4,
                            'slidesToShow': 4
                        }
                    },
                    {
                    'breakpoint': 1024,
                        'settings': {
                            'arrows': false,
                            'dots': true,
                            'slidesToScroll': 4,
                            'slidesToShow': 4
                        }
                    },
                    {
                    'breakpoint': 991,
                        'settings': {
                            'arrows': false,
                            'dots': true,
                            'slidesToScroll': 4,
                            'slidesToShow': 4
                        }
                    },
                    {
                    'breakpoint': 767,
                        'settings': {
                            'arrows': false,
                            'dots': true,
                            'slidesToScroll': 3,
                            'slidesToShow': 3
                        }
                    },
                    {
                    'breakpoint': 320,
                        'settings': {
                            'arrows': false,
                            'dots': true,
                            'slidesToScroll': 2,
                            'slidesToShow': 2
                        }
                    }
                    ]
            });
        }
    }

    /* Home Category Product tab - when click on Tab title */
    $('#home_new_products ul li a').on("click", function() {
        event.preventDefault();            
        var thisItem = $(this).parents('#home_new_products');
        var url = $(this).attr('cat-url');
        var cat_id = $(this).attr('cat-id');
        if($('#tab-'+cat_id).find('.product_category').length ==0 ){
          var sort_new = '?sort=newest';
          url += sort_new;                         
          if(url && thisItem.find('#block-cat-'+cat_id).length === 0){  
              thisItem.find('#tab-'+cat_id).append('<div class="loading-items text-center"><div class="loadingOverlay" style="display:block;"></div>');
              utils.api.getPage(url, { template: 'themevale/homepage/home-category-content' }, (err, response) => {                  
              
                thisItem.find('#tab-'+cat_id).append(response);

                home_category_banner_block_slider('tab-'+cat_id); 
                 
                thisItem.find('#tab-'+cat_id).find('.card-img-container').each(function(){                      
                  var a = arrNew.indexOf($(this).data('product-id'));
                  if( a != -1){
                    if($(this).parents('.card-figure').find('.countDowntimer').length > 0) {
                        $(this).parents('.card-figure').find('.countDowntimer').after('<div class="product-badge new-badge"><span class="text">New</span></div>')
                    } else {
                        $(this).parents('.card-figure').find('.card-figcaption-top').after('<div class="product-badge new-badge"><span class="text">New</span></div>')
                    }
                  }

                });
                //Update Variant Color
                if ( context.themeSettings.themevale_color_variant == true ) {
                    var block_id = thisItem.find('.tabs-contents .tab-content.is-active').attr('id');
                    themevale_AddOption(context, block_id);
                }
                // End
            });                          
          }
        }

        if ($('#tab-'+cat_id).find('#homeNewProducts').length) {
            $('#tab-'+cat_id).find('#homeNewProducts').before('<div class="loading-items text-center"><div class="loadingOverlay" style="display:block;"></div></div>');
        }
        
        $('.slick-slider').slick('refresh');

        if ($('#tab-'+cat_id).find('.loading-items').length) {
            setTimeout(function () {
               $('#tab-'+cat_id).find('.loading-items').remove();  
            }, 100);
        }
        
    });
    $('#home_new_products ul li a.all').on("click", function() {
        $('#tab-all').append('<div class="loading-items text-center"><div class="loadingOverlay" style="display:block;"></div></div>');
        setTimeout(function () {
            $('#tab-all').find('.loading-items').remove();
        }, 300);
    })

    /* Home Custom Tab Product - Editor's Pick Tab */
    function home_custom_tab_products(){
        var thisItem = $("#homeTabsProducts");   
        var url = thisItem.find('.tabs .custom-tab-title').attr('cat-url');

        if (thisItem.find('.tab-content-custom').length > 0) {
            thisItem.find('.tab-content-custom').html('<div class="loading-items text-center"><div class="loadingOverlay" style="display:block;"></div>');
            
            utils.api.getPage(url, { template: 'themevale/homepage/home-category-content' }, (err, response) => {                  
                thisItem.find('#tab-custom').find('.loading-items').remove();                   
                thisItem.find('#tab-custom').html(response); 
                home_category_banner_block_slider('tab-custom');
                                
                thisItem.find('#tab-custom').find('.card-figcaption-top').each(function(){

                  var a = arrNew2.indexOf($(this).data('product-id'));

                  if( a != -1){                       
                    if($(this).find('.countDowntimer').length > 0) {
                        $(this).find('.countDowntimer').after('<div class="product-badge new-badge"><span class="text">New</span></div>')
                    } else {
                        $(this).after('<div class="product-badge new-badge"><span class="text">New</span></div>')
                    }
                  }
                });
                if ( context.themeSettings.themevale_color_variant == true ) {
                    var block_id = thisItem.find('.tabs-contents .tab-content').attr('id');
                    themevale_AddOption(context, block_id);
                }

                //-----------------
                // if ( context.themeSettings.themevale_color_variant == true ) {
                //     thisItem.find('#tab-custom').find('a.button.themevale_Option').each( function(i, val){
                //         const $prodId = $(val).data('product-id');
                //         const $thisProd = $(val).parents('.card').parent();
                //         showProductVariant($thisProd, $prodId);

                //     });
                // }
            }); 
        }
    }
    home_custom_tab_products();

    $('#homeTabsProducts ul li a').on("click", function() {
        var tab = $(this).attr('href');
        var idTab = tab.replace('#', '');

        $(tab).append('<div class="loading-items text-center"><div class="loadingOverlay" style="display:block;"></div></div>');
        home_category_banner_block_slider(idTab);
        setTimeout(function () {
            $(tab).find('.loading-items').remove();
        }, 300);
    });

    function showProductVariant($thisProd, $prodId) {
        var newProduct= context.themeSettings.homepage_carousel_products_count;
        if( $prodId != undefined){

            const $options = {
                config: {
                    products: {
                        new: {
                            limit: newProduct,
                        },
                    },
                },
                template: { item : 'themevale/homepage/home-custom-product-tabs-item',
                            swap : 'themevale/homepage/themevaleAdvancedProductImageSwap'
                        }
            };
            utils.api.product.getById($prodId, $options, (err, response) => {
                if (err) {
                    return false;
                }

                $thisProd.html(response.item);
                var colorVariantToShow = 4;
                var productLink = $thisProd.find('.card-title > a').attr('href');

                //image swap
                if ($('[data-product-attribute="swatch"]', response.swap).length == 1) {
                    var $response = $(response.swap).find('.form-label--alternate, .form-radio, .form-option-expanded').remove().end();
                    var count_option = $('[data-product-attribute-value]',$('[data-product-attribute="swatch"]', response.swap)).length;
                    var more_option = (count_option - colorVariantToShow);
                    response.swap = $response;
                    var data_option = $('[data-product-attribute="swatch"]', response.swap).html();

                    if(count_option > colorVariantToShow){
                        $('[data-product-attribute-value]',$('[data-product-attribute="swatch"]', response.swap)).each(function(i){
                            if(i>=colorVariantToShow){
                                var option_id = $(this).attr('data-product-attribute-value');
                                data_option = data_option.replace('data-product-attribute-value=\"'+option_id+'\"', 'data-product-attribute-value="'+option_id+'" data-show style="display:none;" ');
                            }
                        });
                        data_option = data_option + '<span class="showmore"><a href="'+productLink+'" title="More Color">+'+more_option+'</a></span>';
                    }
                    $thisProd.find('.card-body .card-action-bottom').before("<div class='card_optionImage option2 product-option-" + $prodId + "'><div data-product-option-change><div data-product-attribute=\"swatch\">" + data_option + "</div></div></div>");                        
                }
                //end image swap

                // Size variant
                if ($('.Size[data-product-attribute="set-rectangle"]', response.swap).length == 1) {
                    var count_option2 = $('[data-product-attribute-value]',$('.Size[data-product-attribute="set-rectangle"]', response.swap)).length;
                    var more_option2 = (count_option2 - colorVariantToShow);
                    var data_option2 = $('.Size[data-product-attribute="set-rectangle"]', response.swap).html();

                    if(count_option2 > colorVariantToShow){
                        $('[data-product-attribute-value]',$('.Size[data-product-attribute="set-rectangle"]', response.swap)).each(function(i){
                            if(i>=colorVariantToShow){
                                var option_id2 = $(this).attr('data-product-attribute-value');
                                data_option2 = data_option2.replace('data-product-attribute-value=\"'+option_id2+'\"', 'data-product-attribute-value="'+option_id2+'" data-show style="display:none;" ');
                            }
                        });
                        data_option2 = data_option2 + '<span class="showmore"><a href="'+productLink+'" title="More Size">+'+more_option2+'</a></span>';
                    }
                    $thisProd.find('.card_optionSize').remove();
                    $thisProd.find('.card-figcaption2').prepend("<div class='card_optionSize product-option-" + $prodId + "'><div data-product-option-change><div data-product-attribute=\"set-rectangle\">" + data_option2 + "</div></div></div>");
                }

            });
        }
    }   

    function instagramShowMore() {
        var imageToShow = Number($('#InstagramGallery [data-show]').attr('data-show'));

        $('.infinite-scrolling-instagram .intagram-btn').on('click', function(e) {
            e.preventDefault();
            var listImages = $(this).parents('#InstagramGallery');
            listImages.find('.instagram-item:hidden:lt(' + imageToShow + ')').show();
            if (listImages.find('.instagram-item:hidden').length === 0) {
                $(this).addClass('no-more');
            }
        });

        if ($('#InstagramGallery #instafeed').length) {
            if ($('#instafeed .instagram-item').length > imageToShow) {
                $('#instafeed .instagram-item').css({ 'display': 'inline-block' });
                for(var i = imageToShow + 1; i <= $('#instafeed .instagram-item').length; i++) {
                    $('#instafeed .instagram-item:nth-child('+i+')').css({ 'display': 'none' });
                }
            }

            if (imageToShow == 4) {
                $('#instafeed').addClass('column-4');
            }
            if (imageToShow == 5) {
                $('#instafeed').addClass('column-5');
            }
            if (imageToShow == 6) {
                $('#instafeed').addClass('column-6');
            }
        }
    }
    if($('.page-type-default').length) {
        instagramShowMore();
    }

    function initSidebar() {
        if ($('.sidebar-label').length) {
            $('.sidebar-label').on('click', function(ev) {
                $('body').addClass('themevale_open_sidebar');
            });
        }
        if ($('.close-sidebar .icon').length) {
            $('.close-sidebar .icon').on('click', function(ev) {
                $('body').removeClass('themevale_open_sidebar');
            });
        }

        $('.themevale_background').on('click', function() {
            $('body').removeClass('themevale_open_sidebar');
         });
    }  
    initSidebar();

    // ========================================================================
    // Footer on Mobile & tablet
    // ========================================================================
    function footer_mobile() {
        if ($(window).width() <= 767) {
            if(!$('.footer-info').hasClass('footerMobile')) {
                $('.footer-info').addClass('footerMobile');
                $('.footer-dropdownmobile .footer-info-list').css('display', 'none');
            }
        } else {
            $('.footer-info').removeClass('footerMobile');
            $('.footer-dropdownmobile').removeClass('open-dropdown');
            $('.footer-dropdownmobile .footer-info-list').css('display', 'block');
        }
    }
    footer_mobile();

    function toggle_footer() {
        $(document).on('click', '.footerMobile .footer-dropdownmobile .footer-info-heading', function() {
            $(this).parent().toggleClass('open-dropdown');
            $(this).parent().find('.footer-info-list').slideToggle();
        });
    }
    toggle_footer();


    // Back to top
    function back_to_top() {
        var offset = $(window).height()/2;
        const backToTop = $('#back-to-top');
        const backToTopa = $('#back-to-top a');

        $(window).scroll(function() {
            ($(this).scrollTop() > offset) ? backToTop.addClass('is-visible') : backToTop.removeClass('is-visible ');
        });

        backToTopa.on('click', function(event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0
            }, 1000);
        });
    }
    back_to_top();


    // Someone Purchase
    function recentlyBought() {
        var productIDs = context.themeSettings.recently_bought_productID;
        var Location1 = context.themeSettings.recently_bought_location1;
        var Location2 = context.themeSettings.recently_bought_location2;
        var Location3 = context.themeSettings.recently_bought_location3;
        var Location4 = context.themeSettings.recently_bought_location4;
        var Location5 = context.themeSettings.recently_bought_location5;
        var Location6 = context.themeSettings.recently_bought_location6;
        var Location7 = context.themeSettings.recently_bought_location7;
        var Location8 = context.themeSettings.recently_bought_location8;
        var Location9 = context.themeSettings.recently_bought_location9;
        var Location10 = context.themeSettings.recently_bought_location10;
        var ar1 = Location1.split(',');
        var ar2 = Location2.split(',');
        var ar3 = Location3.split(',');
        var ar4 = Location4.split(',');
        var ar5 = Location5.split(',');
        var ar6 = Location6.split(',');
        var ar7 = Location7.split(',');
        var ar8 = Location8.split(',');
        var ar9 = Location9.split(',');
        var ar10 = Location10.split(',');

        var hoursItems = context.themeSettings.recently_bought_hours;
        var listHours = JSON.parse("[" + hoursItems + "]");

        var listIDs = JSON.parse("[" + productIDs + "]");

        var text_info = context.themeSettings.recently_bought_text_info;
        var text_name = context.themeSettings.recently_bought_text_name;

        var changeSlides = context.themeSettings.recently_bought_changeSlides;
        var changeSlidesTime = 1000 * (Number(changeSlides));

        $(".themevale_popup").prepend('<div id="recently_bought_list"></div>');

        var recently = setInterval(function(){
            $('.themevale_recently-bought').hide();
            var item = (Math.floor(Math.random()*listIDs.length));
            var productId = listIDs[item];

            var locationList = Array(ar1,ar2,ar3,ar4,ar5,ar6,ar7,ar8,ar9,ar10);
            var locationItem = (Math.floor(Math.random()*locationList.length));
            var location = locationList[locationItem];

            var hour_item = (Math.floor(Math.random()*listHours.length));
            var hours = listHours[hour_item];

            if ($.cookie('recently_bought_notification') == 'closed') {
                $('#recently_bought_list').remove();
                clearInterval(recently);
            }
            $(document).on('click','.themevale_recently-bought .modal-close',function(){
                $('#recently_bought_list').remove();
                clearInterval(recently);
                $.cookie('recently_bought_notification', 'closed', {expires:1, path:'/'});
            });
            if( $('#RB_'+ productId).length ) {             
                $('#RB_'+ productId).show();
                $('.themevale_recently-bought').css('animation-name','fadeInUp');
            }
            else {
                utils.api.product.getById(productId, { template: 'products/product-view' }, (err, response) => {
                    var name = $('.productView-product .productView-title', $(response)).text();
                    var img = $('.productView-image', $(response)).find('img').attr('src');
                    var url = $('.productView-title', $(response)).data('url');

                    var html = '<div id="RB_'+productId+'" class="themevale_recently-bought">\
                        <a href="#" class="modal-close" data-close-recently-bought><svg class="icon"><use xlink:href="#times"/></svg></a>\
                        <div class="recently-bought-inner">\
                            <div class="product-image">\
                                <a href="'+url+'"><img class="image" src="'+img+'" alt="'+name+'" title="'+name+'"></a>\
                            </div>\
                            <div class="product-info">\
                                <p class="text-wrap"><span class="text">'+text_name+'</span><span class="product-name"><a href="'+url+'">'+name+'</a></span></p>\
                                <div id="location-info">'+hours+' '+text_info+' '+location+'</div>\
                            </div>\
                        </div>\
                    </div>';
                    $('#recently_bought_list').append(html);

                    $('.themevale_recently-bought').css('animation-name','fadeInUp');

                });
            }
            setTimeout(function(){ 
                 $('#RB_'+ productId).hide();
                 
            }, 8000);
        }, changeSlidesTime); 
    }
    if ($(window).width() > 767) {
        if (context.themeSettings.recently_bought == true) {
            recentlyBought();
        } 
    } else {
        if(context.themeSettings.recently_bought == true && context.themeSettings.show_recently_bought_mobile == true) {
            recentlyBought();
        }
    }

        // ========================================================================
    // Lookbook
    // ========================================================================
    function lookbook() {
        const $options = {
            config: {
                products: {
                    new: {
                        limit: 20,
                    },
                },
            },
            template: 'themevale/product/lookbook-products'
        };
        const $thisProd = $('.lookbook-popup');
        $('.lookbook-item .position-point').on('click', function() {
            $thisProd.empty();
            var $prodId = $(this).data('product-id');
            var position = $(this).offset();
            var container = $('.page > .container').offset();
            var iconWidth = $(this).innerWidth();
            var innerLookbookModal = $('.lookbook-popup').innerWidth();
            var str3 = iconWidth + "px";
            var str4 = innerLookbookModal + "px";
            
            utils.api.product.getById($prodId, $options, (err, response) => {
                if (err) {
                    return false;
                }
                $thisProd.html(response);
            });
            $thisProd.toggleClass("show");
            if ($(window).width() > 551) {
                if (position.left > (innerLookbookModal + 30)) {
                    var newleft = "calc(" + position.left + "px" + " - " + str4 + " + " + "4px" + ")";
                    $thisProd.css({'top': position.top - container.top - 100, 'left': newleft});
                } else {
                    newleft = "calc(" + position.left + "px" + " + " + str3 + " - " + "4px" + ")";
                    $thisProd.css({'top': position.top - container.top - 100, 'left': newleft});
                }
                
            } else {
                $thisProd.css({'top': position.top - container.top + 15, 'left': 30});
            }
        });

        $(document).on('click', event => {
            if ($thisProd.hasClass("show")) {
                if (($(event.target).closest($thisProd).length === 0) && ($(event.target).closest('.position-point').length === 0)) {
                    $thisProd.removeClass("show");
                }
            }
        });

    }
    if($('.themevale_lookbook').length) {
        lookbook();
    }

    /* Shipping Mobile on Cart Page */
    function shippingMobile() {
        if ($(window).width() < 768) {
            $('.shipping-estimator').addClass('u-hiddenVisually');
        } else {
             $('.shipping-estimator').removeClass('u-hiddenVisually');
        }
    }
   shippingMobile();

    /* Image Carousel on Blog Detail page */
    function gallery_carousel() {
        $('.imageGallery-carousel').slick({
            dots: true,
            arrows: false,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 2,
            slidesToScroll: 2,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    arrows: true
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 551,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            }]
        });
    }
    if ($('.blog-post').length) {
        gallery_carousel();
    }
    
    if ( $("[data-fancybox]").length) {
        $("[data-fancybox]").fancybox({
            'animationEffect': 'fade',
            'transitionEffect': "fade"
        });
    }

    // ========================================================================
    // WINDOWN RESIZE
    // ========================================================================
    $(window).resize(function() {
        activeMenu_Mobile();
        footer_mobile();
        shippingMobile()
    });
}
