import utils from '@bigcommerce/stencil-utils';
const fetch = require('node-fetch');

export default function(context, wrapper) {
    if (context.themeSettings.themevale_color_variant == true) {
        
        const token = context.token,
            product_wrapper = $('#'+wrapper),
            product_class = product_wrapper.find('.card');
        var  list = [];

        function callProductOption() {
            product_class.each((index, element) => {
                var productId = $(element).data("product-id");

                if(!$(element).find('[data-product-attribute="swatch"]').children().length){
                    list.push(productId.toString());
                }
            });

            if(list.length > 0){
                getProductOption(list).then(data => {
                    renderOption(data);

                    $.each(list, (idx, item) => {
                        var arr = {},
                            productId = list[idx];

                        product_wrapper.find('.card-option-'+productId+' .form-option-swatch').each((index, element) => {
                            var txt = $(element).data('product-swatch-value');

                            if (arr[txt]){
                                $(element).remove();
                            } else {
                                arr[txt] = true;
                            }
                        });

                        if(product_wrapper.find('.card-option-'+productId+' .form-option-swatch').length > 4){
                            var countMoreOption  = product_wrapper.find('.card-option-'+productId+' .form-option-swatch').length - 4,
                                productLink = product_wrapper.find('[data-product-id="'+productId+'"]').find('.card-title a').attr('href');

                            product_wrapper.find('.card-option-'+productId+' .form-option-swatch').each((index, element) => {
                                if(index >= 4){
                                    $(element).remove();
                                }
                            });

                            if(product_wrapper.find('.card-option-'+productId+' .form-field .showmore').length < 1){
                                product_wrapper.find('.card-option-'+productId+' .form-field:not(.form-field--size)').append('<a href="'+productLink+'" class="showmore">+'+countMoreOption+'</a>');
                            }
                        }

                        product_wrapper.find('.card-option-size-'+productId+' .form-option-size').each((index, element) => {
                            var txt = $(element).data('product-size-value');
                            if (arr[txt]){
                                $(element).remove();
                            } else {
                                arr[txt] = true;
                            }
                        });

                        var countSizeOption = product_wrapper.find('.card-option-size-'+productId+' .form-option-size').length;
                        if(countSizeOption > 4){
                            var countMoreOptionSize  = countSizeOption - 4,
                                productLinkSize = product_wrapper.find('[data-product-id="'+productId+'"]').find('.card-title a').attr('href');
                            product_wrapper.find('.card-option-size-'+productId+' .form-option-size').each((index, element) => {
                                if(index >= 4){
                                    $(element).remove();
                                }
                            });

                            if(product_wrapper.find('.card-option-size-'+productId+' .form-field .showmore').length < 1){
                                product_wrapper.find('.card-option-size-'+productId+' .form-field:not(.form-field--size)').append('<a href="'+productLinkSize+'" class="showmore">+'+countMoreOptionSize+'</a>');
                            }
                        }

                    });

                });
            }
        }

        function getProductOption(list){
            return fetch('/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    query: `
                        query SeveralProductsByID {
                            site {
                                products(entityIds: [`+list+`], first: 50) {
                                    edges {
                                        node {
                                            entityId
                                            name
                                            defaultImage{
                                                urlOriginal
                                            }
                                            variants(first: 50){
                                                edges{
                                                    node{
                                                        entityId
                                                        defaultImage{
                                                            urlOriginal
                                                        }
                                                        productOptions(first: 50) {
                                                            edges {
                                                                node {
                                                                    entityId
                                                                    displayName
                                                                    isRequired
                                                                    ... on MultipleChoiceOption {
                                                                        displayStyle
                                                                        values {
                                                                            edges {
                                                                                node {
                                                                                    entityId
                                                                                    label
                                                                                    isDefault
                                                                                    ... on SwatchOptionValue {
                                                                                        hexColors
                                                                                        imageUrl(width: 150)
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    `
                }),
            }).then(res => res.json()).then(res => res.data);
        }

        function renderOption(data){
            var aFilter = data.site.products.edges;




            $.each(aFilter, (index, element) => {

                var productId = aFilter[index].node.entityId,
                    productFieldColor = product_wrapper.find('.card-option-'+productId+' .form-field:not(.form-field--size)'),
                    productImage,
                    productFieldSize = product_wrapper.find('.card-option-size-'+productId+' .form-field'),
                    aFilter2 = aFilter[index].node.variants.edges;

                if (aFilter[index].node.defaultImage){
                    productImage = aFilter[index].node.defaultImage.urlOriginal;
                }else{
                    productImage ='https://cdn11.bigcommerce.com/s-ol6dayxf7q/stencil/d960f210-86dd-0138-e71d-0242ac110008/e/a2941d20-8b64-0138-e78d-0242ac110013/img/ProductDefault.gif';
                }
                
                $.each(aFilter2, (idx, el) => {
                    var variantImage,
                        aFilter3 = aFilter2[idx].node.productOptions.edges;

                    if(aFilter2[idx].node.defaultImage){
                        variantImage = aFilter2[idx].node.defaultImage.urlOriginal;
                    }

                    if(variantImage === undefined || variantImage === null){
                        variantImage = productImage;
                    }

                    var aFilter4 = aFilter3.filter(function (item) {
                        return item.node.displayStyle === 'Swatch';
                    });

                    var aFilter6 = aFilter3.filter(function (item) {
                        return item.node.displayName === context.themeSettings.themevale_color_variant_2;
                    });


                    if(aFilter4.length > 0){
                        var aFilter5 = aFilter4[0].node.values.edges;

                        $.each(aFilter5, (idx, element) => {
                            var titleVar = aFilter5[idx].node.label,
                                idVar = aFilter5[idx].node.entityId,
                                lengthColorVar = aFilter5[idx].node.hexColors.length,
                                color1 = aFilter5[idx].node.hexColors[0],
                                color2 = aFilter5[idx].node.hexColors[1],
                                color3 = aFilter5[idx].node.hexColors[2],
                                img = aFilter5[idx].node.imageUrl;

                            if(lengthColorVar == 2){
                                productFieldColor.append('<label class="form-option form-option-swatch two-colors" data-image ="'+variantImage+'" data-product-swatch-value="'+idVar+'" data-title="'+titleVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--color form-option-variant--color2" title="'+titleVar+'"><span class="form-option-variant form-option-variant--color two-colors" style="background-color:'+color1+'; position: relative;left: -2px;top: -2px;"></span><span class="form-option-variant form-option-variant--color '+titleVar+' two-colors" style="background-color:'+color2+'"></span></span></label>');
                            } else if(lengthColorVar === 3){
                                productFieldColor.append('<label class="form-option form-option-swatch three-colors two-colors" data-image ="'+variantImage+'" data-product-swatch-value="'+idVar+'" data-title="'+titleVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--color form-option-variant--color2" title="'+titleVar+'" style="position: relative;top: -2px;left: -2px;right: -2px; background: transparent;border-color: transparent;"><span class="form-option-variant form-option-variant--color three-colors" style="background-color:'+color1+'"></span><span class="form-option-variant form-option-variant--color '+titleVar+' three-colors" style="background-color:'+color2+'"></span><span style="background-color:'+color3+'"></span></span></label>');
                            } else if(Boolean(color1)){
                                productFieldColor.append('<label class="form-option form-option-swatch" data-image ="'+variantImage+'"  data-product-swatch-value="'+idVar+'" data-title="'+titleVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--color '+titleVar+'" title="'+titleVar+'" style="background-color: '+color1+'"></span></label>');
                            } else if(Boolean(img)){
                                productFieldColor.append('<label class="form-option form-option-swatch " data-image ="'+variantImage+'" data-product-swatch-value="'+idVar+'" data-title="'+titleVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--pattern" title="'+titleVar+'" style="background-image: url('+img+')"></span></label>');
                            }
                        });
                    } else{
                        productFieldColor.remove();
                    }

                    if(aFilter6.length > 0){
                        var aFilter7 = aFilter6[0].node.values.edges;

                        $.each(aFilter7, (idx, element) => {
                            var idVar = aFilter7[idx].node.entityId,
                                varValue = aFilter7[idx].node.label;

                            productFieldSize.append('<label class="form-option form-option-size" data-product-size-value="'+idVar+'" data-title="'+varValue+'"><span class="form-option-variant">'+varValue+'</span></label>')
                        });
                    }
                    
                });
            });
        }

        callProductOption();
    }
}
