class EventBus {
    constructor() {
        this.eventList = {};
    }

    listen(event, callback, once = false) {
        // if no events so far, create it.
        if (!this.eventList[event]) {
            this.eventList[event] = [];
        }
        this.addEvent(event, callback, once);
        return true;
    }

    addEvent(event, callback, once) {
        this.eventList[event].push({
            callback,
            once,
        });
    }

    ignore(event) {
        delete this.eventList[event];
    }

    once(event, callback) {
        this.listen(event, callback, true);
    }

    dispatch(event, payload = {}) {
        if (typeof this.eventList[event] === 'undefined'
            || typeof this.eventList[event] !== 'object'
        ) {
            return false;
        }

        this.eventList[event].forEach(listener => listener.callback(payload));

        // remove once methods.
        this.eventList[event] = this.eventList[event].filter(listener => !listener.once);
        return true;
    }
}

const eventBus = new EventBus();

export default eventBus;
