let instance = null;

class EventCenter {
    constructor() {
        if (!instance) {
            this.throttleTimer = null;
            this.eventCallback = {};
            this.eventListener = {};
            instance = this;
        }
        return instance;
    }

    getEventCallback() {
        for (var key in this.eventCallback) {
            console.info("---- Event name", key);
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

    // 根据id触发事件
    emitEvent(type, data) {
        if (this.eventListener[type]) {
            this.eventListener[type](data);
        }
    }

    // 触发事件
    emitEventById(type, id, data) {
        if (this.eventCallback[type]) {
            if (this.eventCallback[type][id]) {
                this.eventCallback[type][id](data);
            } else {
                console.warn("eventCenter Error: emitEventById eventCallback[" + type + "][" + id + "] is not exist")
            }
        } else {
            console.warn("eventCenter Error: emitEventById eventCallback[" + type + "] is not exist")
        }
    }

    addResizeEvent(id ,cb) {
        this.addEventListener('resize', id, cb);

        let resizeFun = () => {
            this.throttleWrap(() => {
                for (const key in this.eventCallback['resize']) {
                    if (this.eventCallback['resize'][key]) {
                        this.eventCallback['resize'][key]();
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

    // 添加事件
    addEventListener(type, id, cb) {
        if (this.eventCallback[type] === undefined) {
            this.eventCallback[type] = {};
        }
        this.eventCallback[type][id] = cb;

        let eventListenerFun = (data) => {
            for (const key in this.eventCallback[type]) {
                if (this.eventCallback[type][key]) {
                    this.eventCallback[type][key](data);
                }
            }
        };

        if (Object.keys(this.eventCallback[type]).length > 0) {
            this.eventListener[type] = eventListenerFun;
        }
    }

    removeResizeEvent(id) {
        if (this.eventCallback['resize'] && this.eventCallback['resize'][id]) {
            delete this.eventCallback['resize'][id];

            if (Object.keys(this.eventCallback['resize']).length === 0) {
                this.removeEventListener('resize');
            }
        }
    }

    // 根据id移除事件
    removeEvent(type, id) {
        if (this.eventCallback[type] && this.eventCallback[type][id]) {
            delete this.eventCallback[type][id];

            if (Object.keys(this.eventCallback[type]).length === 0) {
                this.removeEventListener(type);
            }
        }
    }

    // 移除事件监听器
    removeEventListener(type) {
        if (this.eventListener[type]) {
            if (type === 'resize') {
                window.removeEventListener('resize', this.eventListener['resize'], true);
            }
            delete this.eventCallback[type];
            delete this.eventListener[type]
        }
    }

    resetResizeEventListener() {
        window.removeEventListener('resize', this.eventListener['resize'], true);
    }
}