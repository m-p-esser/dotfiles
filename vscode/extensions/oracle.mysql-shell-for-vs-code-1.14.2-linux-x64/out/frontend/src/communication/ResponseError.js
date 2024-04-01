"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseError = void 0;
class ResponseError extends Error {
    info;
    constructor(info) {
        super(info.requestState.msg);
        this.info = info;
    }
}
exports.ResponseError = ResponseError;
//# sourceMappingURL=ResponseError.js.map