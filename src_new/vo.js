/*
 * created by mawei 2017.02.05
 */
(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
    typeof define === "function" && define.amd ? define(factory) : (global.Vo = factory());
}(this, function () {
    "use strict";
    var uuid = 1;

    var constants = (function () {
        var EMPTY_STRING = "";
        var ONE_CHAR_STRING = " ";
        var LEFT_DELIMITER = "{{";
        var RIGHT_DELIMITER = "}}";
        var ATTR_PREFIX = "vo-";
        var MODEL_ATTR = ATTR_PREFIX + "model";
        var EVENT_ATTR_PREFIX = ATTR_PREFIX + "on:";

        return {
            EMPTY_STRING: EMPTY_STRING,
            ONE_CHAR_STRING: ONE_CHAR_STRING,
            LEFT_DELIMITER: LEFT_DELIMITER,
            RIGHT_DELIMITER: RIGHT_DELIMITER,
            ATTR_PREFIX: ATTR_PREFIX,
            EVENT_ATTR_PREFIX: EVENT_ATTR_PREFIX,
            MODEL_ATTR: MODEL_ATTR
        };
    })();

    var utils = (function () {
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
        function noop () {}

        // convert to String
        function _toString (val) {
            return val == null ? "" : typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
        }

        // convert to number
        function toNumber (val) {
            var n = parseFloat(val, 10);
            return (n || n === 0) ? n : val;
        }

        // extend
        function extend (object) {
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

        function hasOwn (object, key) {
            return isObject(object) && hasOwnProperty.call(object, key);
        }

        function isFunction (object) {
            return !isNull(object) && !isUndefined(object) && toString.call(object) === "[object Function]";
        }

        function isObject (object) {
            return !isUndefined(object) && typeof object === "object";
        }

        function isPlainObject (object) {
            return object && toString.call(object) === "[object Object]";
        }

        function isEmptyObject (object) {
            var name;
            for (name in object) {
                return false;
            }

            return true;
        }

        function isRegex (object) {
            return toString.call(object) === "[object Regex]";
        }

        function isArray (object) {
            return toString.call(object) === "[object Array]";
        }

        function isNumber (object) {
            return !isNull(object) && !isUndefined(object) && toString.call(object) === "[object Number]";
        }

        function isNaN (object) {
            return isNumber(object) && object !== +object;
        }

        function isNull (object) {
            return object === null;
        }

        function isUndefined (object) {
            return object === void(0);
        }

        function isBlooean (Object) {
            return !isNull(object) && isUndefined(object) && toString.call(object) === "[object Blooean]";
        }

        function log (msg) {
            if (typeof console !== "undefined") {
                console.log(msg);
            }
        }

        function error (msg) {
            if (typeof console !== "undefined") {
                console.error(msg);
            }
        }

        function warn (msg) {
            if (typeof console !== "undefined") {
                console.warn(msg);
            }
        }

        /**
         * cache
         */
        function cache (key) {
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
        function makeFunction (body) {
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
        function $bind (fn, ctx) {
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
        function defProperty (obj, key, value, propertyDescriptor) {
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
        function query (el) {
            if (typeof el === "string") {
                var selector = el;
                el = document.querySelector(el);
                if (!el) {
                    warn("Cannot find element: " + selector);
                    return document.createElement("div");
                }
            }
            return el;
        }

        function createElement (tagName) {
            return document.createElement(tagName);
        }

        /** */
        var namespaceMap = {
            svg: "http://www.w3.org/2000/svg",
            math: "http://www.w3.org/1998/Math/MathML",
            xhtml: "http://www.w3.org/1999/xhtml"
        };

        function createElementNS (namespace, tagName) {
            return document.createElementNS(namespaceMap[namespace], tagName)
        }

        function createTextNode (text) {
            return document.createTextNode(text)
        }

        function createComment (text) {
            return document.createComment(text)
        }

        function insertBefore (parentNode, newNode, referenceNode) {
            parentNode.insertBefore(newNode, referenceNode);
        }

        function removeChild (node, child) {
            node.removeChild(child);
        }

        function appendChild (node, child) {
            node.appendChild(child);
        }

        function parentNode (node) {
            return node.parentNode
        }

        function nextSibling (node) {
            return node.nextSibling
        }

        function tagName (node) {
            return node.tagName
        }

        function setTextContent (node, text) {
            node.textContent = text;
        }

        function getAttribute (node, key) {
            return node.getAttribute(key);
        }

        function setAttribute (node, key, val) {
            node.setAttribute (key, val);
        }

        function removeAttribute (node, key) {
            node.removeAttribute(key);
        }

        function getOuterHTML (node) {
            return node.outerHTML;
        }

        function isVoDirective (attrName) {
            return (-1 !== attrName.indexOf(constants.ATTR_PREFIX))
        }

        function isVoModelDirective (attrName) {
            return (attrName === constants.MODEL_ATTR);
        }

        function isVoEventDirectivePrefix (attrName) {
            return (-1 !== attrName.indexOf(constants.EVENT_ATTR_PREFIX));
        }

        return {
            isVoDirective: isVoDirective,
            isVoModelDirective: isVoModelDirective,
            isVoEventDirectivePrefix: isVoEventDirectivePrefix,
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
            removeAttribute: removeAttribute,
            getOuterHTML: getOuterHTML
        };
    })();

    var cache = utils.cache();
    var browser = (function () {
        var inBrowser = typeof window !== "undefined";
        return {
            inBrowser: inBrowser
        };
    })();

    var observer = (function () {
        var uuid = 1;

        function Subject (vo, subName, monitorFn) {
            if (!(this instanceof Subject)) {
                return new Subject(subName, monitor);
            }
            this.uuid = uuid++;
            this.vo = vo;
            this.subName = subName;
            this.monitor = new Monitor(vo, monitorFn);
        }

        Subject.prototype.registMonitor = function (monitor) {
            if (!(monitor instanceof Monitor)) {
                return;
            }
            this.monitor = monitor;
        }

        Subject.prototype.removeMonitor = function () {
            this.monitor = null;
        }

        Subject.prototype.notify = function (vo) {
            this.monitor.update(vo, this.subName);
        }

        function Monitor (vo, monitorFn) {
            if (!(this instanceof Monitor)) {
                return new Monitor(vo, monitorFn);
            }
            this.uuid = uuid++;
            this.vo = vo;
            this.monitorFn = monitorFn;
        }

        Monitor.prototype.update = function (vo, subName) {
            if (utils.isFunction(this.monitorFn)) {
                this.monitorFn.call(vo, vo.$responseGetterProxy(subName));
            }
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
                    if (uuid === subs[i]["uuid"]) {
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
                    if (uuid === subs[i]["uuid"]) {
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

        return {
            Monitor: Monitor,
            Subject: Subject,
            Observer: Observer
        };
    })();

    var vdom = (function () {
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
            var attrObject = {
                attrName: attrName,
                attrValue: currentAttr.nodeValue,
                nodeName: nodeName,
                nodeType: currentAttr.nodeType,
                operation: 0
            };
            handleSpecialAttr(vo, nodeName, currentAttr, attrObject);
            attrObject.templateFn = compiler.parse(vo, nodeName, currentAttr.nodeValue);
            attrList.push(attrObject);
        }

        function handleSpecialAttr (vo, nodeName, currentAttr, attrObject) {

        }

        function beforeCreateVDOM (vo) {
            vo.$elem = utils.query(vo.elem);
            if (!vo.$cache(vo.elem)) {
                var template = utils.getOuterHTML(vo.$elem);
                vo.$cache(vo.elem, template);
            }
        }

        function VNode (vo, elemRef, nodeName, nodeType, attributeMap, data, parentNode, childNodes) {
            if (!(this instanceof VNode)) {
                return new VNode(vo, elemRef, nodeName, nodeType, attributeMap, data, parentNode, childNodes);
            }
            this.vo = vo;
            this.elemRef = elemRef;
            this.nodeName = nodeName;
            this.nodeType = nodeType;
            this.attributeMap = convertAttrToList(vo, nodeName, attributeMap);
            this.templateFn = compiler.parse(vo, nodeName, data);
            this.data = data;
            this.parentNode = parentNode;
            this.childNodes = childNodes;
            this.dirty = false;
            this.operation = 0;
        }

        function cloneVNode (vn) {
            var cloned;
            if (vn) {
                var childrenNodes = vn.childNodes.slice();
                var attributeMap = vn.attributeMap;
                if (attributeMap) {
                    attributeMap = vn.attributeMap.slice();
                }
                cloned = new VNode(vn.vo, vn.elemRef, vn.nodeName, vn.nodeType, attributeMap, vn.data, vn.parentNode, childNodes);
            }
            return cloned;
        }

        function cloneAttribute (attr) {
            var cloned;
            if (attr) {
                cloned = {
                    attrName: attr.attrName,
                    attrValue: attr.nodeValue,
                    nodeName: attr.nodeName,
                    nodeType: attr.nodeType,
                    operation: attr.operation
                };
            }
            return cloned;
        }

        function createVDOM$1 (vo) {
            vo.$vRootNode = new VNode(vo, vo.$elem, vo.$elem.nodeName, vo.$elem.nodeType, vo.$elem.attributes, vo.$elem.data, null, []);
            vo._vRootNode = new VNode(vo, vo.$elem, vo.$elem.nodeName, vo.$elem.nodeType, vo.$elem.attributes, vo.$elem.data, null, []);
            genVDOMTree(vo, vo.$vRootNode, vo.$elem.childNodes);
            genVDOMTree(vo, vo._vRootNode, vo.$elem.childNodes); // used to patch
        }

        function genVDOMTree (vo, rootNode, childNodes) {
            var parentNode = rootNode;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                var cn = childNodes[i];
                if (cn.nodeType === 1 || cn.nodeType === 3) {
                    var atrributeMap = cn.attributes;
                    var vNode = new VNode(vo, cn, cn.nodeName, cn.nodeType, atrributeMap, cn.data, parentNode, []);
                    parentNode.childNodes.push(vNode);
                    genVDOMTree(vo, vNode, cn.childNodes);
                }
            }
        }

        function afterCreateVDOM (vo) {
            utils.log(vo.$vRootNode);
        }

        function patch (vo, oldVNode, newVNode) {
            // compiler.compile$2(vo, vo._vRootNode);
            patchVNode(vo, oldVNode, newVNode);
        }

        function patchVNode (vo, oldVNode, newVNode) {
            var nodeType = (oldVNode.nodeType === newVNode.nodeType) ? oldVNode.nodeType : 0;
            switch (nodeType) {
                case 1:
                    patchAttributes(vo, oldVNode, newVNode);
                    patchChildren(vo, oldVNode, newVNode);
                    break;
                case 2:
                    break;
                case 3:
                    patchTextContent(vo, oldVNode, newVNode);
                    break;
                default: 
                    break;
            }
        }

        function updateTextContent (elemRef, text) {
            utils.setTextContent(elemRef, text);
        }

        function patchTextContent (vo, oldVNode, newVNode) {
            if (utils.isFunction(newVNode.templateFn)) {
                var newData = newVNode.templateFn(vo);
                if (oldVNode.data !== newData) {
                    oldVNode.data = newData
                    oldVNode.templateFn = compiler.parse(vo, newVNode.nodeName, newVNode.data);
                    updateTextContent(oldVNode.elemRef, newData);
                }
            }
        }

        function patchChildren (vo, oldVNode, newVNode) {
            var oldChildren = oldVNode.childNodes;
            var newChildren = newVNode.childNodes;
            updateChildren(vo, oldVNode.elemRef, oldChildren, newChildren);
        }

        function removeElement (vo, elemRef) {
            utils.removeChild(utls.parentNode(elemRef), elemRef);
        }

        function createElement (vo, parentElemRef, nodeName, attrList, children) {
            var elemRef;
            if (parentElemRef) {
                utils.appendChild(parentElemRef, elemRef);
            }
            attrList = attrList || [];
            var i, len;
            for (i = 0, len = attrList.length; i < len; i++) {
                utils.setAttribute(elemRef, attrList[i]["attrName"], attrList[i]["attrValue"]);
            }
            for (i = 0, len = children.length; i < len; i++) {
                createElement(vo, elemRef, children[i]["nodeName"], children[i]["attributeMap"], children[i]["childNodes"]); 
            }
        }

        function createTextNode (vo, parentElemRef, text) {
            var textNode = utils.createTextNode(text);
            utils.appendChild(parentElemRef, textNode);
        }

        function updateChildren (vo, elemRef, oldChildren, newChildren) {
            var currentNode;
            var i = 0, lenI = newChildren.length;
            while (i < lenI) {
                currentNode = newChildren[i];
                switch (currentNode["operation"]) {
                    case 1: // add
                        var clonedVNode = cloneVNode(currentNode);
                        clonedVNode.parentNode = 
                        cloneVNode.templateFn = compiler.parse(vo, newVNode.nodeName, newVNode.data);
                        oldChildren.splice(i, 1, clonedVNode); 
                        if (clonedVNode.nodeType === 1) {
                            createElement(vo, clonedVNode.parentNode.elemRef, clonedVNode.nodeName, clonedVNode.attributeMap, clonedVNode.childNodes);               
                        } else if (clonedVNode.nodeType === 3) {
                            createTextNode(vo, clonedVNode.parentNode.elemRef, clonedVNode.data);
                        }
                        break;
                    case -1: // delete
                        oldChildren.splice(i, 1);
                        newChildren.splice(i, 1);
                        lenI--;
                        removeElement(newChildren[i]["elemRef"]);
                        break;
                    case 0: // normalUpdate
                        patchVNode(vo, oldChildren[i], newChildren[i]);
                        break;
                    default:
                        break;
                }
                currentNode["operation"] = 0;
                i++;
            }
        }

        function updateAttribute (elemRef, attrName, attrValue, operation) {
            if (operation === -1) {
              utils.removeAttribute(elemRef, attrName);  
            } else {
                utils.setAttribute(elemRef, attrName, attrValue);
            }
        }

        function abnormalUpdateAttribute (vo, elemRef, oldAttrMap, newAttrMap) {
            var len = oldAttrMap.length - newAttrMap.length;
            var indicator = len < 0 ? 1 : len === 0 ? 0 : -1;
            switch (indicator) {
                case 1: // add
                    var otherUpdateAttrMap = newAttrMap.slice(newAttrMap.length + len);
                    var templateFn;
                    for (var i = 0, l = otherUpdateAttrMap.length; i < l; i++) {
                        templateFn = otherUpdateAttrMap[i]["templateFn"];
                        if (utils.isFunction(templateFn)) {
                            otherUpdateAttrMap[i]["attrValue"] = templateFn(vo);
                            updateAttribute(elemRef, otherUpdateAttrMap[i]["attrName"], otherUpdateAttrMap[i]["attrValue"]);
                        }
                    }
                    oldAttrMap = oldAttrMap.concat(otherUpdateAttrMap);
                    break;
                case -1: // delete
                    for (var i = len, l = oldAttrMap.length; i < l; i++) {
                        utils.removeAttribute(elemRef, oldAttrMap[i]["attrName"]);
                    }
                    oldAttrMap = oldAttrMap.slice(0, oldAttrMap.length + len);
                    break;
                default:
                    break;
            }
        }

        function patchAttributes (vo, oldVNode, newVNode) {
            var oldAttrMap = oldVNode.attributeMap;
            var newAttrMap = newVNode.attributeMap;
            // abnormalUpdateAttribute
            if (!oldAttrMap && !newAttrMap) {
                return;
            }
            if ((!oldAttrMap && newAttrMap) ||  
                (oldAttrMap && !newAttrMap)
            ){
                abnormalUpdateAttribute (vo, oldVNode.elemRef, (oldAttrMap || []), (newAttrMap || []));
                return;
            }
            var currentAttr;
            var i = 0, lenI = newAttrMap.length;
            while (i < lenI) {
                currentAttr = newAttrMap[i];
                switch (currentAttr["operation"]) {
                    case 1: // add
                        var clonedAttr = cloneAttribute(currentAttr);
                        clonedAttr.templateFn = compiler.parse(vo, clonedAttr.nodeName, clonedAttr.attrValue);
                        oldAttrMap.splice(i, 1, clonedAttr);
                        updateAttribute(oldVNode.elemRef, clonedAttr.attrName, clonedAttr.attrValue, 1);
                        break;
                    case -1: // delete
                        oldAttrMap.splice(i, 1);
                        newAttrMap.splice(i, 1);
                        lenI--;
                        updateAttribute(oldVNode.elemRef, clonedAttr.attrName, clonedAttr.attrValue, -1);
                        break;
                    case 0: // normalUpdate
                        var newAttrValue = newAttrMap[i].templateFn(vo);
                        if (utils.isVoDirective(newAttrMap[i]["attrName"])) {
                            if (utils.isVoModelDirective(newAttrMap[i]["attrName"])) {
                                if (newAttrMap[i]["nodeName"] === "INPUT") {
                                    oldVNode.elemRef.value = vo.$responseGetterProxy(newAttrValue);
                                }
                            }
                        } else {
                            if (newAttrValue !== oldAttrMap[i]["attrValue"]) {
                                oldAttrMap[i]["attrValue"] = newAttrValue;
                                oldAttrMap[i]["templateFn"] = compiler.parse(vo, oldVNode.nodeName, currentAttr.attrValue);
                                updateAttribute(oldVNode.elemRef, currentAttr.attrName, newAttrValue, 0);
                            }
                        }
                        break;
                    default:
                        break;
                }
                currentAttr["operation"] = 0;
                i++;
            }
            // abnormalUpdateAttribute
            abnormalUpdateAttribute (vo, oldVNode.elemRef, oldAttrMap, newAttrMap);
        }

        return {
            beforeCreateVDOM: beforeCreateVDOM,
            createVDOM$1: createVDOM$1,
            afterCreateVDOM: afterCreateVDOM,
            VNode: VNode,
            genVDOMTree: genVDOMTree,
            patch: patch
        };
    })();

    var render = (function () {
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
            var dom = renderDOM$3(vo, void(0), rootNode);
            renderDOM$4(vo, dom, rootNode);
            return dom;
        }

        function renderDOM$3 (vo, parentNode, node) {
            var nodeType = node.nodeType;
            var elemNode;
            switch (nodeType) {
                case 1:
                    elemNode = utils.createElement(node.nodeName);
                    var attributeMap = node.attributeMap;
                    for (var i = 0, l = attributeMap.length; i < l; i++) {
                        setAttributeWarpper(vo, elemNode, attributeMap[i]["attrName"], attributeMap[i]["attrValue"]);
                    }
                    if (parentNode) {
                        utils.appendChild(parentNode, elemNode);
                    }
                    node.elemRef = elemNode;
                    break;
                case 3:
                    var targetTextNode = utils.createTextNode(node.data);
                    utils.appendChild(parentNode, targetTextNode);
                    node.elemRef = targetTextNode;
                    elemNode = parentNode;
                    break;
                default:
                    elemNode = parentNode;
                    break;
            }
            return elemNode;
        }

        function renderDOM$4 (vo, parentNode, node) {
            var childNodes = node.childNodes;
            var elemNode;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                elemNode = renderDOM$3(vo, parentNode, childNodes[i]);
                renderDOM$4(vo, elemNode, childNodes[i]);
            }
        }

        function renderDOM$5 (vo, dom) {
            var $elem = utils.query(vo.elem);
            var pn = $elem.parentNode;
            if (pn) {
                utils.insertBefore(pn, dom, $elem);
                utils.removeChild(pn, $elem);
            }
        }

        function afterRenderDOM (vo) {

        }

        function addEventListener (vo, elemNode, eventType, listener) {
            elemNode.addEventListener(eventType, vo.$methods[listener]);
        }

        function addEventListener$2 (vo, elemNode, eventType, listener) {
            elemNode.addEventListener(eventType, listener);
        }

        function getVoEventType (attrName) {
            return attrName.substring(constants.EVENT_ATTR_PREFIX.length);
        }

        function setAttributeWarpper (vo, elemNode, attrName, attrValue) {
            if (utils.isVoDirective(attrName)) {
                handleDirectives(vo, elemNode, attrName, attrValue);
            } else {
                utils.setAttribute(elemNode, attrName, attrValue);
            }
        }

        function trigger (elemNode, type) {
            var event = document.createEvent("HTMLEvents");
            event.initEvent(type, true, true);
            elemNode.dispatchEvent(event);
        }

        function handleDirectives (vo, elemNode, attrName, attrValue) {
            if (utils.isVoModelDirective(attrName)) {
                handleModelDirective(vo, elemNode, attrName, attrValue);
            }else if (utils.isVoEventDirectivePrefix(attrName)) {
                handleEventDirective(vo, elemNode, attrName, attrValue);    
            }
        }

        function handleModelDirective (vo, elemNode, attrName, attrValue) {
            elemNode.value = vo.$responseGetterProxy(attrValue);
            if (elemNode.nodeName === "INPUT") {
                var listener = utils.$bind(function(attrValue) {
                    this[attrValue] = elemNode.value;
                }, vo);
                addEventListener$2(vo, elemNode, "input", function() {
                    listener(attrValue);
                });
            }
        }

        function handleEventDirective (vo, elemNode, attrName, attrValue) {
            var eventType = getVoEventType(attrName);
            addEventListener(vo, elemNode, eventType, attrValue)
        }

        return {
            renderDOM$1: renderDOM$1
        };
    })();

    var events = (function () {
        var uuid = 1;

        /**
         * eventBus
         */
        function EventBus () {
            if (!(this instanceof EventBus)) {
                return new EventBus();
            }
            this.events = {};
        };

        EventBus.prototype.on = function (type, handler) {
            var list = this.events[type] || (this.events[type] = []);
            list.push(handler);
        }

        EventBus.prototype.off = function (type, handler) {
            if (!(type || handler)) {
                this.events = {};
                return;
            }
            var handlers = this.events[type];
            if (handlers) {
                if (handler) {
                    for (var i = 0, l = handlers.length; i < l; i++) {
                        if (handlers[i] === handler) {
                            handlers.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.events[type] = [];
                }
            }
        }

        EventBus.prototype.emit = function (type) {
            var handlers = this.events[type];
            if (handlers) {
                var args = uitls.slice.call(arguments, 1);
                var copiedHandlers = slice.call(handlers);
                for (var i = 0, l = copiedHandlers.length; i < l; i++) {
                    copiedHandlers[i](args);
                }
            }
        }

        return {
            EventBus: EventBus
        };
    })();

    var compiler = (function () {
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
                templateFnBody = stack.join(" + ").trim();
            }
            templateFnBody = "with(vo) { return " + templateFnBody + ";}";
            return templateFnBody;
        }

        function parseWhiteSpaceChar (vo, last, re, stack) {
            var result = re.exec(last)
            if (result && result[1]) {
                var whiteSpaceChars = result[1];
                stack.push("_ts(\"" + whiteSpaceChars.trim() + "\")");
                last = advance(last, whiteSpaceChars.length);
            }
        }

        function parseChar (vo, nodeName, last, stack) {
            var ldIndex = -1;
            var rdIndex = -1;
            var leftDelimiter = constants.LEFT_DELIMITER;
            var rightDelimiter = constants.RIGHT_DELIMITER;
            while (last) {
                ldIndex = last.indexOf(leftDelimiter);
                rdIndex = last.indexOf(rightDelimiter);
                if (ldIndex !== -1 && rdIndex !== -1) {
                    // var token = last.substring(0, ldIndex).trim();
                    var token = last.substring(0, ldIndex).replace(/\r/g, constants.ONE_CHAR_STRING).replace(/\n/g, constants.ONE_CHAR_STRING).replace(/\t/g, constants.ONE_CHAR_STRING);
                    stack.push("_ts(\"" + token + "\")");
                    last = advance(last, ldIndex);
                    ldIndex = last.indexOf(leftDelimiter);
                    rdIndex = last.indexOf(rightDelimiter);
                    var responseVar = last.substring(leftDelimiter.length, rdIndex).trim();
                    if (/\s+/.test(responseVar)) {
                        throw new Error("\n[vo error] failed to compile template: \n" +
                            vo.$cache(vo.elem) + "\n- invalid expression: \n" +
                            last.substring(0, rdIndex + rightDelimiter.length));
                    }
                    if (!utils.hasOwn(vo, responseVar)) {
                        throw new Error("\n[vo error] Property or method `" +
                            responseVar + "` is not defined on the instance but referenced during render. \n" +
                            "Make sure to declare reactive data properties in the data option.");
                    }
                    stack.push("_ts(" + responseVar + ")");
                    last = advance(last, rdIndex + rightDelimiter.length);
                } else {
                    // last = last.trim();
                    last = last.replace(/\r/g, constants.ONE_CHAR_STRING).replace(/\n/g, constants.ONE_CHAR_STRING).replace(/\t/g, constants.ONE_CHAR_STRING);
                    stack.push("_ts(\"" + last + "\")");
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
                refreshVdom(vo, node);
                var childNodes = node.childNodes;
                for (var i = 0, lI = childNodes.length; i < lI; i++) {
                    compile$2(vo, childNodes[i]);
                }
            }
        }

        function refreshVdom (vo, node) {
            var attributeMap = node.attributeMap;
            if (attributeMap) {
                var attr;
                for (var i = 0, l = attributeMap.length; i < l; i++) {
                    attr = attributeMap[i];
                    attr.attrValue = attr.templateFn(vo);
                }
            } else {
                node.data = node.templateFn(vo);
            }
        }

        return {
            parse: parse,
            compile$1: compile$1,
            compile$2: compile$2
        };
    })();

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
                obj.$observer.publish(obj, otherConfig.$sub.uuid);
                vdom.patch(vo, vo.$vRootNode, vo._vRootNode);
            }
        });
    }

    function responseSetterProxy (key, value) {
        var vo = this;
        if (!value) {
            value = vo[key];
        }
        vo[key] = value;
        vdom.patch(vo, vo.$vRootNode, vo._vRootNode);
    }

    function responseGetterProxy (key) {
        var vo = this;
        return vo[key];
    }

    /**
     * Vo constructor
     */
    function Vo (options) {
        if (!(this instanceof Vo)) {
            utils.warn("please use `new` keyword to create Vo object.");
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
    function init$1 (options) {
        if (utils.isNull(options) ||
            utils.isUndefined(options) ||
            !utils.isObject(options) ||
            utils.isEmptyObject(options)
        ) {
            return;
        }
        if (!utils.hasOwn(options, "elem") || !options.elem) {
            utils.warn("Vo must has elem.");
            return;
        }
        var vo = this;
        mount$1(vo, options);
        initMinin$1(vo);
    }

    /**
     * mount
     */
    function mount$1 (vo, options) {
        mount$2(vo, options);
    }

    function mount$2 (vo, options) {
        mount$moitor(vo, options);
        mount$data(vo, options);
        mount$method(vo, options);
        utils.extend(vo, options);
    }

    function mount$moitor (vo, options) {
        utils.defProperty(vo, "$monitors", {});
        utils.extend(vo.$monitors, options.monitors);
        options.monitors = null;
    }

    function mount$data (vo, options) {
        utils.extend(vo, options.data);
        vo.$observer = new observer.Observer(vo);
        if (options.data && utils.isObject(options.data)) {
            var key;
            for (key in options.data) {
                var sub = new observer.Subject(vo, utils._toString(key), vo.$monitors[key]);
                vo.$observer.addSub(sub);
                registResponse(vo, key, options.data[key], {
                    $sub: sub
                });
            }
        }
        options.data = null;
    }

    function mount$method (vo, options) {
        utils.defProperty(vo, "$methods", {});
        var key;
        for (key in options.methods) {
            utils.defProperty(vo.$methods, key, utils.$bind(options.methods[key], vo));
        }
        options.methods = null;
    }

    /**
     * initMinin$2
     */
    function initMixin$2 () {
        /**
         * extend inner method
         */
        utils.extend(Vo.prototype, {
            version: "1.0.0",
            init$1: init$1,
            _ts: utils._toString,
            $responseSetterProxy: responseSetterProxy,
            $responseGetterProxy: responseGetterProxy
        });
        Vo.prototype.utils = utils;
    }

    return Vo;
}));