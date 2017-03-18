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

module.exports = {
    beforeCreateVDOM: beforeCreateVDOM,
    createVDOM$1: createVDOM$1,
    afterCreateVDOM: afterCreateVDOM,
    VNode: VNode,
    genVDOMTree: genVDOMTree,
    patch: patch
};