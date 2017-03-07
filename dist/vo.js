/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(1);

var blankObject = {};
var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var splice = Array.prototype.splice;
var push = Array.prototype.push;
var pop = Array.prototype.pop;

/**
 * util API
 */
function noop() {}

// convert to String
function _toString(val) {
    return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

// convert to number
function toNumber(val) {
    var n = parseFloat(val, 10);
    return (n || n === 0) ? n : val;
}

// extend
function extend(object) {
    if (!isObject(object)) {
        return object;
    }

    var size = arguments.length;
    if (size === 0) {
        return blantObject;
    }

    if (size === 1) {
        return object;
    }

    var destination = arguments[0],
        source, key, i = 0;

    for (i = 1; i < size; i++) {
        source = arguments[i];
        for (key in source) {
            if (isObject(source[key])) {
                extend(destination, source[key]);
            } else {
                destination[key] = source[key];
            }
        }
    }

    return destination;
}

function hasOwn(object, key) {
    return isObject(object) && hasOwnProperty.call(object, key);
}

function isFunction(object) {
    return !isNull(object) && !isUndefined(object) && toString.call(object) === '[object Function]';
}

function isObject(object) {
    return !isUndefined(object) && typeof object === 'object';
}

function isPlainObject(object) {
    return object && toString.call(object) === '[object Object]';
}

function isEmptyObject(object) {
    var name;
    for (name in object) {
        return false;
    }

    return true;
}

function isRegex(object) {
    return toString.call(object) === '[object Regex]';
}

function isArray(object) {
    return toString.call(object) === '[object Array]';
}

function isNumber(object) {
    return !isNull(object) && !isUndefined(object) && toString.call(object) === '[object Number]';
}

function isNaN(object) {
    return isNumber(object) && object !== +object;
}

function isNull(object) {
    return object === null;
}

function isUndefined(object) {
    return object === void(0);
}

function isBlooean(Object) {
    return !isNull(object) && isUndefined(object) && toString.call(object) === '[object Blooean]';
}

function log(msg) {
    if (typeof console !== 'undefined') {
        console.log(msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function warn(msg) {
    if (typeof console !== 'undefined') {
        console.warn(msg);
    }
}

/**
 * cache
 */
function cache(key) {
    var cacheMap = {};

    function cacheFn(key, value) {
        if (value) {
            cacheMap[key] = value;
        } else {
            return cacheMap[key];
        }
    }
    return cacheFn;
}

/**
 * make function
 */
function makeFunction(body) {
    var length = arguments.length;
    if (length) {
        var args;
        if (length > 1) {
            args = slice.call(arguments, 0, length - 1);
        }
        var fn;
        if (args) {
            fn = new Function(args, arguments[length - 1]);
        } else {
            fn = new Function(arguments[length - 1]);
        }
        return fn;
    }
}

/**
 * $bind
 */
function $bind(fn, ctx) {
    function bindFn() {
        if (1 < arguments.length) {
            return fn.apply(ctx, arguments);
        } else {
            return arguments.length ? fn.call(ctx, arguments[0]) : fn.call(ctx);
        }
    }
    return bindFn;
}

/**
 * defProperty
 */
function defProperty(obj, key, value, propertyDescriptor) {
    if (!propertyDescriptor) {
        propertyDescriptor = {};
    }
    Object.defineProperty(obj, key, {
        enumerable: propertyDescriptor.enumerable || true,
        configurable: propertyDescriptor.configurable || true,
        value: propertyDescriptor.value || value
    });
}

/**
 * DOM method
 */
function query(el) {
    if (typeof el === 'string') {
        var selector = el;
        el = document.querySelector(el);
        if (!el) {
            warn('Cannot find element: ' + selector);
            return document.createElement('div');
        }
    }
    return el;
}

function createElement(tagName) {
    return document.createElement(tagName);
}

/** */
var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML',
    xhtml: 'http://www.w3.org/1999/xhtml'
};

function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode(text) {
    return document.createTextNode(text)
}

function createComment(text) {
    return document.createComment(text)
}

function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
    node.removeChild(child);
}

function appendChild(node, child) {
    node.appendChild(child);
}

function parentNode(node) {
    return node.parentNode
}

function nextSibling(node) {
    return node.nextSibling
}

function tagName(node) {
    return node.tagName
}

function setTextContent(node, text) {
    node.textContent = text;
}

function getAttribute(node, key) {
    return node.getAttribute(key);
}

function setAttribute(node, key, val) {
    node.setAttribute(key, val);
}

function addEventListener(vo, node, eventType, listener) {
    node.addEventListener(eventType, vo.methods[listener]);
}

function addEventListener$2(vo, node, eventType, listener) {
    node.addEventListener(eventType, listener);
}

function isVoModelAttr(attrName) {
    return (attrName === constants.MODEL_ATTR);
}

function isVoEventAttrPrefix(attrName) {
    return (-1 !== attrName.indexOf(constants.EVENT_ATTR_PREFIX));
}

function getVoEventType(attrName) {
    return attrName.substring(constants.EVENT_ATTR_PREFIX.length);
}

function setAttributeWarpper(vo, node, attrName, attrValue) {
    var nodeName = node.nodeName;
    switch (nodeName) {
        case "INPUT":
            handleModelAttr(vo, node, attrName, attrValue);
        case "BUTTON":
            break;
        default:
            break;
    }
    handleEventListener(vo, node, attrName, attrValue);
    setAttribute(node, attrName, attrValue);
}

function trigger(node, type) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(type, true, true);
    node.dispatchEvent(event);
}

function handleModelAttr(vo, node, attrName, attrValue) {
    if (isVoModelAttr(attrName)) {
        var listener = $bind(function(attrValue) {
            this[attrValue] = node.value;
        }, vo);
        addEventListener$2(vo, node, "input", function() {
            listener(attrValue);
        });
    }
}

function handleEventListener(vo, node, attrName, attrValue) {
    if (isVoEventAttrPrefix(attrName)) {
        var eventType = getVoEventType(attrName);
        addEventListener(vo, node, eventType, attrValue)
    }
}

function getOuterHTML(node) {
    return node.outerHTML;
}

module.exports = {
    blankObject: blankObject,
    toString: toString,
    hasOwnProperty: hasOwnProperty,
    concat: concat,
    slice: slice,
    splice: splice,
    push: push,
    pop: pop,
    noop: noop,
    _toString: _toString,
    toNumber: toNumber,
    extend: extend,
    hasOwn: hasOwn,
    isFunction: isFunction,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isEmptyObject: isEmptyObject,
    isRegex: isRegex,
    isArray: isArray,
    isNumber: isNumber,
    isNaN: isNaN,
    isNull: isNull,
    isUndefined: isUndefined,
    isBlooean: isBlooean,
    log: log,
    warn: warn,
    error: error,
    cache: cache,
    makeFunction: makeFunction,
    $bind: $bind,
    defProperty: defProperty,
    query: query,
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setAttribute: setAttribute,
    setAttributeWarpper: setAttributeWarpper,
    trigger: trigger,
    getOuterHTML: getOuterHTML
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var EMPTY_STRING = "";
var ONE_CHAR_STRING = " ";
var LEFT_DELIMITER = '{{';
var RIGHT_DELIMITER = '}}';
var ATTR_PREFIX = "vo-";
var MODEL_ATTR = ATTR_PREFIX + "model";
var EVENT_ATTR_PREFIX = ATTR_PREFIX + "on:";

module.exports = {
    EMPTY_STRING: EMPTY_STRING,
    ONE_CHAR_STRING: ONE_CHAR_STRING,
    LEFT_DELIMITER: LEFT_DELIMITER,
    RIGHT_DELIMITER: RIGHT_DELIMITER,
    ATTR_PREFIX: ATTR_PREFIX,
    EVENT_ATTR_PREFIX: EVENT_ATTR_PREFIX,
    MODEL_ATTR: MODEL_ATTR
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var constants = __webpack_require__(1);

var preWhiteSpaceCharRE = /^(\s*).*/gm;
var postWhiteSpaceCharRE = /.*\s*$/gm;

function advance (last, advanceSteps) {
	last = last.substring(advanceSteps);
	return last;
}

function parse (vo, nodeName, last) {
	var stack = [];
	// parseWhiteSpaceChar(vo, last, preWhiteSpaceCharRE, stack);
	parseChar(vo, nodeName, last, stack);
    var templateFnBody = makeTemplateFnBody(stack);
    var templateFn = utils.makeFunction("vo", templateFnBody);
	return templateFn;
}

function makeTemplateFnBody (stack) {
    var templateFnBody = "\"\"";
    if (stack && stack.length) {
        templateFnBody = stack.join(' + ').trim();
    }
    templateFnBody = "with(vo) { return " + templateFnBody + ";}";
    return templateFnBody;
}

function parseWhiteSpaceChar (vo, last, re, stack) {
	var result = re.exec(last)
	if (result && result[1]) {
		var whiteSpaceChars = result[1];
		stack.push("_ts(\""+ whiteSpaceChars.trim() +"\")");
		last = advance(last, whiteSpaceChars.length);
	}
}

function parseChar (vo, nodeName, last, stack) {
	var ldIndex = rdIndex = -1;
	var leftDelimiter = constants.LEFT_DELIMITER;
	var rightDelimiter = constants.RIGHT_DELIMITER;
	while (last) {
	    ldIndex = last.indexOf(leftDelimiter);
		rdIndex = last.indexOf(rightDelimiter);
		if (ldIndex !== -1 && rdIndex !== -1) {
            // var token = last.substring(0, ldIndex).trim();
            var token = last.substring(0, ldIndex).replace(/\r/g, constants.ONE_CHAR_STRING).replace(/\n/g, constants.ONE_CHAR_STRING).replace(/\t/g, constants.ONE_CHAR_STRING);
			stack.push("_ts(\""+ token +"\")");
			last = advance(last, ldIndex);
            ldIndex = last.indexOf(leftDelimiter);
            rdIndex = last.indexOf(rightDelimiter);
			var responseVar = last.substring(leftDelimiter.length, rdIndex).trim();
            if (/\s+/.test(responseVar)) {
                throw new Error("\n[vo error] failed to compile template: \n" 
                    + vo.$cache(vo.elem) + "\n- invalid expression: \n" 
                    + last.substring(0, rdIndex + rightDelimiter.length));
            }
            if (!utils.hasOwn(vo, responseVar)) {
                throw new Error("\n[vo error] Property or method `" 
                    + responseVar + "` is not defined on the instance but referenced during render. \n" 
                    + "Make sure to declare reactive data properties in the data option.");
            }
			stack.push("_ts("+ responseVar +")");
            last = advance(last, rdIndex + rightDelimiter.length);
		} else {
            // last = last.trim();
			last = last.replace(/\r/g, constants.ONE_CHAR_STRING).replace(/\n/g, constants.ONE_CHAR_STRING).replace(/\t/g, constants.ONE_CHAR_STRING);
			stack.push("_ts(\""+ last +"\")");
            last = advance(last, last.length);
		}
		ldIndex = rdIndex = -1;
	}
}

function compile$1 (vo) {
	compile$2(vo, vo.$vRootNode);
}

function compile$2 (vo, node) {
	var nodeType = node.nodeType;
	if (nodeType === 1 || nodeType === 2 || nodeType === 3) {
		refresh(vo, node);
		var childNodes = node.childNodes;
		for (var i = 0, lI = childNodes.length; i < lI; i++) {
			compile$2(vo, childNodes[i]);
		}
	}
}

function refresh (vo, node) {
	var atrributeMap = node.atrributeMap;
	if (atrributeMap){
		for (var i = 0, l = atrributeMap.length; i < l; i ++) {
			var attr = atrributeMap[i];
			attr.attrValue = attr.templateFn(vo);
		}
	} else {
		node.data = node.templateFn(vo);
	}
}

module.exports = {
    parse: parse,
	compile$1: compile$1
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * created by mawei 2017.02.05
 */


var uuid = 1;

var utils = __webpack_require__(0);
var cache = utils.cache();
var browser = __webpack_require__(5);
var op = __webpack_require__(6);
var vdom = __webpack_require__(8);
var render = __webpack_require__(7);

function registResponse (obj, key, value, otherConfig) {
	var ownPropertyDescriptor = Object.getOwnPropertyDescriptor(obj, key);
	var getter = ownPropertyDescriptor && ownPropertyDescriptor.get;
	var setter = ownPropertyDescriptor && ownPropertyDescriptor.set;
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			var val = getter ? getter.call(obj) : value;
			return val;
		},
		set: function (newValue) {
			var nowValue = getter ? getter.call(obj) : value;
			if (newValue === nowValue || (newValue !== newValue && nowValue !== nowValue)) {
				return;
			}
			if (setter) {
				setter.call(obj, newValue);
			} else {
				value = newValue;
			}
			// obj.$observer.publish(obj, otherConfig.$sub.uuid);
			// obj.$observer.publish(obj);
			render.renderDOM$1(obj);
		}
	});
}

/**
 * Vo constructor
 */
function Vo(options){
	if (!(this instanceof Vo)) {
		utils.warn('please use `new` keyword to create Vo object.');
		return new Vo(options);
	}
	this.init$1(options);	
}

initMixin$2();

function initMinin$1 (vo) {
	vo.$cache = cache;
	vdom.beforeCreateVDOM(vo);
	vdom.createVDOM$1(vo);
	vdom.afterCreateVDOM(vo);
	render.renderDOM$1(vo);
}

/**
 * initialize method
 */
function init$1(options){
	if (utils.isNull(options) || 
			utils.isUndefined(options) ||
			!utils.isObject(options) || 
			utils.isEmptyObject(options)
	) {
		return;
	}
	if (!utils.hasOwn(options, 'elem') || !options.elem) {
		utils.warn('Vo must has elem.');
		return;
	}
	var vo = this;
	mount$1(vo, options);
	initMinin$1(vo);
}

/**
 * mount
 */
function mount$1(vo, options){
	mount$2(vo, options);
}

function mount$2(vo, options){
	mount$data(vo, options.data);
	mount$method(vo, options.methods);
	utils.extend(vo, options);
}

function mount$data (vo, data) {
	utils.extend(vo, data);
	vo.$observer = new op.Observer(vo);
	if (data && utils.isObject(data)) {
		var key;
		for (key in data) {
			var sub = new op.Subject(vo, utils._toString(key), new op.Observe(vo));
			vo.$observer.addSub(sub);
			registResponse(vo, key, data[key], {
				$sub: sub
			});
		}
	}
	data = null;
}

function mount$method (vo, methods) {
	utils.defProperty(vo, 'methods', {});
	var key;	
	for (key in methods) {
		utils.defProperty(vo.methods, key, utils.$bind(methods[key], vo));
	}
	methods = null;
}

/**
 * initMinin$2
 */
function initMixin$2(){
	/**
	 * extend inner method
	 */
	utils.extend(Vo.prototype, {
		version: '1.0.0',
		init$1: init$1,
		_ts: utils._toString
	});
	Vo.prototype.utils = utils;
}

module.exports = Vo;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var inBrowser =  typeof window !== 'undefined';

module.exports = {
    inBrowser: inBrowser
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var uitls = __webpack_require__(0);
var uuid = 1;

function Subject (vo, subName, observe) {
    if (!(this instanceof Subject)) {
        return new Subject(subName, observe);
    }
    this.uuid = uuid++;
    this.vo = vo;
    this.subName = subName;
    this.observe = observe;
}

Subject.prototype.registObserve = function (observe) {
    if (!(observe instanceof Observe)) {
        return;
    }
    this.observe = observe;
}

Subject.prototype.removeObserve = function () {
    this.observe = null;
}

Subject.prototype.notify = function (vo) {
    this.observe.update(vo, this.subName);
}

function Observe (vo) {
    if (!(this instanceof Observe)) {
        return new Observe(vo);
    }
    this.uuid = uuid++;
    this.vo = vo;
}

Observe.prototype.update = function (vo, subName) {
    var vRootNode = vo.$vRootNode;
    vo.compile$1(vo, vRootNode, subName);
}

function Observer (vo, sub) {
    if (!(this instanceof Observer)) {
        return new Observer(vo, sub);
    }
    this.uuid = uuid++;
    this.vo = vo;
    var subs = [];
    if (sub) {
        subs.push(sub);
    }
    this.subs = subs;
}

Observer.prototype.addSub = function (sub) {
    if (!(sub instanceof Subject)) {
        return;
    }
    this.subs.push(sub);
}

Observer.prototype.removeSub = function (uuid) {
    if (uuid) {
        var subs = this.subs;
        for (var i = 0, l = subs.length; i < l; i++) {
            if (uuid === subs[i]['uuid']) {
                subs.splice(i, 1);
                break;
            }
        }
    } else {
        this.subs = [];
    }
}

Observer.prototype.publish = function (vo, uuid) {
    if (uuid) {
        var subs = utils.slice.call(this.subs);
        for (var i = 0, l = subs.length; i < l; i++) {
            if (uuid === subs[i]['uuid']) {
                var sub = subs[i];
                sub.notify(vo);
                break;
            }
        }
    } else {
        var subs = uitls.slice.call(this.subs);
        var sub;
        for (var i = 0, l = subs.length; i < l; i++) {
                var sub = subs[i];
                sub.notify(vo);
        }
    }
}

module.exports = {
    Observe: Observe,
    Subject: Subject,
    Observer: Observer
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var compiler = __webpack_require__(2);
var utils = __webpack_require__(0);

function beforeRenderDOM (vo) {
	// vo.$observer.publish(vo);
	compiler.compile$1(vo);
}

function renderDOM$1 (vo) {
	beforeRenderDOM(vo);
	var dom = renderDOM$2(vo);
	renderDOM$5(vo, dom);
	afterRenderDOM(vo);
}


function renderDOM$2 (vo) {
	var rootNode = vo.$vRootNode;
	var dom = renderDOM$3(vo, void (0), rootNode);
	renderDOM$4(vo, dom, rootNode);
	return dom;
}

function renderDOM$3 (vo, parentNode, node) {
	var nodeType = node.nodeType;
	var targetNode;
	switch (nodeType) {
		case 1:
			targetNode = utils.createElement(node.nodeName);
			var attributeMap = node.atrributeMap;
			for (var i = 0, l = attributeMap.length; i < l; i++) {
                utils.setAttributeWarpper(vo, targetNode, attributeMap[i]['attrName'], attributeMap[i]['attrValue']);
			}
			if (parentNode) {
				utils.appendChild(parentNode, targetNode);
			}
			break;
		case 3:
			var targetTextNode = utils.createTextNode(node.data);
			utils.appendChild(parentNode, targetTextNode);
			targetNode = parentNode;
			break;
		default:
			targetNode = parentNode;
			break;
	}
	return targetNode;
}

function renderDOM$4 (vo, parentNode, node) {
	var childNodes = node.childNodes;
	var targetNode;
	for (var i = 0, l = childNodes.length; i < l; i++) {
		targetNode = renderDOM$3(vo, parentNode, childNodes[i]);
		renderDOM$4(vo, targetNode, childNodes[i]);
	}
}

function renderDOM$5 (vo, dom) {
	var $elem  = utils.query(vo.elem);
	var pn = $elem.parentNode;
	if (pn) {
		utils.insertBefore(pn, dom, $elem);
		utils.removeChild(pn, $elem);
	}
}

function afterRenderDOM (vo) {

}

module.exports = {
    renderDOM$1: renderDOM$1
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var compiler = __webpack_require__(2);
var constants = __webpack_require__(1);

function convertAttrToList (vo, nodeName, attributes) {
    var attrList;
    if (attributes) {
        attrList = [];
        var currentAttr;
        for (var i = 0, l = attributes.length; i < l; i++) {
            currentAttr = attributes[i];
            handleNodeAttr(vo, nodeName, currentAttr, attrList);
        }
    }
    return attrList;
}

function handleNodeAttr (vo, nodeName, currentAttr, attrList) {
    var attrName = currentAttr.nodeName;
    switch (nodeName) {
        case "INPUT":
            handleSpecialAttr(vo, nodeName, currentAttr, attrList);
            break;
        case "BUTTON":
            break;
        default:
            break;
    }
    var templateFn = compiler.parse(vo, nodeName, currentAttr.nodeValue);
    attrList.push({
        attrName: attrName,
        attrValue: currentAttr.nodeValue,
        nodeType: currentAttr.nodeType,
        templateFn: templateFn
    });
}

function handleSpecialAttr (vo, nodeName, currentAttr, attrList) {
    var attrName = currentAttr.nodeName;
    if (attrName === "vo-model") {
        var attrName = "value";
        var attrValue = constants.LEFT_DELIMITER + 
                        currentAttr.nodeValue + 
                        constants.RIGHT_DELIMITER;
        var templateFn = compiler.parse(vo, nodeName, attrValue);
        attrList.push({
            attrName: attrName,
            attrValue: attrValue,
            nodeType: currentAttr.nodeType,
            templateFn: templateFn
        });
    }
}

function beforeCreateVDOM (vo) {
    vo.$elem = utils.query(vo.elem);
    if (!vo.$cache(vo.elem)) {
        var template = utils.getOuterHTML(vo.$elem);
        vo.$cache(vo.elem, template);
    }
}

function VNode (vo, nodeName, atrributeMap, data, parentNode, childNodes, nodeType) {
    if (!(this instanceof VNode)) {
        return new VNode(vo, nodeName, atrributeMap, data, parentNode, childNodes, nodeType);
    }
    this.vo = vo;
    this.nodeName = nodeName;
    this.atrributeMap = convertAttrToList(vo, nodeName, atrributeMap);
    this.templateFn = compiler.parse(vo, nodeName, data);
    this.data = data;
    this.parentNode = parentNode;
    this.childNodes = childNodes;
    this.nodeType = nodeType;
}

function createVDOM$1 (vo) {
    vo.$vRootNode = new VNode(vo, vo.$elem.nodeName, vo.$elem.attributes, vo.$elem.data, null, [], vo.$elem.nodeType);
    genVDOMTree(vo, vo.$vRootNode, vo.$elem.childNodes);
}

function genVDOMTree (vo, rootNode, childNodes) {
    var parentNode = rootNode;
    for (var i = 0, l = childNodes.length; i < l; i++) {
        var cn = childNodes[i];
        if (cn.nodeType === 1 || cn.nodeType === 3) {
            var atrributeMap = cn.attributes;
            var vNode = new VNode(vo, cn.nodeName, atrributeMap, cn.data, parentNode, [], cn.nodeType);
            parentNode.childNodes.push(vNode);
            genVDOMTree(vo, vNode, cn.childNodes);
        }
    }
}

function afterCreateVDOM (vo) {
    utils.log(vo.$vRootNode);
}

module.exports = {
    beforeCreateVDOM: beforeCreateVDOM,
    createVDOM$1: createVDOM$1,
    afterCreateVDOM: afterCreateVDOM,
    VNode: VNode,
    genVDOMTree: genVDOMTree
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function () {
    global.Vo = __webpack_require__(4);
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ })
/******/ ]);