# Stencil

The building block for Bigcommerce theme developers to get started quickly developing premium quality themes on the Bigcommerce platform.

##JS API
When writing theme javascript there is an API in place for running javascript on a per page basis. To properly write JS for your theme you will have the following
page types available to you.

* account
* auth
* blog
* brand
* brands
* cart
* category
* errors
* gift
* home
* order-complete
* page
* product
* search
* sitemap
* subscribe
* wishlist

And these page types will correspond to the pages within your your theme. Each one of these page types in a specific ES6 class that extends the base `PageManager` abstract class.
```javascript
    export default class Auth extends PageManager {
        constructor() {
            //Set up code goes here
        }
    }
```
Within `PageManager` you will methods that are available from all your classes, but there are three really important methods. The following methods have the signature
`func (callback)` and the callback takes `callback(err)` if error.

#### before(callback)
When this method is implemented in your class the code contained will be executed after the constructor but before the `loaded()` method. This will provide
a shim for your code before your main implementation logic could run.
```javascript
    export default class Auth extends PageManager {
        constructor() {
            //Set up code goes here
        }
        before(callback) {
            //code that should be ran before anyother code in this class
            
            //Callback must be called to move on to the next method
            callback();
        }
    }
```
#### loaded(callback)
This method will be called when the constructor has ran and `before()` has executed. Main implementation code should live in the loaded method.
```javascript
    export default class Auth extends PageManager {
        constructor() {
            //Set up code goes here
        }
        loaded(callback) {
            //Main implementation logic here
            
            //Callback must be called to move on to the next method
            callback();
        }
    }
```

#### after(callback)
This method is for any cleanup that may need to happen and will be executed after `before()` and `loaded()`

```javascript
    export default class Auth extends PageManager {
        constructor() {
            //Set up code goes here
        }
        after(callback) {
            //Main implementation logic here
            
            //Callback must be called to move on to the next method
            callback();
        }
    }
```
