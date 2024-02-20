import PageManager from './page-manager';
import ProductSchema from '../custom/sextant-1200-product-schema';
import MountingSchema from '../custom/compass-mounting-schema';
import 'regenerator-runtime/runtime';

export default class Configurator extends PageManager {

  constructor() {
    super();
    this.productSchema = ProductSchema;
    this.mountingSchema = MountingSchema;
    this.token = jsContext.storefrontToken;
    this.productIds = []
    this.skuList = [];

    // Manual binding for event listeners that need to modify class variables
    this.boundHandleDoorMaterialChange = this.handleDoorMaterialChange.bind(this);
    this.boundTotalQuantityChange = this.handleTotalSetQuantityChange.bind(this);
    this.boundHandleSubmit = this.handleSubmit.bind(this);
  }

  onReady() {
    // Build array of product IDs
    this.unNestIds(this.productSchema);

    // Hydrate the product schema with price, variant ID and options
    this.hydrateProductOptions();

    // Hide support options by default
    document.querySelectorAll('#tenon-tee-finish-container').forEach(container => {
      container.setAttribute('hidden', true);
    });

    // Bind selection event listeners
    this.bindListeners();
  }

  // Helper to set any price to exactly two decimal places
  setPriceToTwoDecimalPlaces(price) {
    return (Math.round(price * 100) / 100).toFixed(2);
  }

  // Recursively search productSchema for product IDs and return an array of them
  unNestIds(obj) {
    for (let key in obj) {
      if (typeof obj[key] == 'object') {
        this.unNestIds(obj[key]);
      }
      else {
       this.productIds.unshift(obj[key]);
      }
    }
  }

  // Get the product data from the GraphQL API
  async getProductData(currentCursor = null) {
    // Set up initial variables
    const variables =  {
      productIds: this.productIds
    }

    if (currentCursor) {
      variables.cursor = currentCursor;
    }

    // For each product in the product schema - get the price, sku, variant ID and options (if applicable)
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        query: `
          query ExtendedProductsById(
            $productIds: [Int!]
            ${currentCursor ? `$cursor: String` : ''}
          ) {
            site {
              products(entityIds: $productIds first: 10 ${currentCursor ? `after: $cursor` : ''}) {
                pageInfo {
                  startCursor
                  endCursor
                  hasNextPage
                }
                edges {
                  cursor
                  node {
                    entityId
                    sku
                    name
                    path
                  prices {
                    retailPrice {
                      ...MoneyFields
                    }
                    price {
                      ...MoneyFields
                    }
                  }
                    variants(first: 25) {
                      edges {
                        node {
                          entityId
                        }
                      }
                    }
                    productOptions(first: 25) {
                      edges {
                        node {
                          entityId
                          displayName
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        
          fragment MoneyFields on Money {
            value
            currencyCode
          }
        `,
        variables
      })
    });
    // Return the product data
    const data = await response.json();
    return data.data;
  }

  // Recursively search productSchema for given productID
  recursiveGetProductById(obj, productId) {
    // if object (ie. the product entity of the schema) at key == productID, 
    // return a reference to the object - this is the product to hydrate

    // base case
    if (obj.id === productId) {
      return obj;
    } else {
      let keys = Object.keys(obj);

      for (let i = 0, len = keys.length; i < len; i++) {
        let k = keys[i]; // use this key for iteration, instead of index "i"

        if (typeof obj[k] == 'object') {
          let result = this.recursiveGetProductById(obj[k], productId);
          if (result) {
            return result;
          }
        }
      }
    }
  }

  hydrateProduct(product) {
    // First, find the product in the product schema
    const productId = product.node.entityId;
    const productFromSchema = this.recursiveGetProductById(this.productSchema, productId);
    productFromSchema.name = product.node.name;
    productFromSchema.sku = product.node.sku;
    productFromSchema.price = product.node.prices.price.value;
    productFromSchema.retailPrice = product.node.prices.retailPrice.value;
    productFromSchema.variantId = product.node.variants.edges[0].node.entityId;
    productFromSchema.url = product.node.path;
    // Add option ids if they exist on the product
    if (product.node.productOptions.edges.length > 0) {
      productFromSchema.optionIds = [];
      product.node.productOptions.edges.forEach(option => {
        productFromSchema.optionIds.push(
          { displayName: option.node.displayName,
            id: option.node.entityId }
        );
      });
    }
  }

  async hydrateProductOptions() {

    // Get initial product data from API
    let data = await this.getProductData();
    // For each product returned, add data to productSchema
    data.site.products.edges.forEach(product => {
      this.hydrateProduct(product);
    });
    let hasNextPage = data.site.products.pageInfo.hasNextPage;

    // If data is paginated, loop through pages until all data is retrieved
    while(hasNextPage) {
      data = await this.getProductData(data.site.products.pageInfo.endCursor);
  
      // For each product returned, add data to productSchema
      data.site.products.edges.forEach(product => {
        this.hydrateProduct(product);
      });
      hasNextPage = data.site.products.pageInfo.hasNextPage;
    }
  }

  getGripSize(gripType, gripLength) {
    if (gripType != 'straight') {
      return gripType;
    }
    if (gripLength <= 18) {
      return 'extraSmall'
    } else if (gripLength > 18 && gripLength <= 24) {
      return 'small'
    } else if (gripLength > 24 && gripLength <= 48) {
      return 'medium'
    } else if (gripLength > 48 && gripLength <= 72) {
      return 'large'
    } else if (gripLength > 72 && gripLength <= 92) {
      return 'giant'
    } else if (gripLength > 92) {
      return 'extraLarge'
    }
  }

  formatSpecificationText(text) {
    // Add extra text not part of value
    if (text.includes('glass')) {
      text = 'tempered glass';
    }
    if (text.includes('stainless')) {
      text = text + ' steel';
    }

    return text.replace('-', ' ');
  }

  buildAndInsertResultTableRow(product, quantity) {

    // Create wrappers
    const wrap = document.createElement('div');
    const titleWrap = document.createElement('div');
    const itemTitle = document.createElement('h3');
    const itemValue = document.createElement('p');
    const qtyWrap = document.createElement('div');
    const qtyTitle = document.createElement('h3');
    const qtyValue = document.createElement('p');
    const priceWrap = document.createElement('div');
    const priceTitle = document.createElement('h3'); 
    const priceValue = document.createElement('p');
    const totalWrap = document.createElement('div');
    const totalTitle = document.createElement('h3');
    const totalValue = document.createElement('p');

    // Add classes
    wrap.classList.add('configurator__results--table-row');
    titleWrap.classList.add('configurator__results--table-row__item', 'configurator__results--table-row__item--title');
    qtyWrap.classList.add('configurator__results--table-row__item');
    priceWrap.classList.add('configurator__results--table-row__item');
    totalWrap.classList.add('configurator__results--table-row__item', 'configurator__results--table--total-wrap');
    totalValue.classList.add('right', 'configurator__results--table--total-value');

    // Add content
    itemTitle.textContent = 'Item';
    itemValue.textContent = product.name;
    qtyTitle.textContent = 'Quantity';
    qtyValue.textContent = quantity;
    priceTitle.textContent = 'Unit Price';
    priceValue.textContent = `$${this.setPriceToTwoDecimalPlaces(product.retailPrice)}`;
    totalTitle.textContent = 'Extended Price';
    totalValue.textContent = `$${this.setPriceToTwoDecimalPlaces(product.retailPrice * quantity)}`;

    // Append nodes
    titleWrap.append(itemTitle);
    titleWrap.append(itemValue);
    qtyWrap.append(qtyTitle);
    qtyWrap.append(qtyValue);
    priceWrap.append(priceTitle);
    priceWrap.append(priceValue);
    totalWrap.append(totalTitle);
    totalWrap.append(totalValue);
    wrap.append(titleWrap);
    wrap.append(qtyWrap);
    wrap.append(priceWrap);
    wrap.append(totalWrap);
    document.querySelector('#results--total-skus').append(wrap);
  }

  getMountingCode(code) {
    let options = document.getElementById('grip-mount-selector').options;
    options = Array.from(options);
    return options.filter(option => option.value == code)[0].textContent;
  }

  handleDoorMaterialChange(event) {
    // Hide mounting options that do not contain the selected door material
    const doorMaterial = event.target.value;
    const mountingOptions = document.querySelectorAll('#grip-mount-selector option');
    mountingOptions.forEach(option => {
      if (!option.value) { return; }
      if (this.mountingSchema[option.value].includes(doorMaterial)) {
        option.removeAttribute('hidden');
      } else {
        option.setAttribute('hidden', true);
      }
    });

    // Remove any option that might be selected
    document.querySelector('#grip-mount-selector').value = '';
  }

  handleGripMountChange(event) {
    // Hide endcap finish selector if grip mount is double mounted on glass
    const gripMount = event.target.value;
    if (gripMount != 'b2') {
      document.querySelector('#endcap-finish-container').style.display = 'none';
    } else {
      document.querySelector('#endcap-finish-container').style.display = 'block';
    }
  }

  handleGripTypeChange(event) {
    const gripType = event.target.value;
    const gripLengthInputNode = document.getElementById('grip-length-input');
    if (gripType === 'straight') {
      gripLengthInputNode.value = '';
      gripLengthInputNode.removeAttribute('readonly');
    } else {
      gripLengthInputNode.setAttribute('readonly', true);
      gripLengthInputNode.value = 24;
    }
  }

  handleOversizedGripChange(length, finish) {
    // return if either length or finish are not set
    if (!length || !finish) return;

    // Determine if grip is oversized
    if ((length > 93 && finish.includes('stainless')) || (length > 93 && finish.includes('black')) || (length > 81 && finish.includes('bronze'))) {
      // Show tenon/tee options
      document.querySelectorAll('#tenon-tee-finish-container').forEach(container => {
        container.removeAttribute('hidden');
      });
    } else {
      // Hide tenon/tee options
      document.querySelectorAll('#tenon-tee-finish-container').forEach(container => {
        container.setAttribute('hidden', true);
      });
    }
  }

  handleSupportTypeChange(event) {
    // Only show support finish selector if type is set to 'tee'
    const supportType = event.target.value;
    const supportFinishContainer = document.querySelectorAll('#support-finish-container');
    if (supportType === 'tee') {
      supportFinishContainer.forEach(container => {
        container.removeAttribute('hidden');
      });
    } else {
      supportFinishContainer.forEach(container => {
        container.setAttribute('hidden', true);
      });
    }
  }

  // Handle Configurator Form Submission
  handleSubmit(event) {
    event.preventDefault();

    // Clear any previous results
    this.skuList = [];
    document.querySelector('#results--total-skus').textContent = '';

    // Serialize form data
    const formData = new FormData(event.target);
    const data = {};
	  for (var key of formData.keys()) {
		  data[key] = formData.get(key);
	  }

    // Get values from form data
    let [doorMaterial, doorThickness, gripType, gripLength, gripFinish, gripMount, finialType, finialFinish] = Object.values(data);
    let supportType = data['support-type'];
    let supportFinish = data['support-finish'];
    let endcapFinish = data['endcap-finish'];
    let isDoubleMounted = gripMount == 'b5' || gripMount == 'b6';
  
    // Populate Door Specifications
    document.getElementById('results--door-material').textContent = this.formatSpecificationText(doorMaterial);
    document.getElementById('results--door-thickness').textContent = doorThickness;

    // Populate Grip Specifications
    document.getElementById('results--grip-type').textContent = this.formatSpecificationText(gripType);
    document.getElementById('results--grip-length').textContent = gripLength;
    document.getElementById('results--grip-finish').textContent = this.formatSpecificationText(gripFinish);
    document.getElementById('results--mounting-code').textContent = this.getMountingCode(gripMount);

    // Get Grip Product
    let totalGrips = isDoubleMounted ? 2 : 1;
    const selectedGrip = this.productSchema.grips[this.getGripSize(gripType, gripLength)][gripFinish];
    this.skuList.push({product: selectedGrip, quantity: totalGrips});

    // Populate finial information
    document.querySelector('#results--finial-type').textContent = this.formatSpecificationText(finialType);
    document.querySelector('#results--finial-finish').textContent = this.formatSpecificationText(finialFinish);

    // Get Finial Product
    const totalFinials = totalGrips * 2; // Two finials required per grip
    const selectedFinial = this.productSchema.finials[finialType][finialFinish];
    this.skuList.push({product: selectedFinial, quantity: totalFinials});

    let selectedSupport;
    if (supportType) {
      // Populate Support Information
      document.querySelector('#results--support-type').textContent = this.formatSpecificationText(supportType);

      // Get Tenon Product
      selectedSupport = this.productSchema[supportType];

      // If Finish selected, populate finish information and get Tee Product
      if (supportFinish) {
        selectedSupport = selectedSupport[supportFinish];
        document.querySelector('#results--support-finish').textContent = this.formatSpecificationText(supportFinish);
      }
      else {
        document.querySelector('#results--support-finish').textContent = 'n/a';
      }
      this.skuList.push({product: selectedSupport, quantity: totalGrips});
    } else {
      // Hide support information
      document.querySelector('#results--support-type').textContent = 'n/a';
      document.querySelector('#results--support-finish').textContent = 'n/a';
    }

    // Calculate endcaps
    let totalEndcaps = 0;
    let selectedEndcap;

    if (gripMount == 'b2' && endcapFinish) {
      totalEndcaps = totalGrips * 2;
      totalEndcaps = supportType && supportType == 'tee' ? totalEndcaps += totalGrips : totalEndcaps; // If Tee support selected, add an adiditonal endcap for every grip
      document.querySelector('#results--endcap-finish').textContent = this.formatSpecificationText(endcapFinish);
      document.querySelector('#results--total-endcaps').textContent = totalEndcaps;

      // Get Endcap Product
      selectedEndcap = this.productSchema.endcaps[endcapFinish];
      this.skuList.push({ product: selectedEndcap, quantity: totalEndcaps });
    } else {
      document.querySelector('#results--endcap-finish').textContent = 'n/a';
      document.querySelector('#results--total-endcaps').textContent = 'n/a';
    }

    // Add Results to DOM
    // Final price
    let price = 0;
    let discountPrice = 0;
    this.skuList.forEach(sku => { 
      discountPrice += sku.product.price * sku.quantity ;
      price += sku.product.retailPrice * sku.quantity;
    });
    document.querySelector('#results--subtotal-price').textContent = `$${this.setPriceToTwoDecimalPlaces(price)}`;
    // Set initial total to subtotal, as default quantity of sets to be purchased is 1
    document.querySelector('#results--total-price').textContent = `$${this.setPriceToTwoDecimalPlaces(price)}`;
    document.querySelector('#results--discount-price').textContent = `$${this.setPriceToTwoDecimalPlaces(discountPrice)}`;

    // Add Item level results to HTML
    this.buildAndInsertResultTableRow(selectedGrip, totalGrips);
    this.buildAndInsertResultTableRow(selectedFinial, totalFinials);
    selectedSupport && this.buildAndInsertResultTableRow(selectedSupport, totalGrips);
    selectedEndcap && this.buildAndInsertResultTableRow(selectedEndcap, totalEndcaps);


    // Show Results panel and hide placeholder text
    document.querySelector('#results--placeholder').style.display = 'none';
    document.querySelector('#results--populated').style.display = 'block';
  }

  // Map text data for options selectors with display name from data set
  mapTextOptionDataByDisplayName(displayName) {
    const displayNametoResultIdMap = {
      'Door Material': 'door-material-selector',
      'Specify Door Material Thickness (in inches)': 'door-thickness-input',
      'Specify Overall Pull Length (in inches)': 'grip-length-input',
      'Mounting Option': 'grip-mount-selector',
    }

    if(displayNametoResultIdMap[displayName]) {
      return document.getElementById(displayNametoResultIdMap[displayName]).value;
    } else {
      // Error, display name has been changed or a new one added
      throw new Error(`Display name "${displayName}" not found in map! Are you using the '*Sextant 1200 Series Grip' option set?`);
    }
  }

  // Handle total set quantity change
  handleTotalSetQuantityChange(event) {
    const totalSetsToOrder = event.target.value;
    const price = document.querySelector('#results--subtotal-price').textContent.replace('$','');
    const discountPrice = document.querySelector('#results--discount-price').textContent.replace('$','');
    const totalPrice = price * totalSetsToOrder;
    const totalDiscountPrice = discountPrice * totalSetsToOrder;
    document.querySelector('#results--total-price').textContent = `$${this.setPriceToTwoDecimalPlaces(totalPrice)}`;
    document.querySelector('#results--discount-price').textContent = `$${this.setPriceToTwoDecimalPlaces(totalDiscountPrice)}`;
  }

  async handleAddToCartButton() {
    // Build Lineitem Array
    const lineItems = [];
    const totalSetsToOrder = document.getElementById('set-qty').value;
    this.skuList.forEach(sku => {
      const lineItem = {
        quantity: sku.quantity * totalSetsToOrder,
        productEntityId: sku.product.id,
        variantEntityId: sku.product.variantId
      }
      if (sku.product.optionIds && sku.product.optionIds.length > 0) {
        lineItem.selectedOptions = {
          textFields: [],
        };
        sku.product.optionIds.forEach(option => {
          lineItem.selectedOptions.textFields.push({
            optionEntityId: option.id,
            text: this.mapTextOptionDataByDisplayName(option.displayName)
          })
        })
      }
      lineItems.push(lineItem);
    })

    // Check if cart exists
    let cartResult = await fetch('/graphql',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        query: `
        query getCart {
          site {
            cart {
              entityId
            }
          }
        }
        `
      })
    });
    let cartData = await cartResult.json();
    
    // If cart does not exist, create a new cart & add items
    if (cartData.data.site.cart == null) {
      let newCartResult = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          query: `
          mutation createCart($createCartInput: CreateCartInput!) {
            cart {
              createCart(input: $createCartInput) {
                cart {
                  entityId
                  lineItems {
                    physicalItems {
                      name
                      quantity
                    }
                  }
                }
              }
            }
          }
          `,
          variables: {
            "createCartInput": {
              "lineItems": lineItems
            }
          }
        })
      });
      let newCartData = await newCartResult.json();

    } else {
      // Otherwise cart exists, add items
      let addToCartResult = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          query: `
          mutation addCartLineItems($addCartLineItemsInput: AddCartLineItemsInput!) {
            cart {
              addCartLineItems(input: $addCartLineItemsInput) {
                cart {
                  entityId
                }
              }
            }
          }
          `,
          variables: {
            "addCartLineItemsInput": {
              "cartEntityId": cartData.data.site.cart.entityId,
              "data": {
                "lineItems": lineItems
              }
            }
          }
        })
      });
    }

    // Finally, redirect to cart page
    window.location.href = '/cart.php';
  }

  handleTestButton(event) {
    document.getElementById('door-material-selector').value = 'glass';
    document.getElementById('door-thickness-input').value = 1;
    document.getElementById('grip-type-selector').value = 'straight';
    document.getElementById('grip-length-input').value = 99;
    document.getElementById('grip-finish-selector').value = 'satin-stainless';
    document.getElementById('grip-mount-selector').value = 'b1';
    document.getElementById('finial-type-selector').value = 'bullet';
    document.getElementById('finial-finish-selector').value = 'satin-stainless';
  }

  bindListeners() {
    // Bind testing button
    document.getElementById('test-fill-all').addEventListener('click', this.handleTestButton);

    // Bind input listeners
    document.getElementById('grip-type-selector').addEventListener('change', this.handleGripTypeChange);
    document.getElementById('door-material-selector').addEventListener('change', this.boundHandleDoorMaterialChange);
    document.getElementById('grip-mount-selector').addEventListener('change', this.handleGripMountChange);
    document.getElementById('grip-finish-selector').addEventListener('change', (event) => this.handleOversizedGripChange(document.getElementById('grip-length-input').value, event.target.value));
    document.getElementById('grip-length-input').addEventListener('change', (event) => this.handleOversizedGripChange(event.target.value, document.getElementById('grip-finish-selector').value));
    document.getElementById('tenon-tee-selector').addEventListener('change', this.handleSupportTypeChange);
    document.getElementById('set-qty').addEventListener('change', this.boundTotalQuantityChange);

    // Bind form submission listener
    document.getElementById('configurator-form').addEventListener('submit', this.boundHandleSubmit);

    // Bind add-to-cart button listener
    document.getElementById('add-to-cart-button').addEventListener('click', () => this.handleAddToCartButton());
  }

}
