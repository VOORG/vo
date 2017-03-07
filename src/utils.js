var constants = require('./constants');

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
function noop (){}

// convert to String
function _toString (val){
    return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

// convert to number
function toNumber (val){
    var n = parseFloat(val, 10);
    return (n || n === 0) ? n : val;
}

// extend
function extend (object){
    if(!isObject(object)){
        return object;
    }
    
    var size = arguments.length;
    if(size === 0){
        return blantObject;
    }
    
    if(size === 1){
        return object;
    }
    
    var destination = arguments[0], source, key, i = 0;
    
    for(i = 1; i < size; i++){
        source = arguments[i];
        for(key in source){
            if (isObject(source[key])) {
                extend(destination, source[key]);
            }
            else {
                destination[key] = source[key];
            }
        }
    }
    
    return destination;
}

function hasOwn (object, key){
    return isObject(object) && hasOwnProperty.call(object, key);
}

function isFunction (object){
    return !isNull(object) && !isUndefined(object) && toString.call(object) === '[object Function]';
} 

function isObject (object){
    return !isUndefined(object) && typeof object === 'object';
}

function isPlainObject(object){
    return object && toString.call(object) === '[object Object]';
}

function isEmptyObject (object){
    var name;
    for(name in object){
        return false;
    }
    
    return true;
}

function isRegex (object) {
    return toString.call(object) === '[object Regex]';
}

function isArray (object){
    return toString.call(object) === '[object Array]';
}

function isNumber (object) {
    return !isNull(object) && !isUndefined(object) && toString.call(object) === '[object Number]';
}

function isNaN (object) {
    return isNumber(object) && object !== +object;
}

function isNull (object){
    return object === null;
}

function isUndefined (object){
    return object === void(0);
}

function isBlooean (Object) {
    return !isNull(object) && isUndefined(object) && toString.call(object) === '[object Blooean]';
}

function log (msg){
    if (typeof console !== 'undefined') {
        console.log(msg);
    }
}

function error (msg){
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function warn (msg){
    if (typeof console !== 'undefined') {
        console.warn(msg);
    }
}

/**
 * cache
 */
function cache (key) {
    var cacheMap = {};
    function cacheFn (key, value) {
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
function makeFunction (body) {
    var length = arguments.length;
    if (length){
        var args;
        if (length > 1) {
            args = slice.call(arguments, 0, length - 1);
        }
        var fn;
        if (args) {
            fn = new Function(args, arguments[length-1]);
        } else {
            fn = new Function(arguments[length-1]);
        }  
        return fn;
    }
}

/**
 * $bind
 */
function $bind(fn, ctx) {
    function bindFn () {
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
function defProperty (obj, key, value, propertyDescriptor) {
    if(!propertyDescriptor) {
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
function query (el) {
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

function createElement (tagName){
    return document.createElement(tagName);
}

/** */
var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML',
    xhtml: 'http://www.w3.org/1999/xhtml'
};

function createElementNS (namespace, tagName){
    return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text){
    return document.createTextNode(text)
}

function createComment (text){
    return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode){
    parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child){
    node.removeChild(child);
}

function appendChild (node, child){
    node.appendChild(child);
}

function parentNode (node){
    return node.parentNode
}

function nextSibling (node){
    return node.nextSibling
}

function tagName (node){
    return node.tagName
}

function setTextContent (node, text){
    node.textContent = text;
}

function getAttribute (node, key) {
    return node.getAttribute(key);
}

function setAttribute (node, key, val){
    node.setAttribute(key, val);
}

function addEventListener (vo, node, eventType, listener) {
    node.addEventListener(eventType, vo.methods[listener]);
}

function isVoModelAttr (attrName) {
    return (attrName === constants.MODEL_ATTR);
}

function isVoEventAttrPrefix (attrName) {
    return (-1 !== attrName.indexOf(constants.EVENT_ATTR_PREFIX));
}

function getVoEventType (attrName) {
    return attrName.substring(constants.EVENT_ATTR_PREFIX.length);
}

function setAttributeWarpper (vo, node, attrName, attrValue) {
    var nodeName = node.nodeName;
    switch(nodeName) {
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

function trigger (node, type) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(type, true, true);
    node.dispatchEvent(event);   
}

function handleModelAttr (vo, node, attrName, attrValue) {
    if (isVoModelAttr(attrName)) {
        var listener = $bind(function (attrValue) {
            this[attrValue] = getAttribute(node, "value");
        }, vo);
        addEventListener(vo, node, "input", function () {
            listener(attrValue);
        });
    }
}

function handleEventListener (vo, node, attrName, attrValue) {
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