System.config({
  "baseURL": "/assets/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
    "babel": "npm:babel@4.7.16",
    "babel-runtime": "npm:babel-runtime@4.7.16",
    "bigcommerce/stencil-utils": "github:bigcommerce/stencil-utils@0.0.4",
    "core-js": "npm:core-js@0.8.4",
    "jquery": "github:components/jquery@2.1.3",
    "knockout": "github:knockout/knockout@3.3.0",
    "lodash": "npm:lodash@3.7.0",
    "github:bigcommerce/stencil-utils@0.0.4": {
      "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
      "jquery": "github:components/jquery@2.1.3",
      "lodash": "npm:lodash@3.7.0"
    },bum
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@4.7.16": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.8.4": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:lodash@3.6.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:lodash@3.7.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

