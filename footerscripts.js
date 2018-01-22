<div class="sweettooth-init"
  data-external-customer-id="{{customer.id}}"
  data-channel-api-key="pk_RQ3yNuWtsNY2ruhDsdZ4nC8w"
></div>
<script src="https://cdn.sweettooth.io/assets/storefront.js"></script>

<div class="sweettooth-tab"></div>

<!-- begin olark code -->
<script data-cfasync="false" type='text/javascript'>/*<![CDATA[*/window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){
    
f[z]=function(){
(a.s=a.s||[]).push(arguments)};var a=f[z]._={
},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){
f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={
0:+new Date};a.P=function(u){
a.p[u]=new Date-a.p[0]};function s(){
a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){
hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){
return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){
b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{
b.contentWindow[g].open()}catch(w){
c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{
var t=b.contentWindow[g];t.write(p());t.close()}catch(x){
b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({
loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
/* custom configuration goes here (www.olark.com/documentation) */
olark.identify('3499-933-10-8985');/*]]>*/</script><noscript><a href="https://www.olark.com/site/3499-933-10-8985/contact" title="Contact us" target="_blank">Questions? Feedback?</a> powered by <a href="http://www.olark.com?welcome" title="Olark live chat software">Olark live chat software</a></noscript>
<!-- end olark code -->

<script type="text/javascript">
(function($) {
    
    
    setTimeout(function(){
        $('.productView .productView-info-name:contains("Current Inventory:")').each(function() {
        $(this).addClass('current-inventory');
    });
    
    $('.current-inventory').next('.productView-info-value').addClass('current-inventory-value');
    $('.currentInventory:last-child').addClass('current-values');
    
    
    if( $('.current-inventory-value').html() == "0" ) {
        $('#form-action-addToCart').addClass('pre-order-btn');
    }
    
    
    $(".current-values").filter(function() {
        return $(this).text() === "0";
    }).siblings("#card-stock-message").addClass('show');
    
    $(".current-values").filter(function() {
        return $(this).text() === "0";
    }).parent(".card-body").siblings('.bottomCard').addClass('out-stock-card');
    
    $('#product-listing-container').children('.currentInventory:last-child').addClass("current-values");
        
    // Accordion
    
    $(".plusminus").html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
    
    $('.accordion--toggle').click(function(event){
     
        //Expand or collapse this panel
     
        $(this).next().slideToggle('fast');
        $(this).removeClass('inactive');
        $(this).addClass('active');
        $('.accordion--toggle').not(this).removeClass('active');
        $('.accordion--toggle').not(this).addClass('inactive');
  
        //Hide the other panels
      
        $(".accordion--content").not($(this).next()).slideUp('fast');
        
        $('.active').find('.plusminus').html('<i class="fa fa-angle-down" aria-hidden="true"></i>');
        $('.inactive').find('.plusminus').html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
    });
   
        
    }, 2000);
})(jQuery);
</script>



<script>

    var u = "https://forms.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=202&deploy=1&compid=3999511&h=7510a2e141429d7bb372";
    cb = 'returnProdData'
    function returnProdData(data){
        var productStockData = JSON.parse(data);
        (function($) {
            $('.isp_grid_product').each(function( index ) {
                    var isp_variants_options = new Object;
                    var p_id = $( this ).attr('product_id');
                    var product_data = ISP_PRODUCTS[p_id];
                    for( var i = 0, len = productStockData .length; i < len; i++ ) {
                        if($.inArray(product_data['sku'], productStockData[i] ) != -1) {
                            var ele = $(this).find('.isp_stock_status').text(productStockData[i][1]);
                            if(productStockData[i][1] == "On Backorder"){
                                ele.text(productStockData[i][2]);
                                ele.addClass('back-order-message');
                                $(this).find('.isp_add_to_cart_btn').addClass('backorder-button');
                                
                            }
                            var button = $(this).find('.isp_add_to_cart_btn');
                            button.attr("data-stocklevel", productStockData[i][3]);
                            button.attr("data-backorders", productStockData[i][4]);
                            //button.attr("onClick", "checkAmount()");
                        }
                    }
                
            });
        }(jQuery));
    }  
    function getJSONP(url) {
        console.log(url);
        var script = document.createElement('script');
        var head = document.getElementsByTagName('head')[0] || document.documentElement;
        script.src = url
        head.appendChild(script);
    }
        console.log('hello');
    
    var __isp_options = {
        isp_serp_with_product_attributes: true,
        isp_serp_callback: function() {
           var arrProductSkus = [];
            
            (function($) {
         
               
            $('.isp_grid_product').each(function( index ) {
                if(! $(this).find('.isp_stock_status').length){
                    $(this).find('.isp_product_desc').before('<div class=\"isp_stock_status\">Fetching Stock Data<span class=\"dots\"><span>.</span><span>.</span><span>.</span></span></div>');
                }
                $(".isp_product_price_wrapper").prepend(function() {
                    var ele = $(this);
                    ele.prependTo(ele.parent());
                });
                var p_id = $( this ).attr('product_id');
                if(arrProductSkus.indexOf(ISP_PRODUCTS[p_id ].sku) === -1){
                    arrProductSkus.push(ISP_PRODUCTS[p_id ].sku);
                }

            });

            getJSONP(u + '&callback=' + cb+'&products='+encodeURIComponent(JSON.stringify(arrProductSkus)));     
            arrProductSkus = [];
            }(jQuery));
        } // search results completion
    }
        
</script>
<script>
    //Check for disallowed BO

        (function($) {

            $(document).on('click', ".isp_add_to_cart_btn", function() {
                var quantEle = $(this).closest(".isp_add_to_cart_form").find(".isp_add_to_cart_quantity_num_serp");
                var quantity = new Number($(quantEle).val());
                var stocklevel = new Number($(this).attr('data-stocklevel'));
                var backorders = $(this).attr('data-backorders');
                if((quantity  > stocklevel) && (backorders == "T")){
                 alert("We don't have enough stock on hand for the quantity you selected. We only have "+stocklevel+" on hand. Please try again.");  
                    return false;
                }
                 if((quantity  > stocklevel) && (backorders == "F")){
                     var backorderamt = quantity - stocklevel;
                     alert("We don't have enough stock on hand for the quantity you selected. We only have "+stocklevel+" on hand. "+backorderamt+" will be on backorder.");  
                     return true;
                }
            });
            }(jQuery));

</script>
<style>

</style>

{{#if page_type '===' 'default'}}
<script>
//Front Page Product listings stock data
    function getHomeProductSku(){
        var arrProductSkus = [];
        var x = document.getElementsByClassName("data-sku");
        var skuStr = "";
        for (var i = 0; i < x.length; i++) {
            skuStr = x[i].innerHTML;
            arrProductSkus.push(skuStr);
        }
        console.log(arrProductSkus);
        getJSONP(u + '&callback=' + 'updateHomeProductStock'+'&products='+encodeURIComponent(JSON.stringify(arrProductSkus)));
    }
    function updateHomeProductStock(data){
        (function($) {
            var productStockData = JSON.parse(data);
            console.log(productStockData);
            for( var i = 0, len = productStockData .length; i < len; i++ ) {
                $('#'+productStockData[i][0]).text(productStockData[i][1]);
                if(productStockData[i][1] == "On Backorder"){
                    $('#'+productStockData[i][0]).text(productStockData[i][2]);
                    $('#'+productStockData[i][0]).addClass('back-order-message');
                    $(this).next().find('.button').addClass('backorder-button');
                    
                }
            }
        }(jQuery));
    }
   getHomeProductSku();
</script>
{{/if}}

{{#if page_type '===' 'product'}}
<script>
console.log("product");

    var u = "https://forms.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=202&deploy=1&compid=3999511&h=7510a2e141429d7bb372";
    pcb = 'returnProductStockInfo'
    function returnProductStockInfo(data){
        var productStockData = JSON.parse(data);    
        (function($) {
            $('.product_stock_status').text(productStockData[0][1]);
            //if (productStockData[0][2]!=""){
              //  $('.product_stock_status').append(": "+productStockData[0][2]);
            //}            
            if(productStockData[0][1] == "On Backorder"){   
                $("head").append("\
                                 <style>\
                                 .back-order-message{\
                                     color:#ff7900;\
                                 }\
                                 .productView-options{\
                                 color: #ff7900;\
                                 font-weight: bold;\
                                 font-size:larger;\
                                 }\
                                 </style>");
                $('.product_stock_status').addClass('back-order-message');
                $('.productView-options').find('p').text(productStockData[0][2]);
                $('#form-action-addToCart').addClass('backorder-button');
            }
            var button = $('#form-action-addToCart');
            button.attr("data-stocklevel", productStockData[0][3]);
            button.attr("data-backorders", productStockData[0][4]);
        }(jQuery));
     
     
        
    }
        
    var product_stock_info= {
        getStockInfo: function() {        
        if (jQuery.isEmptyObject(BCData)){
            //console.debug("BCData is empty. Not on product page.");
        }else{
            var arrProductSkus = [BCData.product_attributes.sku];
            getJSONP(u + '&callback=' + pcb +'&products='+encodeURIComponent(JSON.stringify(arrProductSkus)));
            
            (function($) {               
                $('#{{product.sku}}-inventory').html('<div style = "font-weight: bold;" class=\"product_stock_status\">Fetching Stock Data<span class=\"dots\"><span>.</span><span>.</span><span>.</span></span></div>');
            }(jQuery));            
        }
      }
    }
   product_stock_info.getStockInfo();
    
</script>
<script>
    //Check for disallowed BO

        (function($) {

            $(document).on('click', "#form-action-addToCart", function() {
                var quantEle = $(this).closest(".form").find(".form-input--incrementTotal");
                var quantity = new Number($(quantEle).val());
                var stocklevel = new Number($(this).attr('data-stocklevel'));
                var backorders = $(this).attr('data-backorders');
                 if((quantity  > stocklevel) && (backorders == "F")){
                     var backorderamt = quantity - stocklevel;
                     alert("We don't have enough stock on hand for the quantity you selected. We only have "+stocklevel+" on hand. "+backorderamt+" will be on backorder.");  
                     return true;
                }
            });
            }(jQuery));

</script>


{{/if}}