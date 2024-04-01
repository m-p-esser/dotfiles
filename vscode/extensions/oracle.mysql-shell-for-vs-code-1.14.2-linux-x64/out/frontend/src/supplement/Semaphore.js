"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
class Semaphore {
    #waiters = [];
    wait(timeout) {
        const waiter = { timeout: null, resolve: () => { } };
        this.#waiters.push(waiter);
        const promise = new Promise((resolve) => {
            let resolved = false;
            waiter.resolve = (noRemove, value) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                if (waiter.timeout) {
                    clearTimeout(waiter.timeout);
                    waiter.timeout = null;
                }
                if (!noRemove) {
                    const pos = this.#waiters.indexOf(waiter);
                    if (pos > -1) {
                        this.#waiters.splice(pos, 1);
                    }
                }
                if (value === undefined) {
                    resolve(true);
                }
                else {
                    resolve(value);
                }
            };
        });
        if (timeout !== undefined && timeout > 0 && isFinite(timeout)) {
            waiter.timeout = setTimeout(() => {
                waiter.timeout = null;
                waiter.resolve(false);
            }, timeout);
        }
        return promise;
    }
    notify(value) {
        const waiter = this.#waiters.pop();
        waiter?.resolve(true, value);
    }
    notifyAll(value) {
        const list = this.#waiters.reverse();
        this.#waiters = [];
        let waiter;
        while ((waiter = list.pop()) !== undefined) {
            waiter.resolve(true, value);
        }
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=Semaphore.js.map