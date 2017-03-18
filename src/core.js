/*
 * created by mawei 2017.02.05
 */

"use strict";
var uuid = 1;

var utils = require('./utils');
var cache = utils.cache();
var browser = require('./browser');
var observer = require('./observer');
var vdom = require('./vdom');
var render = require('./render');

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
function init$1 (options) {
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
    utils.defProperty(vo, '$monitors', {});
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
    utils.defProperty(vo, '$methods', {});
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
        version: '1.0.0',
        init$1: init$1,
        _ts: utils._toString,
        $responseSetterProxy: responseSetterProxy,
        $responseGetterProxy: responseGetterProxy
    });
    Vo.prototype.utils = utils;
}

module.exports = Vo;