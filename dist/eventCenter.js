"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var EventCenter = function () {
    function EventCenter() {
        _classCallCheck(this, EventCenter);

        this.throttleTimer = null, this.eventCallback = {}, this.eventListener = {}, instance = this;
    }

    _createClass(EventCenter, [{
        key: "getEventCallback",
        value: function getEventCallback() {
            for (var key in this.eventCallback) {
                console.info("---- Event name", n);
                if (this.eventCallback[key] && _typeof(this.eventCallback[key]) === "object") {
                    for (var key in this.eventCallback[key]) {
                        console.info("---- Event id", key);
                    }
                }
            }
        }
    }, {
        key: "throttleWrap",
        value: function throttleWrap(cb) {
            var _this = this;

            if (!this.throttleTimer) {
                this.throttleTimer = setTimeout(function () {
                    _this.throttleTimer = null;
                    clearTimeout(_this.throttleTimer);
                    cb && cb();
                }, 500);
            }
        }
    }, {
        key: "addResizeEvent",
        value: function addResizeEvent(id, cb) {
            var that = this;
            this.addEventListener('resize', id, cb);

            var resizeFun = function resizeFun() {
                that.throttleWrap(function () {
                    for (var key in that.eventCallback['resize']) {
                        if (that.eventCallback['resize'][key]) {
                            that.eventCallback['resize'][key]();
                        }
                    }
                });
            };

            if (Object.keys(this.eventCallback['resize']).length > 0) {
                if (this.eventListener['resize']) {
                    this.resetResizeEventListener('resize');
                }
                this.eventListener['resize'] = resizeFun;
                window.addEventListener('resize', this.eventListener['resize'], true);
            }
        }
    }, {
        key: "removeResizeEvent",
        value: function removeResizeEvent(id) {
            if (this.eventCallback['resize'] && this.eventCallback['resize'][id]) {
                delete this.eventCallback['resize'][id];

                if (Object.keys(this.eventCallback['resize']).length === 0) {
                    this.removeEventListener('resize');
                }
            }
        }
    }, {
        key: "addEventListener",
        value: function addEventListener(type, id, cb) {
            if (this.eventCallback[type] === undefined) {
                this.this.eventCallback[type] = {};
            }
            this.eventCallback[type][id] = cb;
        }
    }, {
        key: "emitEvent",
        value: function emitEvent(type, data) {
            for (var key in this.eventCallback[type]) {
                if (this.eventCallback[type][key]) {
                    this.eventCallback[type][key](data);
                }
            }
        }
    }, {
        key: "emitEventById",
        value: function emitEventById(type, id, data) {
            if (this.eventCallback[type]) {
                if (this.eventCallback[type][id]) {
                    this.eventCallback[type][id](data);
                } else {
                    console.warn("eventCenter Error: emitEventById eventCallback[" + type + "][" + id + "] is not exist");
                }
            } else {
                console.warn("eventCenter Error: emitEventById eventCallback[" + type + "] is not exist");
            }
        }

        // 根据id移除事件

    }, {
        key: "removeEvent",
        value: function removeEvent(type, id) {
            if (this.eventCallback[type] && this.eventCallback[type][id]) {
                delete this.eventCallback[type][id];

                if (Object.keys(this.eventCallback[type]).length === 0) {
                    this.removeEventListener(type);
                }
            }
        }

        // 移除事件监听器

    }, {
        key: "removeEventListener",
        value: function removeEventListener(type) {
            if (this.eventListener[type]) {
                if (type === 'resize') {
                    window.removeEventListener('resize', this.eventListener['resize'], true);
                }
                delete this.eventCallback[type];
            }
        }
    }, {
        key: "resetResizeEventListener",
        value: function resetResizeEventListener() {
            window.removeEventListener('resize', this.eventListener['resize'], true);
        }
    }]);

    return EventCenter;
}();

function getInstance() {
    if (!instance) {
        instance = new EventCenter();
    }

    return instance;
}

exports.default = getInstance;