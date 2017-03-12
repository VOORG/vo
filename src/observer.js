var utils = require('./utils');
var compiler = require('./compiler');
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
            if (uuid === subs[i]['uuid']) {
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
            if (uuid === subs[i]['uuid']) {
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

module.exports = {
    Monitor: Monitor,
    Subject: Subject,
    Observer: Observer
};