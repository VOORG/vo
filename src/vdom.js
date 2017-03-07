var utils = require('./utils');
var compiler = require('./compiler');
var constants = require('./constants');

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