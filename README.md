# Fusionary BigCommerce Stencil Base Repository

## Overview

This repository is based on the [BigCommerce Cornerstone theme](https://github.com/bigcommerce/cornerstone). It has been customized to integrate directly with Figma for easier theming and styling.

## Setup

### 1. Clone the Repo

    bash
    git clone https://github.com/fusionary/cornerstone
    cd cornerstone

### 2. Install Dependencies

    bash
    Copy code
    npm install

### 3. Install Grunt CLI Globally

    bash
    Copy code
    npm install -g grunt-cli

### 4. Compile SCSS

    bash
    Copy code
    npm run-scripts build

### 5. Install Stencil CLI

    bash
    Copy code
    npm install -g @bigcommerce/stencil-cli

### 6. Run Stencil CLI

    bash
    Copy code
    stencil start

### 7. Stencil Config

    Create a config.stencil.json file with the necessary credentials to connect to your BigCommerce store. Refer to the Stencil CLI documentation for more details.

## Figma Integration

### 1. Figma Variables

    Place your Figma-generated variables in assets/scss/styles/figma-variables.scss. This file will be imported into the main theme styles.

    Example:

    scss
    Copy code
    // assets/scss/styles/figma-variables.scss

    $figma-primary-color: #your-primary-color;
    $figma-secondary-color: #your-secondary-color;
    $figma-font-family: 'Your Font Family', sans-serif;

### 2. Using Figma Variables

The Figma variables will automatically be included in the main theme styles. Use the variables in your styles as needed.

scss
Copy code
// Example usage
.button {
    background-color: $figma-primary-color;
    font-family: $figma-font-family;
}
Customization

### 1. Colors and Fonts

Update assets/scss/styles/variables.scss with your custom colors and fonts. These variables can be overridden by the Figma variables.

### 2. Additional Resources

Include any additional resources or files that you need for your project. Place them in the appropriate directories and update the paths as necessary.

JS API
When writing theme JavaScript (JS), there is an API in place for running JS on a per-page basis. The following page types are available:

"pages/account/addresses"
"pages/account/add-address"
"pages/account/add-return"
"pages/account/add-wishlist"
"pages/account/recent-items"
"pages/account/download-item"
"pages/account/edit"
"pages/account/return-saved"
"pages/account/returns"
"pages/account/payment-methods"
"pages/auth/login"
"pages/auth/account-created"
"pages/auth/create-account"
"pages/auth/new-password"
"pages/blog"
"pages/blog-post"
"pages/brand"
"pages/brands"
"pages/cart"
"pages/category"
"pages/compare"
"pages/errors"
"pages/gift-certificate/purchase"
"pages/gift-certificate/balance"
"pages/gift-certificate/redeem"
"global"
"pages/home"
"pages/order-complete"
"pages/page"
"pages/product"
"pages/search"
"pages/sitemap"
"pages/subscribed"
"pages/account/wishlist-details"
"pages/account/wishlists"
These page types correspond to the pages within your theme. Each one maps to an ES6 module that extends the base PageManager abstract class.

javascript
Copy code
export default class Auth extends PageManager {
    constructor() {
        // Set up code goes here; attach to internals and use internals as you would 'this'
    }
}
JS Template Context Injection
Occasionally, you may need to use dynamic data from the template context within your client-side theme application code. Two helpers are provided to achieve this.

The inject helper allows you to compose a JSON object with a subset of the template context to be sent to the browser.

arduino
Copy code
{{inject "stringBasedKey" contextValue}}
To retrieve the parsable JSON object, call {{jsContext}} after all of the {{@inject}} calls.

For example, to set up the product name in your client-side app, you can do the following if you're in the context of a product:

html
Copy code
{{inject "myProductName" product.title}}

<script>
// Note the lack of quotes around the jsContext handlebars helper, it becomes a string automatically.
var jsContext = JSON.parse({{jsContext}}); // jsContext would output "{\"myProductName\": \"Sample Product\"}" which can feed directly into your JavaScript

console.log(jsContext.myProductName); // Will output: Sample Product
</script>

You can compose your JSON object across multiple pages to create a different set of client-side data depending on the currently loaded template context.

The stencil theme makes the jsContext available on both the active page scoped and global PageManager objects as this.context.

Polyfilling via Feature Detection
Cornerstone implements this strategy for polyfilling.

In templates/components/common/polyfill-script.html there is a simple feature detection script which can be extended to detect any recent JS features you intend to use in your theme code.

If any one of the conditions is not met, an additional blocking JS bundle configured in assets/js/polyfills.js will be loaded to polyfill modern JS features before the main bundle executes.

This intentionally prioritizes the experience of the 90%+ of shoppers who are on modern browsers in terms of performance, while maintaining compatibility (at the expense of additional JS download+parse for the polyfills) for users on legacy browsers.

Static Assets
Some static assets in the Stencil theme are handled with Grunt if required. This means you have some dependencies on Grunt and npm. To get started:

First, make sure you have Grunt installed globally on your machine:

Copy code
npm install -g grunt-cli
and run:

Copy code
npm install
Icons
Icons are delivered via a single SVG sprite, which is embedded on the page in templates/layout/base.html. It is generated via a Grunt task grunt svgstore.

The task takes individual SVG files for each icon in assets/icons and bundles them together, to be inlined on the top of the theme, via an AJAX call managed by svg-injector. Each icon can then be called in a similar way to an inline image via:

php
Copy code
<svg><use xlink:href="#icon-svgFileName" /></svg>
The ID of the SVG icon you are calling is based on the filename of the icon you want, with icon- prepended. e.g. xlink:href="#icon-facebook".

Simply add your new icon SVG file to the icons folder, and run grunt svgstore, or just grunt.

Contributing
Fork the Repo

Create a fork of the repo and work on your changes.

Pull Requests

Submit pull requests for any changes you would like to contribute back to the base repository.

(The MIT License)
Copyright (C) 2015-present BigCommerce Inc.
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

This README includes all the necessary sections and instructions for setting up, customizing, and contributing to your BigCommerce Stencil base repository.