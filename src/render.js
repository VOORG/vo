var compiler = require('./compiler');
var utils = require('./utils');

function beforeRenderDOM(vo) {
    // vo.$observer.publish(vo);
    compiler.compile$1(vo);
}

function renderDOM$1(vo) {
    beforeRenderDOM(vo);
    var dom = renderDOM$2(vo);
    renderDOM$5(vo, dom);
    afterRenderDOM(vo);
}


function renderDOM$2(vo) {
    var rootNode = vo.$vRootNode;
    var dom = renderDOM$3(vo, void(0), rootNode);
    renderDOM$4(vo, dom, rootNode);
    return dom;
}

function renderDOM$3(vo, parentNode, node) {
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

function renderDOM$4(vo, parentNode, node) {
    var childNodes = node.childNodes;
    var targetNode;
    for (var i = 0, l = childNodes.length; i < l; i++) {
        targetNode = renderDOM$3(vo, parentNode, childNodes[i]);
        renderDOM$4(vo, targetNode, childNodes[i]);
    }
}

function renderDOM$5(vo, dom) {
    var $elem = utils.query(vo.elem);
    var pn = $elem.parentNode;
    if (pn) {
        utils.insertBefore(pn, dom, $elem);
        utils.removeChild(pn, $elem);
    }
}

function afterRenderDOM(vo) {

}

module.exports = {
    renderDOM$1: renderDOM$1
}