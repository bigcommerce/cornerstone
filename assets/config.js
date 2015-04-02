System.config({
  "baseURL": "assets/",
  "transpiler": "babel",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
    "jquery": "github:components/jquery@2.1.3",
    "lodash": "npm:lodash@3.6.0",
    "stencil-utils": "github:stencil-utils@0.0.2",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:stencil-utils@0.0.1": {
      "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
      "jquery": "github:components/jquery@2.1.3",
      "lodash": "npm:lodash@3.6.0"
    },
    "github:stencil-utils@0.0.2": {
      "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
      "jquery": "github:components/jquery@2.1.3",
      "lodash": "npm:lodash@3.6.0"
    },
    "npm:lodash@3.6.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

