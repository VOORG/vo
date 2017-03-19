/*
 * created by mawei 2017.02.05
 */
(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(global) :
    typeof define === "function" && define.amd ? define(factory) : (global.Vo = factory(global));
}(this, function (global) {
    "use strict";
    var uuid = 1;

    var EMPTY_STRING = "";
    var ONE_CHAR_STRING = " ";
    var LEFT_DELIMITER = "{{";
    var RIGHT_DELIMITER = "}}";
    var ATTR_PREFIX = "vo-";
    var MODEL_ATTR = ATTR_PREFIX + "model";
    var EVENT_ATTR_PREFIX = ATTR_PREFIX + "on:";

    var blankObject = {};
    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var concat = Array.prototype.concat;
    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;
    var push = Array.prototype.push;
    var pop = Array.prototype.pop;

    /**
     * noop
     */
    function noop () {}

    /**
     * 
     * @param {*} val 
     */
    function _toString (val) {
        return val == null ? "" : typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
    }

    /**
     * 
     * @param {*} val 
     */
    function toNumber (val) {
        var n = parseFloat(val, 10);
        return (n || n === 0) ? n : val;
    }

    /**
     * 
     * @param {*} object 
     */
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
            source, key, i;
        for (i = 1; i < size; i++) {
            source = arguments[i];
            for (key in source) {
                if (isObject(source[key])) {
                    defProperty(destination, key, {});
                    extend(destination[key], source[key]);
                } else {
                    destination[key] = source[key];
                }
            }
        }
        return destination;
    }

    /**
     * 
     * @param {*} object 
     * @param {*} key 
     */
    function hasOwn (object, key) {
        var keyArr = key.split(".");
        var obj = object;
        for (var i = 0, len = keyArr.length; i < len; i++) {
            if (!(isObject(obj) && hasOwnProperty.call(obj, keyArr[i]))) {
                return false;
            }
            obj = obj[keyArr[i]];
        }
        return true;
        // return isObject(object) && hasOwnProperty.call(object, key);
    }

    /**
     * 
     * @param {*} object 
     * @param {*} type 
     */
    function isType (type) {
        return function (object) {
            return "[object " + type + "]" === toString.call(object);
        };
    }

    var isFunction = isType("Function");
    var isObject = isType("Object");
    var isRegex = isType("Regex");
    var isArray = isType("Array");
    var isNumber = isType("Number");
    var isBlooean = isType("Blooean");

    /**
     * 
     * @param {*} constructor 
     */
    function isNative (constructor) {
        return /native code/.test(constructor.toString())
    }

    /**
     * 
     * @param {*} object 
     */
    function isEmptyObject (object) {
        var name;
        for (name in object) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {*} object 
     */
    function isNaN (object) {
        return isNumber(object) && object !== +object;
    }

    /**
     * 
     * @param {*} object 
     */
    function isNull (object) {
        return object === null;
    }

    /**
     * 
     * @param {*} object 
     */
    function isUndefined (object) {
        return object === void(0);
    }

    /**
     * 
     * @param {*} msg 
     */
    function log (msg) {
        if (typeof console !== "undefined") {
            console.log(msg);
        }
    }

    /**
     * 
     * @param {*} msg 
     */
    function error (msg) {
        if (typeof console !== "undefined") {
            console.error(msg);
        }
    }

    /**
     * 
     * @param {*} msg 
     */
    function warn (msg) {
        if (typeof console !== "undefined") {
            console.warn(msg);
        }
    }

    /**
     * 
     */
    function cache () {
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
     * 
     * @param {*} body 
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
     * 
     * @param {*} fn 
     * @param {*} ctx 
     */
    function $bind (fn, ctx) {
        var args = slice.call(arguments, 2);
        function bindFn() {
            args = args.concat(slice.call(arguments));
            if (1 < args.length) {
                return fn.apply(ctx, args);
            } else {
                return args.length ? fn.call(ctx, args[0]) : fn.call(ctx);
            }
        }
        return bindFn;
    }

    /**
     * 
     * @param {*} obj 
     * @param {*} key 
     * @param {*} value 
     * @param {*} propertyDescriptor 
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
     * 
     * @param {*} el 
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

    /**
     * 
     * @param {*} tagName 
     */
    function createElement (tagName) {
        return document.createElement(tagName);
    }

    /** */
    var namespaceMap = {
        svg: "http://www.w3.org/2000/svg",
        math: "http://www.w3.org/1998/Math/MathML",
        xhtml: "http://www.w3.org/1999/xhtml"
    };

    /**
     * 
     * @param {*} namespace 
     * @param {*} tagName 
     */
    function createElementNS (namespace, tagName) {
        return document.createElementNS(namespaceMap[namespace], tagName)
    }

    /**
     * 
     * @param {*} text 
     */
    function createTextNode (text) {
        return document.createTextNode(text)
    }

    /**
     * 
     * @param {*} text 
     */
    function createComment (text) {
        return document.createComment(text)
    }

    /**
     * 
     * @param {*} parentNode 
     * @param {*} newNode 
     * @param {*} referenceNode 
     */
    function insertBefore (parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    }

    /**
     * 
     * @param {*} node 
     * @param {*} child 
     */
    function removeChild (node, child) {
        node.removeChild(child);
    }

    /**
     * 
     * @param {*} node 
     * @param {*} child 
     */
    function appendChild (node, child) {
        node.appendChild(child);
    }

    /**
     * 
     * @param {*} node 
     */
    function parentNode (node) {
        return node.parentNode
    }

    /**
     * 
     * @param {*} node 
     */
    function previousSibling (node) {
        return node.previousSibling;
    }
    
    /**
     * 
     * @param {*} node 
     */
    function nextSibling (node) {
        return node.nextSibling
    }

    /**
     * 
     * @param {*} node 
     */
    function tagName (node) {
        return node.tagName
    }

    /**
     * 
     * @param {*} node 
     * @param {*} text 
     */
    function setTextContent (node, text) {
        node.textContent = text;
    }

    /**
     * 
     * @param {*} node 
     * @param {*} key 
     */
    function getAttribute (node, key) {
        return node.getAttribute(key);
    }

    /**
     * 
     * @param {*} node 
     * @param {*} key 
     * @param {*} val 
     */
    function setAttribute (node, key, val) {
        node.setAttribute (key, val);
    }

    /**
     * 
     * @param {*} node 
     * @param {*} key 
     */
    function removeAttribute (node, key) {
        node.removeAttribute(key);
    }

    /**
     * 
     * @param {*} node 
     */
    function getOuterHTML (node) {
        return node.outerHTML;
    }

    /**
     * 
     * @param {*} attrName 
     */
    function isVoDirective (attrName) {
        return (-1 !== attrName.indexOf(ATTR_PREFIX))
    }

    /**
     * 
     * @param {*} name 
     */
    function getDirectiveName (name) {
        return name.substring(ATTR_PREFIX.length);
    }

    /**
     * 
     * @param {*} attrName 
     */
    function isVoModelDirective (attrName) {
        return (attrName === MODEL_ATTR);
    }

    /**
     * 
     * @param {*} attrName 
     */
    function isVoEventDirectivePrefix (attrName) {
        return (-1 !== attrName.indexOf(EVENT_ATTR_PREFIX));
    }

    var browser = (function () {
        var inBrowser = typeof window !== "undefined";
        return {
            inBrowser: inBrowser
        }
    })();

    var observer = (function () {
        var uuid = 1;

        /**
         * 
         * @param {*} vo 
         * @param {*} subName 
         * @param {*} monitorConfig 
         */
        function Subject (vo, subName, monitorConfig) {
            if (!(this instanceof Subject)) {
                return new Subject(subName, monitor);
            }
            this.uuid = uuid++;
            this.vo = vo;
            this.subName = subName;
            this.monitor = new Monitor(vo, monitorConfig);
        }

        /**
         * registMonitor
         */
        Subject.prototype.registMonitor = function (monitor) {
            if (!(monitor instanceof Monitor)) {
                return;
            }
            this.monitor = monitor;
        }

        /**
         * removeMonitor
         */
        Subject.prototype.removeMonitor = function () {
            this.monitor = null;
        }

        /**
         * notify
         */
        Subject.prototype.notify = function (vo) {
            this.monitor.update(vo);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} monitorConfig 
         */
        function Monitor (vo, monitorConfig) {
            if (!(this instanceof Monitor)) {
                return new Monitor(vo, monitorConfig);
            }
            this.uuid = uuid++;
            this.vo = vo;
            this.monitorConfig = monitorConfig;
        }

        /**
         * update
         */
        Monitor.prototype.update = function (vo) {
            var config = this.monitorConfig;
            if (isObject(config)) {
                if (isFunction(config.fn)) {
                    if (config.async === true) {
                        config.fn.call(vo, vo.$responseGetterProxy(config.monitorName));
                    } else {
                        var cb = $bind(config.fn, vo, vo.$responseGetterProxy(config.monitorName));
                        vo.$nextPoll(cb);
                    }
                }
            } else {
                vo.$nextPoll();
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} sub 
         */
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

        /**
         * addSub
         */
        Observer.prototype.addSub = function (sub) {
            if (!(sub instanceof Subject)) {
                return;
            }
            this.subs.push(sub);
        }

        /**
         * removeSub
         */
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

        /**
         * publish
         */
        Observer.prototype.publish = function (vo, uuid) {
            if (uuid) {
                var subs = slice.call(this.subs);
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
        /**
         * 
         * @param {*} vo 
         * @param {*} nodeName 
         * @param {*} attributes 
         */
        function convertAttrToList (vo, nodeName, attributes) {
            var attrList;
            if (attributes) {
                attrList = [];
                var currentAttr;
                for (var i = 0, l = attributes.length; i < l; i++) {
                    currentAttr = attributes[i];
                    handleVNodeAttr(vo, nodeName, currentAttr, attrList);
                }
            }
            return attrList;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} nodeName 
         * @param {*} currentAttr 
         * @param {*} attrList 
         */
        function handleVNodeAttr (vo, nodeName, currentAttr, attrList) {
            var attrName = currentAttr.nodeName;
            var attrObject = {
                attrName: attrName,
                attrValue: currentAttr.nodeValue,
                attrValueTemplate: currentAttr.nodeValue,
                nodeName: nodeName,
                nodeType: currentAttr.nodeType,
                operation: 0
            };
            handleSpecialAttr(vo, nodeName, currentAttr, attrObject);
            attrObject.templateFn = compiler.parse(vo, nodeName, currentAttr.nodeValue);
            attrList.push(attrObject);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} nodeName 
         * @param {*} currentAttr 
         * @param {*} attrObject 
         */
        function handleSpecialAttr (vo, nodeName, currentAttr, attrObject) {

        }

        /**
         * 
         * @param {*} vo 
         */
        function beforeCreateVDOM (vo) {
            vo.$elem = query(vo.elem);
            if (!vo.$cache(vo.elem)) {
                var template = getOuterHTML(vo.$elem);
                vo.$cache(vo.elem, template);
            }
        }
        
        /**
         * 
         * @param {*} vo 
         * @param {*} elemRef 
         * @param {*} nodeName 
         * @param {*} nodeType 
         * @param {*} attributeMap 
         * @param {*} data 
         * @param {*} parentNode 
         * @param {*} childNodes 
         */
        function VNode (vo, elemRef, nodeName, nodeType, attributeMap, data, parentNode, childNodes, index) {
            if (!(this instanceof VNode)) {
                return new VNode(vo, elemRef, nodeName, nodeType, attributeMap, data, parentNode, childNodes, index);
            }
            this.vo = vo;
            this.elemRef = elemRef;
            this.nodeName = nodeName;
            this.nodeType = nodeType;
            this.attributeMap = convertAttrToList(vo, nodeName, attributeMap);
            this.templateFn = compiler.parse(vo, nodeName, data);
            this.data = data;
            this.dataTemplate = data;
            this.parentNode = parentNode;
            this.childNodes = childNodes;
            // this.dirty = false;
            this.operation = 0;
            this.index = index;
            vNodeCtorHook(vo, this);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} currentVNode 
         * @param {*} nodeName 
         * @param {*} attributeMap 
         */
        function vNodeCtorHook (vo, currentVNode) {
            if (isVoDirective(currentVNode.nodeName.toLowerCase())) {
                handleDirective$VNode(vo, currentVNode);
            } else {

            }
        }

        /**
         * 
         */
        function handleDirective$VNode (vo, currentVNode) {
            var directiveName = getDirectiveName(currentVNode.nodeName);
            switch (directiveName) {
                case "IF":
                    handleIfDirective$VNode(vo, currentVNode);
                    break;
                default:
                    break;
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} currentVNode 
         * @param {*} attributeMap 
         */
        function handleIfDirective$VNode (vo, currentVNode) {
            var templateFn;
            if (currentVNode.attributeMap) {
                templateFn = currentVNode.attributeMap[0]["templateFn"];
            }
            currentVNode.isDirective = true;
            currentVNode.directive = {
                directiveName: "IF",
                exp: templateFn(vo)
            }
        }

        /**
         * 
         * @param {*} vn 
         */
        function cloneVNode (vn) {
            var cloned;
            if (vn) {
                var childNodes = vn.childNodes.slice();
                var attributeMap = vn.attributeMap;
                if (attributeMap) {
                    attributeMap = vn.attributeMap.slice();
                }
                cloned = new VNode(vn.vo, vn.elemRef, vn.nodeName, vn.nodeType, attributeMap, vn.data, null, childNodes);
            }
            return cloned;
        }

        /**
         * 
         * @param {*} attr 
         */
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

        /**
         * 
         * @param {*} vo 
         */
        function createVDOM$1 (vo) {
            vo.$vRootNode = new VNode(vo, vo.$elem, vo.$elem.nodeName, vo.$elem.nodeType, vo.$elem.attributes, vo.$elem.data, null, []);
            genVDOMTree(vo, vo.$vRootNode, vo.$elem.childNodes);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} rootNode 
         * @param {*} childNodes 
         */
        function genVDOMTree (vo, rootNode, childNodes) {
            var parentNode = rootNode;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                var cn = childNodes[i];
                if (cn.nodeType === 1 || cn.nodeType === 3) {
                    var atrributeMap = cn.attributes;
                    var vNode = new VNode(vo, cn, cn.nodeName, cn.nodeType, atrributeMap, cn.data, parentNode, [], i);
                    parentNode.childNodes.push(vNode);
                    genVDOMTree(vo, vNode, cn.childNodes);
                }
            }
        }

        /**
         * 
         * @param {*} vo 
         */
        function afterCreateVDOM (vo) {

        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         */
        function patch (vo, vNode) {
            patchVNode(vo, vNode);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         */
        function patchVNode (vo, vNode) {
            var nodeType = vNode.nodeType || 0;
            switch (nodeType) {
                case 1:
                    if (vNode.isDirective) {
                        patchDirective(vo, vNode);
                    } else {
                        patchAttributes(vo, vNode);
                        patchChildren(vo, vNode);
                    }
                    break;
                case 3:
                    patchTextContent(vo, vNode);
                    break;
                default: 
                    break;
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         */
        function patchDirective (vo, vNode) {
            var nodeName = vNode.nodeName;
            var directiveName = getDirectiveName(nodeName);
            switch (directiveName) {
                case "IF":
                    patchDirective$If(vo, vNode);
                    break;
                default:
                    break;
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         */
        function patchDirective$If (vo, vNode) {
            var attrMap = vNode.attributeMap;
            var templateFn = attrMap[0]["templateFn"];
            if (isFunction(templateFn)) {
                var newAttrValue = templateFn(vo);
                var directOperation;
                if (attrMap[0]["attrValue"] !== newAttrValue) {
                    attrMap[0]["attrValue"] = newAttrValue;
                    // attrMap[0]["templateFn"] = compiler.parse(vo, vNode.nodeName, attrMap[0]["attrValueTemplate"]);
                    directOperation = newAttrValue === "true" ? 1 : -1;
                }
                patchChildren(vo, vNode, directOperation);
            }
        }

        /**
         * 
         * @param {*} elemRef 
         * @param {*} text 
         */
        function updateTextContent (elemRef, text) {
            setTextContent(elemRef, text);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         */
        function patchTextContent (vo, vNode) {
            if (isFunction(vNode.templateFn)) {
                var newData = vNode.templateFn(vo);
                if (vNode.data !== newData) {
                    vNode.data = newData
                    // vNode.templateFn = compiler.parse(vo, newVNode.nodeName, newVNode.data);
                    updateTextContent(vNode.elemRef, newData);
                }
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         * @param {*} directOperation 
         */
        function patchChildren (vo, vNode, directOperation) {
            updateChildren(vo, vNode, directOperation);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemRef 
         */
        function removeElement (vo, elemRef) {
            removeChild(parentNode(elemRef), elemRef);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} parentElemRef 
         * @param {*} nodeName 
         * @param {*} attrList 
         * @param {*} children 
         */
        function createElement$2 (vo, vNode) {
            var nodeType = vNode.nodeType;
            var elemRef;
            switch (nodeType) {
                case 1:
                    elemRef = createElement(vNode.nodeName);
                    break;
                case 3:
                    elemRef = createTextNode(vNode.data);
                    break;
                default:
                    return;
            }
            if (vNode.attributeMap) {
                var i, len, attributeMap = vNode.attributeMap;
                for (i = 0, len = attributeMap.length; i < len; i++) {
                    setAttribute(elemRef, attributeMap[i]["attrName"], attributeMap[i]["attrValue"]);
                }
            }
            vNode.elemRef = elemRef;
            return elemRef;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         * @param {*} directOperation 
         */
        function updateChildren (vo, vNode, directOperation) {
            var childNodes = vNode.childNodes;
            var i = 0, len = childNodes.length;
            while (i < len) {
                switch (directOperation || childNodes[i]["operation"]) {
                    case 1: // add
                        addChildren(vo, vNode, childNodes[i]);
                        break;
                    case -1: // delete
                        deleteChildren(vo, childNodes[i]);
                        break;
                    case 0: // normalUpdate
                        patchVNode(vo, childNodes[i]);
                        break;
                    default:
                        break;
                }
                childNodes[i]["operation"] = 0;
                i++;
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} parentVNode 
         * @param {*} vNode 
         */
        function addChildren (vo, parentVNode, vNode) {
            if (parentVNode.isDirective) {
                updateDirective(vo, parentVNode, vNode);
            } else {
                if (!vNode.isDirective) {
                    appendChild(parentVNode.elemRef, createElement$2(vo, vNode))
                }
                updateChildren(vo, vNode, 1);
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         */
        function deleteChildren (vo, vNode) {
            if (vNode.isDirective) {
                updateChildren(vo, vNode, -1);
            } else {
                removeElement(vo, vNode.elemRef);
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} parentVNode 
         * @param {*} vNode 
         */
        function updateDirective (vo, parentVNode, vNode) {
            var nodeName = parentVNode.nodeName;
            var directiveName = getDirectiveName(nodeName);
            switch (directiveName) {
                case "IF":
                    updateDirective$If(vo, parentVNode, vNode);
                    break;
                default:
                    break;
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} parentVNode 
         * @param {*} vNode 
         */
        function updateDirective$If (vo, parentVNode, vNode) {
            if (!vNode.isDirective) {
                var previousSiblingElemRef = getPreviousSiblingElemRef$notDirectiveVNode(parentVNode);
                insertBefore(parentNode(previousSiblingElemRef), createElement$2(vo, vNode), nextSibling(previousSiblingElemRef));
            }
            updateChildren(vo, vNode, 1);
        }

        /**
         * 
         * @param {*} vNode 
         */
        function getPreviousSiblingElemRef$notDirectiveVNode (vNode) {
            var index = vNode.index;
            var parentVNode = vNode.parentNode;
            var previousSiblingVNode;
            while (0 <= (--index)) {
                previousSiblingVNode = parentVNode.childNodes[index];
                if (
                    previousSiblingVNode && 
                    previousSiblingVNode.nodeType != 3 && 
                    !previousSiblingVNode.isDirective
                ) {
                    break;
                }
            }

            if (!previousSiblingVNode) {
                previousSiblingVNode = getPreviousSiblingElemRef$notDirectiveVNode(parentVNode);
            }
            return previousSiblingVNode.elemRef
        }

        /**
         * 
         * @param {*} elemRef 
         * @param {*} attrName 
         * @param {*} attrValue 
         * @param {*} operation 
         */
        function updateAttribute (elemRef, attrName, attrValue, operation) {
            if (operation === -1) {
              removeAttribute(elemRef, attrName);  
            } else {
                setAttribute(elemRef, attrName, attrValue);
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemRef 
         * @param {*} oldAttrMap 
         * @param {*} newAttrMap 
         */
        function abnormalUpdateAttribute (vo, elemRef, oldAttrMap, newAttrMap) {
            var len = oldAttrMap.length - newAttrMap.length;
            var indicator = len < 0 ? 1 : len === 0 ? 0 : -1;
            switch (indicator) {
                case 1: // add
                    var otherUpdateAttrMap = newAttrMap.slice(newAttrMap.length + len);
                    var templateFn;
                    for (var i = 0, l = otherUpdateAttrMap.length; i < l; i++) {
                        templateFn = otherUpdateAttrMap[i]["templateFn"];
                        if (isFunction(templateFn)) {
                            otherUpdateAttrMap[i]["attrValue"] = templateFn(vo);
                            updateAttribute(elemRef, otherUpdateAttrMap[i]["attrName"], otherUpdateAttrMap[i]["attrValue"]);
                        }
                    }
                    oldAttrMap = oldAttrMap.concat(otherUpdateAttrMap);
                    break;
                case -1: // delete
                    for (var i = len, l = oldAttrMap.length; i < l; i++) {
                        removeAttribute(elemRef, oldAttrMap[i]["attrName"]);
                    }
                    oldAttrMap = oldAttrMap.slice(0, oldAttrMap.length + len);
                    break;
                default:
                    break;
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} vNode 
         */
        function patchAttributes (vo, vNode) {
            var attributeMap = vNode.attributeMap;
            // abnormalUpdateAttribute
            if (!attributeMap) {
                return;
            }
            var currentAttr;
            var i = 0, lenI = attributeMap.length;
            while (i < lenI) {
                currentAttr = attributeMap[i];
                switch (currentAttr["operation"]) {
                    case 1: // add
                        var clonedAttr = cloneAttribute(currentAttr);
                        clonedAttr.templateFn = compiler.parse(vo, clonedAttr.nodeName, clonedAttr.attrValue);
                        oldAttrMap.splice(i, 1, clonedAttr);
                        updateAttribute(oldVNode.elemRef, clonedAttr.attrName, clonedAttr.attrValue, 1);
                        break;
                    case -1: // delete
                        // oldAttrMap.splice(i, 1);
                        attributeMap.splice(i, 1);
                        lenI--;
                        updateAttribute(vNode.elemRef, currentAttr.attrName, currentAttr.attrValue, -1);
                        break;
                    case 0: // normalUpdate
                        var newAttrValue = attributeMap[i].templateFn(vo);
                        if (isVoDirective(attributeMap[i]["attrName"])) {
                            if (isVoModelDirective(attributeMap[i]["attrName"])) {
                                if (attributeMap[i]["nodeName"] === "INPUT") {
                                    vNode.elemRef.value = vo.$responseGetterProxy(newAttrValue);
                                }
                            }
                        } else {
                            if (newAttrValue !== attributeMap[i]["attrValue"]) {
                                attributeMap[i]["attrValue"] = newAttrValue;
                                // attributeMap[i]["templateFn"] = compiler.parse(vo, vNode.nodeName, currentAttr.attrValueTemplate);
                                updateAttribute(vNode.elemRef, currentAttr.attrName, newAttrValue, 0);
                            }
                        }
                        break;
                    default:
                        break;
                }
                currentAttr["operation"] = 0;
                i++;
            }
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
        /**
         * 
         * @param {*} vo 
         */
        function beforeRenderDOM (vo) {
            compiler.compile$1(vo);
        }

        /**
         * 
         * @param {*} vo 
         */
        function renderDOM$1 (vo) {
            beforeRenderDOM(vo);
            var dom = renderDOM$2(vo);
            renderDOM$5(vo, dom);
            afterRenderDOM(vo);
        }

        /**
         * 
         * @param {*} vo 
         */
        function renderDOM$2 (vo) {
            var rootNode = vo.$vRootNode;
            var dom = renderDOM$3(vo, void(0), rootNode);
            renderDOM$4(vo, dom, rootNode);
            return dom;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} parentNode 
         * @param {*} node 
         */
        function renderDOM$3 (vo, parentNode, node) {
            var nodeType = node.nodeType;
            var elemNode;
            switch (nodeType) {
                case 1:
                    elemNode = renderElement(vo, parentNode, node);
                    break;
                case 3:
                    renderTextNode(vo, parentNode, node)
                    elemNode = parentNode;
                    break;
                default:
                    elemNode = parentNode;
                    break;
            }
            return elemNode;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} parentNode 
         * @param {*} node 
         */
        function renderElement (vo, parentNode, node) {
            var nodeName = node.nodeName;
            var elemNode = createElement(nodeName);
            renderAttribute(vo, elemNode, node.attributeMap);
            if (parentNode) {
                appendChild(parentNode, elemNode);
            }
            node.elemRef = elemNode;
            return elemNode;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} parentNode 
         * @param {*} node 
         */
        function renderTextNode (vo, parentNode, node) {
            var targetTextNode = createTextNode(node.data);
            appendChild(parentNode, targetTextNode);
            node.elemRef = targetTextNode;
            return targetTextNode;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} attributeMap 
         */
        function renderAttribute (vo, elemNode, attributeMap) {
            for (var i = 0, len = attributeMap.length; i < len; i++) {
                setAttributeWarpper(vo, elemNode, attributeMap[i]["attrName"], attributeMap[i]["attrValue"]);
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemParentNode 
         * @param {*} currentVNode 
         */
        function renderDirective (vo, elemParentNode, currentVNode) {
            var result;
            var directiveName = getDirectiveName(currentVNode.nodeName);
            switch (directiveName) {
                case "IF":
                    result = renderDirective$If(vo, elemParentNode, currentVNode);
                    break;
                case "FOR":
                    break;
                default:
                    break;
            }

            return result;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemParentNode 
         * @param {*} currentVNode 
         */
        function renderDirective$If (vo, elemParentNode, currentVNode) {
            if (currentVNode.directive.exp === "true") {
                renderDOM$4(vo, elemParentNode, currentVNode);
            }
            return currentVNode.directive;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemParentNode 
         * @param {*} vNode 
         */
        function renderDOM$4 (vo, elemParentNode, vNode) {
            var childNodes = vNode.childNodes;
            var elemNode;
            var currentVNode;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                currentVNode = childNodes[i];
                if (currentVNode.isDirective) {
                    renderDirective(vo, elemParentNode, currentVNode);
                } else {
                    elemNode = renderDOM$3(vo, elemParentNode, childNodes[i]);
                    renderDOM$4(vo, elemNode, childNodes[i]);
                }
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} dom 
         */
        function renderDOM$5 (vo, dom) {
            var $elem = query(vo.elem);
            var pn = $elem.parentNode;
            if (pn) {
                insertBefore(pn, dom, $elem);
                removeChild(pn, $elem);
            }
        }

        /**
         * 
         * @param {*} vo 
         */
        function afterRenderDOM (vo) {

        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} eventType 
         * @param {*} listener 
         */
        function addEventListener$3 (vo, elemNode, eventType, listener) {
            if (global.attachEvent) {
                elemNode.attachEvent(eventType, listener);
            } else {
                elemNode.addEventListener(eventType, listener);
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} eventType 
         * @param {*} listener 
         */
        function addEventListener (vo, elemNode, eventType, listener) {
            elemNode.addEventListener(eventType, vo.$methods[listener]);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} eventType 
         * @param {*} listener 
         */
        function addEventListener$2 (vo, elemNode, eventType, listener) {
            elemNode.addEventListener(eventType, listener);
        }

        /**
         * 
         * @param {*} attrName 
         */
        function getVoEventType (attrName) {
            return attrName.substring(EVENT_ATTR_PREFIX.length);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} attrName 
         * @param {*} attrValue 
         */
        function setAttributeWarpper (vo, elemNode, attrName, attrValue) {
            if (isVoDirective(attrName)) {
                handleDirectives$Attr(vo, elemNode, attrName, attrValue);
            } else {
                setAttribute(elemNode, attrName, attrValue);
            }
        }

        /**
         * 
         * @param {*} elemNode 
         * @param {*} type 
         */
        function trigger (elemNode, type) {
            var event = document.createEvent("HTMLEvents");
            event.initEvent(type, true, true);
            elemNode.dispatchEvent(event);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} attrName 
         * @param {*} attrValue 
         */
        function handleDirectives$Attr (vo, elemNode, attrName, attrValue) {
            if (isVoModelDirective(attrName)) {
                handleModelDirective$Attr(vo, elemNode, attrName, attrValue);
            } else if (isVoEventDirectivePrefix(attrName)) {
                handleEventDirective$Attr(vo, elemNode, attrName, attrValue);    
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} attrName 
         * @param {*} attrValue 
         */
        function handleModelDirective$Attr (vo, elemNode, attrName, attrValue) {
            elemNode.value = vo.$responseGetterProxy(attrValue);
            if (elemNode.nodeName === "INPUT") {
                var listener = $bind(function(attrValue) {
                    this.$responseSetterProxy(attrValue, elemNode.value);
                }, vo);
                addEventListener$2(vo, elemNode, "input", function() {
                    listener(attrValue);
                });
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} elemNode 
         * @param {*} attrName 
         * @param {*} attrValue 
         */
        function handleEventDirective$Attr (vo, elemNode, attrName, attrValue) {
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
         * EventEmitter
         */
        function EventEmitter () {
            if (!(this instanceof EventEmitter)) {
                return new EventEmitter();
            }
            this.events = {};
        };

        /**
         * on
         */
        EventEmitter.prototype.on = function (type, handler) {
            this.events[type] = {
                handler: handler,
                once: false
            };
        }

        /**
         * 
         */
        EventEmitter.prototype.once = function (type, handler) {
            this.events[type] = {
                handler: handler,
                once: true
            };
        }

        /**
         * off
         */
        EventEmitter.prototype.off = function (type) {
            if (!type) {
                this.events = {};
                return;
            }
            this.events[type] = void (0);
        }

        /**
         * emit
         */
        EventEmitter.prototype.emit = function (type) {
            var handlerObj = this.events[type];
            if (isObject(handlerObj)) {
                if (isFunction(handlerObj.handler)) {
                    handlerObj.handler();
                    if (handlerObj.once) {
                        this.off(type);
                    }
                }
            }
        }

        return {
            EventEmitter: EventEmitter
        };
    })();

    var compiler = (function () {
        var preWhiteSpaceCharRE = /^(\s*).*/gm;
        var postWhiteSpaceCharRE = /.*\s*$/gm;

        /**
         * 
         * @param {*} last 
         * @param {*} advanceSteps 
         */
        function advance (last, advanceSteps) {
            last = last.substring(advanceSteps);
            return last;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} nodeName 
         * @param {*} last 
         */
        function parse (vo, nodeName, last) {
            var stack = [];
            // parseWhiteSpaceChar(vo, last, preWhiteSpaceCharRE, stack);
            parseChar(vo, nodeName, last, stack);
            var templateFnBody = makeTemplateFnBody(stack);
            var templateFn = makeFunction("vo", templateFnBody);
            return templateFn;
        }

        /**
         * 
         * @param {*} stack 
         */
        function makeTemplateFnBody (stack) {
            var templateFnBody = "\"\"";
            if (stack && stack.length) {
                templateFnBody = stack.join(" + ").trim();
            }
            templateFnBody = "with(vo) { return " + templateFnBody + ";}";
            return templateFnBody;
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} last 
         * @param {*} re 
         * @param {*} stack 
         */
        function parseWhiteSpaceChar (vo, last, re, stack) {
            var result = re.exec(last)
            if (result && result[1]) {
                var whiteSpaceChars = result[1];
                stack.push("_ts(\"" + whiteSpaceChars.trim() + "\")");
                last = advance(last, whiteSpaceChars.length);
            }
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} nodeName 
         * @param {*} last 
         * @param {*} stack 
         */
        function parseChar (vo, nodeName, last, stack) {
            var ldIndex = -1;
            var rdIndex = -1;
            var leftDelimiter = LEFT_DELIMITER;
            var rightDelimiter = RIGHT_DELIMITER;
            while (last) {
                ldIndex = last.indexOf(leftDelimiter);
                rdIndex = last.indexOf(rightDelimiter);
                if (ldIndex !== -1 && rdIndex !== -1) {
                    // var token = last.substring(0, ldIndex).trim();
                    var token = last.substring(0, ldIndex).replace(/\r/g, ONE_CHAR_STRING).replace(/\n/g, ONE_CHAR_STRING).replace(/\t/g, ONE_CHAR_STRING);
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
                    if (!hasOwn(vo, responseVar)) {
                        throw new Error("\n[vo error] Property or method `" +
                            responseVar + "` is not defined on the instance but referenced during render. \n" +
                            "Make sure to declare reactive data properties in the data option.");
                    }
                    stack.push("_ts(" + responseVar + ")");
                    last = advance(last, rdIndex + rightDelimiter.length);
                } else {
                    // last = last.trim();
                    last = last.replace(/\r/g, ONE_CHAR_STRING).replace(/\n/g, ONE_CHAR_STRING).replace(/\t/g, ONE_CHAR_STRING);
                    stack.push("_ts(\"" + last + "\")");
                    last = advance(last, last.length);
                }
                ldIndex = rdIndex = -1;
            }
        }

        /**
         * 
         * @param {*} vo 
         */
        function compile$1 (vo) {
            compile$2(vo, vo.$vRootNode);
        }

        /**
         * 
         * @param {*} vo 
         * @param {*} node 
         */
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

        /**
         * 
         * @param {*} vo 
         * @param {*} node 
         */
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
    
    /**
     * 
     * @param {*} obj 
     * @param {*} key 
     * @param {*} value 
     * @param {*} config 
     */
    function registResponse (obj, key, value, config) {
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
                var oldValue = getter ? getter.call(obj) : value;
                if (newValue === oldValue || (newValue !== newValue && oldValue !== oldValue)) {
                    return;
                }
                if (setter) {
                    setter.call(obj, newValue);
                } else {
                    value = newValue;
                }
                var vo = config.vo;
                if (isObject(oldValue) && isObject(newValue)) {
                    mount$data$4(vo, obj[key], key);
                }
                obj.$observer.publish(vo, config.$sub.uuid);
            }
        });
    }

    /**
     * 
     * @param {*} key 
     * @param {*} value 
     */
    function responseSetterProxy (key, value) {
        if (!isNull(key) && !isUndefined(key)) {
            var vo = this;
            var keyArr = key.split(".");
            var obj = vo;
            var len = keyArr.length;
            for (var i = 0; i < (len - 1); i++) {
                obj = obj[keyArr[i]];
            }
            obj[keyArr[len - 1]] = value;
        }
    }

    /**
     * 
     * @param {*} key 
     */
    function responseGetterProxy (key) {
        if (!isNull(key) && !isUndefined(key)) {
            var vo = this;
            var keyArr = key.split(".");
            var obj = vo;
            for (var i = 0, len = keyArr.length; i < len; i++) {
                obj = obj[keyArr[i]];
            }
            return obj;
        }
    }

    function poll () {
        var vo = this;
        var prePollQueue = []
        var pollQueue = [];
        var postPollQueue = []
        var maxPollLength = 10;
        var asyncFn;
        var pending = true;

        /**
         * 
         * @param {*} cbObj 
         * @param {*} which 
         */
        function enPollQueue (cbObj, which) {
            which = which || 0;
            switch (which) {
                case -1:
                    prePollQueue.push(cbObj);
                    break;
                case 0:
                    pollQueue.push(cbObj);
                    break;
                case 1:
                    postPollQueue.push(cbObj);
                    break;
                default:
                    break;
            }
        }

        /**
         * pollLength
         */
        function pollLength () {
            return pollQueue.length;
        }

        /**
         * maxPollLengthWarn
         */
        function maxPollLengthWarn () {
            warn("The pollQueue'length more than the maxPolllength of pollQueue, now.");
        }

        if (!isUndefined(Promise) && isNative(Promise)) {          
            var promise = Promise.resolve();
            asyncFn = function () {
                promise.then(nextPollHandler, error).catch(error);
            }
        } else {
            asyncFn = function () {
                setTimeout(nextPollHandler, 0);
            };
        }

        pending = false;

        function execute(vo) {
            executePreCallbacks(vo);
            executePollCallbacks(vo);
            executePostCallbacks(vo);
        }

        function executeCallbacks (queue) {
            var cbs = slice.call(queue);
            queue.length = 0;
            var cbObj;
            for (var i = 0, len = cbs.length; i < len; i++) {
                cbObj = cbs[i];
                cbObj.callback();
            }
        }

        function executePollCallbacks (vo) {
            executeCallbacks(pollQueue);
        }

        function executePreCallbacks (vo) {
            executeCallbacks(prePollQueue);
        }

        function executePostCallbacks (vo) {
            enPollQueue({
                "callback": function () {
                    vdom.patch(vo, vo.$vRootNode);
                }
            }, 1);
            executeCallbacks(postPollQueue);
        }

        /**
        * 
        * @param {*} callback 
        * @param {*} which 
        */
        function nextPollHandler (callback, which) {
            pending = true;
            if (maxPollLength < pollLength()) {
                maxPollLengthWarn();
            }
            if (isFunction(callback)) {
                enPollQueue({"callback": callback}, which);
            }
            execute(vo);
            pending = false;
        }

        /**
         * 
         * @param {*} callback 
         * @param {*} ctx 
         */
        function nextPoll (callback, ctx, which) {
            which = which || 0;
            if (isFunction(callback)) {
                enPollQueue({"callback": $bind(callback, ctx)}, which);
            }
            if(!pending) {
                asyncFn();
            }
        }

        return nextPoll;
    };

    /**
     * 
     * @param {*} options 
     */
    function Vo (options) {
        if (!(this instanceof Vo)) {
            warn("please use `new` keyword to create Vo object.");
            return new Vo(options);
        }
        init$1(this, options);
    }

    initMixin$2();

    /**
     * 
     * @param {*} vo 
     */
    function initMinin$1 (vo) {
        vo.$cache = cache();
        vo.$nextPoll = $bind(poll, vo)();
        vdom.beforeCreateVDOM(vo);
        vdom.createVDOM$1(vo);
        vdom.afterCreateVDOM(vo);
        render.renderDOM$1(vo);
    }

    /**
     * 
     * @param {*} options 
     */
    function init$1 (vo, options) {
        if (!isObject(options)) {
            return;
        }
        if (!hasOwn(options, "elem") || !options.elem) {
            warn("Vo must has elem.");
            return;
        }
        mount$1(vo, options);
        initMinin$1(vo);
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} options 
     */
    function mount$1 (vo, options) {
        mount$2(vo, options);
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} options 
     */
    function mount$2 (vo, options) {
        mount$moitor(vo, options);
        mount$data(vo, options);
        mount$method(vo, options);
        extend(vo, options);
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} options 
     */
    function mount$moitor (vo, options) {
        defProperty(vo, "$monitors", {});
        extend(vo.$monitors, options.monitors);
        delete options.monitors
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} options 
     */
    function mount$data (vo, options) {
        extend(vo, options.data);
        vo.$observer = new observer.Observer(vo);
        mount$data$2(vo, options.data);
        delete options.data;
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} data 
     * @param {*} host 
     */
    function mount$data$2 (vo, data, host) {
        if (isObject(data)) {
            host = (host || vo);
            var key;
            for (key in data) {
                mount$data$3(vo, host, key, key);
            }
        }
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} host 
     * @param {*} key 
     * @param {*} monitorName 
     */
    function mount$data$3 (vo, host, key, monitorName) {
        var sub0 = addSubAndGet(vo, host, key, monitorName);
        commonRegistResponse(host, key, host[key], {
            vo: vo,
            $sub: sub0
        });
        mount$data$4(vo, host[key], monitorName);
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} value 
     * @param {*} monitorName 
     */
    function mount$data$4 (vo, value, monitorName) {
        if (isObject(value)) {
            value.$observer = new observer.Observer(vo);
            var k;
            for (k in value) {
                if (k === "$observer") {
                    continue;
                }
                if (isObject(value[k])) {
                    mount$data$3(vo, value, k, assembleMonitorName(monitorName, k));
                } else {
                    var sub = addSubAndGet(vo, value, k, assembleMonitorName(monitorName, k));
                    commonRegistResponse(value, k, value[k], {
                        vo: vo,
                        $sub: sub
                    });
                }
            }
        }
    }

    /**
     * 
     * @param {*} parentPath 
     * @param {*} childPath 
     */
    function assembleMonitorName (parentPath, childPath) {
        if (!parentPath) {
            return "";
        }
        if (childPath) {
            return parentPath + "." + childPath;
        }
        return parentPath;
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} monitorName 
     */
    function assembleMonitor (vo, monitorName) {
        var monitorConfig = vo.$monitors[monitorName];
        if (isObject(monitorConfig)) {
            monitorConfig.monitorName = monitorName;
        } else if (isFunction(monitorConfig)) {
            monitorConfig = {
                "fn": monitorConfig,
                "monitorName": monitorName
            }
        }
        return monitorConfig;
    }

    /**
     * 
     * @param {*} obj 
     * @param {*} key 
     * @param {*} value 
     * @param {*} config 
     */
    function commonRegistResponse (obj, key, value, config) {
        registResponse(obj, key, obj[key], config);
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} host 
     * @param {*} key 
     * @param {*} monitorName 
     */
    function addSubAndGet (vo, host, key, monitorName) {
        var sub = new observer.Subject(vo, _toString(key), assembleMonitor(vo, monitorName));
        host.$observer.addSub(sub);
        return sub;
    }

    /**
     * 
     * @param {*} vo 
     * @param {*} options 
     */
    function mount$method (vo, options) {
        defProperty(vo, "$methods", {});
        var key;
        for (key in options.methods) {
            defProperty(vo.$methods, key, $bind(options.methods[key], vo));
        }
        delete options.methods;
    }

    /**
     * initMixin$2
     */
    function initMixin$2 () {
        extend(Vo.prototype, {
            version: "1.0.0",
            _ts: _toString,
            $responseSetterProxy: responseSetterProxy,
            $responseGetterProxy: responseGetterProxy,
            $emitter: new events.EventEmitter()
        });
    }

    return Vo;
}));