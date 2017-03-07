var uitls = require('./utils');
var uuid = 1;

function Subject (vo, subName, observe) {
    if (!(this instanceof Subject)) {
        return new Subject(subName, observe);
    }
    this.uuid = uuid++;
    this.vo = vo;
    this.subName = subName;
    this.observe = observe;
}

Subject.prototype.registObserve = function (observe) {
    if (!(observe instanceof Observe)) {
        return;
    }
    this.observe = observe;
}

Subject.prototype.removeObserve = function () {
    this.observe = null;
}

Subject.prototype.notify = function (vo) {
    this.observe.update(vo, this.subName);
}

function Observe (vo) {
    if (!(this instanceof Observe)) {
        return new Observe(vo);
    }
    this.uuid = uuid++;
    this.vo = vo;
}

Observe.prototype.update = function (vo, subName) {
    var vRootNode = vo.$vRootNode;
    vo.compile$1(vo, vRootNode, subName);
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
    Observe: Observe,
    Subject: Subject,
    Observer: Observer
};