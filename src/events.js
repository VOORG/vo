var uitls = require('./utils');
var uuid = 1;

/**
 * eventBus
 */
function EventBus () {
    if (!(this instanceof EventBus)) {
        return new EventBus();
    }
    this.events = {};
};

EventBus.prototype.on = function (type, handler) {
    var list = this.events[type] || (this.events[type] = []);
    list.push(handler);
}

EventBus.prototype.off = function (type, handler) {
    if (!(type || handler)) {
        this.events = {};
        return;
    }
    var handlers = this.events[type];
    if (handlers) {
        if (handler) {
            for (var i = 0, l = handlers.length; i < l; i++) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
        else {
            this.events[type] = [];
        }
    }
}

EventBus.prototype.emit = function (type) {
    var handlers = this.events[type];
    if (handlers) {
        var args = uitls.slice.call(arguments, 1);
        var copiedHandlers = slice.call(handlers);
        for (var i = 0, l = copiedHandlers.length; i < l; i++) {
            copiedHandlers[i](args);
        }
    }
}

module.exports = {
    EventBus: EventBus
};