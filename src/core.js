/*
 * created by mawei 2017.02.05
 */

"use strict";
var uuid = 1;

var utils = require('./utils');
var cache = utils.cache();
var browser = require('./browser');
var op = require('./op');
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