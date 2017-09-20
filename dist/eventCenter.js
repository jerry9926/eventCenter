"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ecInstance = null;

var EventCenter = function () {
    function EventCenter() {
        _classCallCheck(this, EventCenter);

        if (!ecInstance) {
            this.throttleTimer = null;
            this.eventCallback = {};
            this.eventListener = {};
            ecInstance = this;
        }
        return ecInstance;
    }

    _createClass(EventCenter, [{
        key: "getEventCallback",
        value: function getEventCallback() {
            for (var key in this.eventCallback) {
                console.info("---- Event namespace", key);
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

        // 根据id触发事件

    }, {
        key: "emitEvent",
        value: function emitEvent(namespace, data) {
            if (this.eventListener[namespace]) {
                this.eventListener[namespace](data);
            }
        }

        // 触发事件

    }, {
        key: "emitEventById",
        value: function emitEventById(namespace, id, data) {
            if (this.eventCallback[namespace]) {
                if (this.eventCallback[namespace][id]) {
                    this.eventCallback[namespace][id](data);
                } else {
                    console.warn("eventCenter Error: emitEventById eventCallback[" + namespace + "][" + id + "] is not exist");
                }
            } else {
                console.warn("eventCenter Error: emitEventById eventCallback[" + namespace + "] is not exist");
            }
        }

        // 添加事件

    }, {
        key: "addEventListener",
        value: function addEventListener(namespace, id, cb) {
            var _this2 = this;

            if (this.eventCallback[namespace] === undefined) {
                this.eventCallback[namespace] = {};
            }
            this.eventCallback[namespace][id] = cb;

            var eventListenerFun = function eventListenerFun(data) {
                for (var key in _this2.eventCallback[namespace]) {
                    if (_this2.eventCallback[namespace][key]) {
                        _this2.eventCallback[namespace][key](data);
                    }
                }
            };

            if (Object.keys(this.eventCallback[namespace]).length > 0) {
                this.eventListener[namespace] = eventListenerFun;
            }
        }

        // 根据id移除事件监听器

    }, {
        key: "removeEventListener",
        value: function removeEventListener(namespace, id) {
            if (this.eventCallback[namespace] && this.eventCallback[namespace][id]) {
                delete this.eventCallback[namespace][id];

                if (Object.keys(this.eventCallback[namespace]).length === 0) {
                    this.removeEvent(namespace);
                }
            }
        }

        // 移除事件（移除该事件所有事件监听器）

    }, {
        key: "removeEvent",
        value: function removeEvent(namespace) {
            if (this.eventListener[namespace]) {
                if (namespace === 'resize') {
                    window.removeEventListener('resize', this.eventListener['resize'], true);
                }
                delete this.eventCallback[namespace];
                delete this.eventListener[namespace];
            }
        }
    }, {
        key: "addResizeEventLister",
        value: function addResizeEventLister(id, cb) {
            var _this3 = this;

            this.addEventListener(EventCenter.WINDOW_RESIZE, id, cb);

            var resizeFun = function resizeFun() {
                _this3.throttleWrap(function () {
                    for (var key in _this3.eventCallback[EventCenter.WINDOW_RESIZE]) {
                        if (_this3.eventCallback[EventCenter.WINDOW_RESIZE][key]) {
                            _this3.eventCallback[EventCenter.WINDOW_RESIZE][key]();
                        }
                    }
                });
            };

            if (Object.keys(this.eventCallback[EventCenter.WINDOW_RESIZE]).length > 0) {
                if (this.eventListener[EventCenter.WINDOW_RESIZE]) {
                    this.resetResizeEventListener(EventCenter.WINDOW_RESIZE);
                }
                this.eventListener[EventCenter.WINDOW_RESIZE] = resizeFun;
                window.addEventListener('resize', this.eventListener[EventCenter.WINDOW_RESIZE], true);
            }
        }
    }, {
        key: "removeResizeEventListener",
        value: function removeResizeEventListener(id) {
            if (this.eventCallback[EventCenter.WINDOW_RESIZE] && this.eventCallback[EventCenter.WINDOW_RESIZE][id]) {
                delete this.eventCallback[EventCenter.WINDOW_RESIZE][id];

                if (Object.keys(this.eventCallback[EventCenter.WINDOW_RESIZE]).length === 0) {
                    this.removeEvent(EventCenter.WINDOW_RESIZE);
                }
            }
        }
    }, {
        key: "removeResizeEvent",
        value: function removeResizeEvent() {
            this.removeEvent(EventCenter.WINDOW_RESIZE);
        }
    }, {
        key: "resetResizeEventListener",
        value: function resetResizeEventListener() {
            window.removeEventListener('resize', this.eventListener[EventCenter.WINDOW_RESIZE], true);
        }
    }]);

    return EventCenter;
}();

EventCenter.WINDOW_RESIZE = 'WINDOW_RESIZE';