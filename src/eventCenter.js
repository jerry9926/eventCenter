let ecInstance = null;

class EventCenter {
    constructor() {
        if (!ecInstance) {
            this.throttleTimer = null;
            this.eventCallback = {};
            this.eventListener = {};
            ecInstance = this;
        }
        return ecInstance;
    }

    getEventCallback() {
        for (var key in this.eventCallback) {
            console.info("---- Event namespace", key);
            if (this.eventCallback[key] && typeof this.eventCallback[key] === "object") {
                for (var key in this.eventCallback[key]) {
                    console.info("---- Event id", key)
                }
            }
        }
    }

    throttleWrap(cb) {
        if (!this.throttleTimer) {
            this.throttleTimer = setTimeout(() => {
                this.throttleTimer = null;
                clearTimeout(this.throttleTimer);
                cb && cb();
            }, 500);
        }
    }

    // 根据namespace触发事件
    emitEvent(namespace, data) {
        if (this.eventListener[namespace]) {
            this.eventListener[namespace](data);
        }
    }

    // 触发事件
    emitEventById(namespace, id, data) {
        if (this.eventCallback[namespace]) {
            if (this.eventCallback[namespace][id]) {
                this.eventCallback[namespace][id](data);
            } else {
                console.warn("eventCenter Error: emitEventById eventCallback[" + namespace + "][" + id + "] is not exist")
            }
        } else {
            console.warn("eventCenter Error: emitEventById eventCallback[" + namespace + "] is not exist")
        }
    }

    // 添加事件
    addEventListener(namespace, id, cb) {
        if (this.eventCallback[namespace] === undefined) {
            this.eventCallback[namespace] = {};
        }
        this.eventCallback[namespace][id] = cb;

        let eventListenerFun = (data) => {
            for (const key in this.eventCallback[namespace]) {
                if (this.eventCallback[namespace][key]) {
                    this.eventCallback[namespace][key](data);
                }
            }
        };

        if (Object.keys(this.eventCallback[namespace]).length > 0) {
            this.eventListener[namespace] = eventListenerFun;
        }
    }

    // 根据id移除事件监听器
    removeEventListener(namespace, id) {
        if (this.eventCallback[namespace] && this.eventCallback[namespace][id]) {
            delete this.eventCallback[namespace][id];

            if (Object.keys(this.eventCallback[namespace]).length === 0) {
                this.removeEvent(namespace);
            }
        }
    }

    // 移除事件（移除该事件所有事件监听器）
    removeEvent(namespace) {
        if (this.eventListener[namespace]) {
            if (namespace === 'resize') {
                window.removeEventListener('resize', this.eventListener['resize'], true);
            }
            delete this.eventCallback[namespace];
            delete this.eventListener[namespace]
        }
    }

    addResizeEventLister(id ,cb) {
        this.addEventListener(EventCenter.WINDOW_RESIZE, id, cb);

        let resizeFun = () => {
            this.throttleWrap(() => {
                for (const key in this.eventCallback[EventCenter.WINDOW_RESIZE]) {
                    if (this.eventCallback[EventCenter.WINDOW_RESIZE][key]) {
                        this.eventCallback[EventCenter.WINDOW_RESIZE][key]();
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

    removeResizeEventListener(id) {
        if (this.eventCallback[EventCenter.WINDOW_RESIZE] && this.eventCallback[EventCenter.WINDOW_RESIZE][id]) {
            delete this.eventCallback[EventCenter.WINDOW_RESIZE][id];

            if (Object.keys(this.eventCallback[EventCenter.WINDOW_RESIZE]).length === 0) {
                this.removeEvent(EventCenter.WINDOW_RESIZE);
            }
        }
    }

    removeResizeEvent() {
        this.removeEvent(EventCenter.WINDOW_RESIZE);
    }

    resetResizeEventListener() {
        window.removeEventListener('resize', this.eventListener[EventCenter.WINDOW_RESIZE], true);
    }
}

EventCenter.WINDOW_RESIZE = 'WINDOW_RESIZE';

export default EventCenter;
