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
    "bigcommerce/citadel": "github:bigcommerce/citadel@2.4.0",
    "bigcommerce/stencil-utils": "github:bigcommerce/stencil-utils@0.1.3",
    "browserstate/history.js": "github:browserstate/history.js@1.8.0",
    "caolan/async": "github:caolan/async@0.9.2",
    "casperin/nod": "github:casperin/nod@2.0.4",
    "core-js": "npm:core-js@0.8.4",
    "foundation": "github:zurb/bower-foundation@5.5.2",
    "jquery": "github:components/jquery@2.1.4",
    "knockout": "github:knockout/knockout@3.3.0",
    "lodash": "npm:lodash@3.9.3",
    "url": "github:jspm/nodelibs-url@0.1.0",
    "github:bigcommerce/stencil-utils@0.1.3": {
      "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
      "jquery": "github:components/jquery@2.1.4",
      "lodash": "npm:lodash@3.9.3"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:zurb/bower-foundation@5.5.2": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@4.7.16": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.8.4": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@3.9.3": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

