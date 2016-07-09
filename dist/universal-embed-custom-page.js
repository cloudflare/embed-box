(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("UniversalEmbedCustomPage", [], factory);
	else if(typeof exports === 'object')
		exports["UniversalEmbedCustomPage"] = factory();
	else
		root["UniversalEmbedCustomPage"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_base_component__ = __webpack_require__(1);

/* harmony export */ __webpack_require__.d(exports, "default", function() { return BasePage; });var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var BasePage = (_temp = _class = function (_BaseComponent) {
  _inherits(BasePage, _BaseComponent);

  function BasePage() {
    _classCallCheck(this, BasePage);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BasePage).apply(this, arguments));
  }

  _createClass(BasePage, [{
    key: "compileTemplate",
    value: function compileTemplate() {
      var _constructor = this.constructor;
      var id = _constructor.id;
      var templateVars = _constructor.templateVars;


      __WEBPACK_IMPORTED_MODULE_0_components_base_component__["a" /* default */].prototype.compileTemplate.call(this, templateVars);

      this.element.setAttribute("data-component", id + "-page");
      this.element.setAttribute("data-column", "");
      this.element.className = "markdown instructions" + this.element.className;

      return this.element;
    }
  }]);

  return BasePage;
}(__WEBPACK_IMPORTED_MODULE_0_components_base_component__["a" /* default */]), _class.extend = function extend(_ref) {
  var _class2, _temp2;

  var _ref$fallback = _ref.fallback;
  var fallback = _ref$fallback === undefined ? false : _ref$fallback;
  var id = _ref.id;
  var label = _ref.label;
  var _ref$template = _ref.template;
  var template = _ref$template === undefined ? "" : _ref$template;
  var _ref$templateVars = _ref.templateVars;
  var templateVars = _ref$templateVars === undefined ? {} : _ref$templateVars;

  return _temp2 = _class2 = function (_BasePage) {
    _inherits(CustomPage, _BasePage);

    function CustomPage() {
      _classCallCheck(this, CustomPage);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(CustomPage).apply(this, arguments));
    }

    return CustomPage;
  }(BasePage), _class2.fallback = fallback, _class2.id = id, _class2.label = label, _class2.template = template, _class2.templateVars = templateVars, _temp2;
}, _temp);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(3);

/* harmony export */ __webpack_require__.d(exports, "a", function() { return BaseComponent; });var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



// Ends with brackets e.g. [data-ref="foo[]"]
var ARRAY_REF_PATTERN = /([a-zA-Z\d]*)(\[?\]?)/;

var BaseComponent = (_temp = _class = function () {
  function BaseComponent() {
    var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseComponent);

    this.element = null;
    this.refs = {};
    this.serializer = document.createElement("div");
    this.store = __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */];
    var stylesheet = this.constructor.stylesheet;
    var iframeDocument = __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */].iframe.document;


    _extends(this, spec);

    if (stylesheet && !this.constructor.style) {
      var style = this.constructor.style = iframeDocument.createElement("style");

      style.innerHTML = stylesheet;
      iframeDocument.head.appendChild(style);
    }
  }

  _createClass(BaseComponent, [{
    key: "autofocus",
    value: function autofocus() {
      var focusElement = this.element.querySelector("[autofocus]");

      if (focusElement) focusElement.focus();
    }

    // NOTE: Calling `updateRefs` multiple times from different tree depths may
    // allow parents to inherit a grandchild.

  }, {
    key: "updateRefs",
    value: function updateRefs() {
      var refs = this.refs;


      Array.from(this.element.querySelectorAll("[data-ref]")).forEach(function (element) {
        var attribute = element.getAttribute("data-ref");

        var _attribute$match = attribute.match(ARRAY_REF_PATTERN);

        var _attribute$match2 = _slicedToArray(_attribute$match, 3);

        var key = _attribute$match2[1];
        var arrayKey = _attribute$match2[2];


        if (arrayKey) {
          // Multiple elements
          if (!Array.isArray(refs[key])) refs[key] = [];

          refs[key].push(element);
        } else {
          // Single element
          refs[key] = element;
        }

        element.removeAttribute("data-ref");
      });
    }
  }, {
    key: "compileTemplate",
    value: function compileTemplate() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var template = this.constructor.template;


      if (typeof template === "function") {
        this.serializer.innerHTML = template(_extends({ config: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */] }, options));
      } else {
        this.serializer.innerHTML = template;
      }

      this.element = this.serializer.firstChild;
      this.updateRefs();

      return this.element;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(sibling, element) {
      element.parentNode.insertBefore(sibling, element);
    }
  }, {
    key: "render",
    value: function render() {
      return this.compileTemplate();
    }

    // TODO: Check if this used after the app is fleshed out.

  }, {
    key: "replaceElement",
    value: function replaceElement(current, next) {
      current.parentNode.insertBefore(next, current);
      current.parentNode.removeChild(current);

      this.updateRefs();
    }
  }]);

  return BaseComponent;
}(), _class.template = null, _class.stylesheet = null, _temp);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

/* eslint-env node, es6 */
var Page = __webpack_require__(0).default;

module.exports = Page;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var iframe = document.createElement("iframe");

/* harmony default export */ exports["a"] = {
  appName: "Drift Chat",
  siteId: "Icc0-PIkXF",

  selectedId: "",
  page: "home",

  iframe: {
    element: iframe,
    get document() {
      return iframe.contentDocument;
    },
    get window() {
      return iframe.contentWindow;
    }
  },

  labels: {
    done: "Done",
    searchPlaceholder: "Select or search the type of website you have...",
    next: "Next",
    title: function title(appName) {
      return "Add " + appName + " to your site";
    }
  }
};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=universal-embed-custom-page.map