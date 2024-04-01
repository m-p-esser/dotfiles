"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
class Stack extends Array {
    get empty() {
        return this.length === 0;
    }
    get top() {
        if (!this.empty) {
            return this[this.length - 1];
        }
        return undefined;
    }
}
exports.Stack = Stack;
//# sourceMappingURL=Stack.js.map