import PageManager from './page-manager';
import ProductSchema from '../custom/compass-1200-product-schema';
import 'regenerator-runtime/runtime';

export default class Configurator extends PageManager {

  constructor() {
    super();
    this.productSchema = ProductSchema;
    this.token = jsContext.storefrontToken;
    this.productIds = []
    this.skuList = [];

    // Manual binding for event listeners that need to modify class variables
    this.boundTotalQuantityChange = this.handleTotalSetQuantityChange.bind(this);
    this.boundHandleSubmit = this.handleSubmit.bind(this);
  }

  onReady() {
    // Build array of product IDs
    this.unNestIds(this.productSchema);

    // Hydrate the product schema with price, variant ID and options
    this.hydrateProductOptions();

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
                  prices {
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
    productFromSchema.sku = product.node.sku;
    productFromSchema.price = product.node.prices.price.value;
    productFromSchema.variantId = product.node.variants.edges[0].node.entityId;
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
    if (gripLength <= 18.24) {
      return 'extra-small'
    } else if (gripLength > 18.24 && gripLength <= 24.24) {
      return 'small'
    } else if (gripLength > 24.24 && gripLength <= 48.24) {
      return 'medium'
    } else if (gripLength > 48.24 && gripLength <= 72.24) {
      return 'large'
    } else if (gripLength > 72.24 && gripLength <= 92.24) {
      return 'giant'
    } else if (gripLength > 92.24) {
      return 'extra-large'
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
      switch(gripType) {
        case 'arc':
          gripLengthInputNode.value = 24;
          break;
      }
    }
  }

  handleGripEndTypeChange(event) {
    // If end type is round, remove black santoprene option
    const gripEndType = event.target.value;
    const gripFinishSelector = document.getElementById('grip-finish-selector');

    if (gripEndType === 'round') {
      gripFinishSelector.querySelector('option[value="black"]').remove();
    } else {
      const blackOption = document.createElement('option');
      blackOption.value = 'black';
      blackOption.textContent = 'Black Santoprene';
      gripFinishSelector.appendChild(blackOption);
    }
  }

  handleGripMountChange(event) {
    const gripMount = event.target.value;
    if (gripMount === 'b5' || gripMount === 'b6') {
      document.querySelector('#endcap-finish-container select').required = false;
      document.querySelector('#endcap-finish-container').style.display = 'none';
    } else {
      document.querySelector('#endcap-finish-container select').required = true;
      document.querySelector('#endcap-finish-container').style.display = 'block';
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

    let [doorMaterial, doorThickness, gripType, gripEndType, gripLength, gripFinish, gripCC, gripMount, standoffType, standoffFinish, endcapFinish] = Object.values(data);
    let isDoubleMounted = gripMount == 'b5' || gripMount == 'b6';
  
    // Populate Door Specifications
    document.getElementById('results--door-material').textContent = doorMaterial;
    document.getElementById('results--door-thickness').textContent = doorThickness;

    // Populate Grip Specifications
    document.getElementById('results--grip-type').textContent = gripType;
    document.getElementById('results--grip-end-type').textContent = gripEndType;
    document.getElementById('results--grip-length').textContent = gripLength;
    document.getElementById('results--grip-finish').textContent = gripFinish;
    document.getElementById('results--grip-cc').textContent = gripCC;

    // Get Grip Product
    let totalGrips = isDoubleMounted ? 2 : 1;
    console.log(this.productSchema.grips);
    console.log(gripType, gripLength);
    const selectedGrip = this.productSchema.grips[this.getGripSize(gripType, gripLength)][gripEndType][gripFinish];
    this.skuList.push({product: selectedGrip, quantity: totalGrips});
    console.log(this.skuList);

    // Calculate standoffs
    let totalStandoffs = Math.floor(gripCC / 30) + 2;
    if (isDoubleMounted) {
      totalStandoffs *= 2;
    }

    // Populate standoff information
    document.querySelector('#results--total-standoffs').textContent = totalStandoffs;
    document.querySelector('#results--standoff-type').textContent = standoffType;
    document.querySelector('#results--standoff-finish').textContent = standoffFinish;

    // Get Standoff Product
    const selectedStandoff = this.productSchema.standoffs[standoffType][standoffFinish];
    this.skuList.push({product: selectedStandoff, quantity: totalStandoffs});

    // Calculate endcaps
    let totalEndcaps = 0;
    let selectedEndcap = null;

    if (isDoubleMounted) {
      document.querySelector('#results--endcap-finish').textContent = 'n/a';
      document.querySelector('#results--total-endcaps').textContent = 'n/a';
    } else {
      totalEndcaps = totalStandoffs;
      document.querySelector('#results--endcap-finish').textContent = endcapFinish;
      document.querySelector('#results--total-endcaps').textContent = totalEndcaps;

      // Get Endcap Product
      selectedEndcap = this.productSchema.endcaps[endcapFinish];
      this.skuList.push({ product: selectedEndcap, quantity: totalEndcaps });
    }

    // Add Results to DOM
    // Final price
    let price = 0;
    this.skuList.forEach(sku => { price += sku.product.price * sku.quantity });
    document.querySelector('#results--subtotal-price').textContent = `$${this.setPriceToTwoDecimalPlaces(price)}`;
    // Set initial total to subtotal, as default quantity of sets to be purchased is 1
    document.querySelector('#results--total-price').textContent = `$${this.setPriceToTwoDecimalPlaces(price)}`;
    
    // Grip
    const gripNode = document.createElement('li');
    gripNode.textContent = `Grip: ${selectedGrip.sku.replace('Forms-Surfaces-','')} - $${selectedGrip.price} x${totalGrips}`;
    document.querySelector('#results--total-skus').append(gripNode);

    // Standoff
    const standoffNode = document.createElement('li');
    standoffNode.textContent = `Standoff: ${selectedStandoff.sku.replace('Forms-Surfaces-','')} - $${selectedStandoff.price} x${totalStandoffs}`;
    document.querySelector('#results--total-skus').append(standoffNode);

    // Endcaps
    if (selectedEndcap != null) {
      const endcapNode = document.createElement('li');
      endcapNode.textContent = `Endcap: ${selectedEndcap.sku.replace('Forms-Surfaces-','')} - $${selectedEndcap.price} x ${totalEndcaps}`;
      document.querySelector('#results--total-skus').append(endcapNode);
    }

    // Show Results panel and hide placeholder text
    document.querySelector('#results--placeholder').style.display = 'none';
    document.querySelector('#results--populated').style.display = 'block';
  }

  // Map text data for options selectors with display name from data set
  mapTextOptionDataByDisplayName(displayName) {
    const displayNametoResultIdMap = {
      'Door Material': 'door-material-selector',
      'Specify Door Material Thickness (in inches)': 'door-thickness-input',
      'Specify Center to Center Mounting (hole distance) in Inches': 'grip-cc-input',
      'Specify Overall Pull Length (in inches)': 'grip-length-input',
      'Mounting Option': 'grip-mount-selector',
      'Grip End Type': 'grip-end-type-selector',
    }

    if(displayNametoResultIdMap[displayName]) {
      return document.getElementById(displayNametoResultIdMap[displayName]).value;
    } else {
      // Error, display name has been changed or a new one added
      throw new Error(`Display name "${displayName}" not found in map! Are you using the '*Compass 800 Series Grip' option set?`);
    }
  }

  // Handle total set quantity change
  handleTotalSetQuantityChange(event) {
    const totalSetsToOrder = event.target.value;
    const price = document.querySelector('#results--subtotal-price').textContent.replace('$','');
    const totalPrice = price * totalSetsToOrder;
    document.querySelector('#results--total-price').textContent = `$${this.setPriceToTwoDecimalPlaces(totalPrice)}`;
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
    document.getElementById('grip-end-type-selector').value = 'flat';
    document.getElementById('grip-length-input').value = 14.25;
    document.getElementById('grip-finish-selector').value = 'satin-stainless';
    document.getElementById('grip-cc-input').value = 30;
    document.getElementById('grip-mount-selector').value = 'b1';
    document.getElementById('standoff-type-selector').value = 'ring';
    document.getElementById('standoff-finish-selector').value = 'satin-stainless';
    document.getElementById('endcap-finish-selector').value = 'satin-stainless';
  }

  bindListeners() {
    // Bind testing button
    document.getElementById('test-fill-all').addEventListener('click', this.handleTestButton);

    // Bind input listeners
    document.getElementById('grip-type-selector').addEventListener('change', this.handleGripTypeChange);
    document.getElementById('grip-mount-selector').addEventListener('change', this.handleGripMountChange);
    document.getElementById('grip-end-type-selector').addEventListener('change', this.handleGripEndTypeChange);
    document.getElementById('set-qty').addEventListener('change', this.boundTotalQuantityChange);

    // Bind form submission listener
    document.getElementById('configurator-form').addEventListener('submit', this.boundHandleSubmit);

    // Bind add-to-cart button listener
    document.getElementById('add-to-cart-button').addEventListener('click', () => this.handleAddToCartButton());
  }
}
