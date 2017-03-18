var compiler = require('./compiler');
var utils = require('./utils');
var constants = require('./constants');

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
                setAttributeWarpper(vo, elemNode, attributeMap[i]['attrName'], attributeMap[i]['attrValue']);
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

module.exports = {
    renderDOM$1: renderDOM$1
}