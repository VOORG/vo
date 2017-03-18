var utils = require('./utils');
var constants = require('./constants');

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

module.exports = {
    parse: parse,
    compile$1: compile$1,
    compile$2: compile$2
};