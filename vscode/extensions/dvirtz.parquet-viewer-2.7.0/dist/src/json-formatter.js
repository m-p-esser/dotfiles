"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFormatter = void 0;
const formatter_1 = require("./formatter");
const settings_1 = require("./settings");
class JsonFormatter extends formatter_1.Formatter {
    format(lines) {
        return __asyncGenerator(this, arguments, function* format_1() {
            if ((0, settings_1.jsonAsArray)()) {
                yield __await(yield* __asyncDelegator(__asyncValues(this.arrayLines(lines))));
            }
            else {
                yield __await(yield* __asyncDelegator(__asyncValues(this.generateRows(lines))));
            }
        });
    }
    arrayLines(lines) {
        return __asyncGenerator(this, arguments, function* arrayLines_1() {
            yield yield __await(`[`);
            const rows = this.generateRows(lines);
            let current = yield __await(rows.next());
            if (!current.done) {
                let next = yield __await(rows.next());
                while (!next.done) {
                    if (next.value) {
                        yield yield __await(`${current.value},`);
                    }
                    current = next;
                    next = yield __await(rows.next());
                }
            }
            if (current.value) {
                yield yield __await(current.value);
            }
            yield yield __await(`]`);
        });
    }
    format_error(message) {
        return JSON.stringify({ error: message });
    }
    generateRows(lines) {
        return __asyncGenerator(this, arguments, function* generateRows_1() {
            var _a, e_1, _b, _c;
            try {
                for (var _d = true, lines_1 = __asyncValues(lines), lines_1_1; lines_1_1 = yield __await(lines_1.next()), _a = lines_1_1.done, !_a;) {
                    _c = lines_1_1.value;
                    _d = false;
                    try {
                        const line = _c;
                        yield yield __await(JSON.stringify(line, (key, value) => {
                            return typeof value === 'bigint'
                                ? this.bigIntToJson(value)
                                : value; // return everything else unchanged
                        }, (0, settings_1.jsonSpace)()));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = lines_1.return)) yield __await(_b.call(lines_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    bigIntToJson(value) {
        // serialize as a number if it's in bounds, otherwise as a string
        if (value <= BigInt(Number.MAX_SAFE_INTEGER) && value >= BigInt(Number.MIN_SAFE_INTEGER)) {
            return Number(value);
        }
        return value.toString();
    }
}
exports.JsonFormatter = JsonFormatter;
//# sourceMappingURL=json-formatter.js.map