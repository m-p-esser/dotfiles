"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
exports.ArrowBackend = void 0;
const parquet_backend_1 = require("./parquet-backend");
class ArrowBackend extends parquet_backend_1.ParquetBackend {
    generateRowsImpl(parquetPath, _token) {
        return __asyncGenerator(this, arguments, function* generateRowsImpl_1() {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            const batches = yield __await(this.readParquet(parquetPath));
            try {
                // read all records from the file and print them
                for (var _g = true, batches_1 = __asyncValues(batches), batches_1_1; batches_1_1 = yield __await(batches_1.next()), _a = batches_1_1.done, !_a;) {
                    _c = batches_1_1.value;
                    _g = false;
                    try {
                        const batch = _c;
                        try {
                            for (var _h = true, batch_1 = (e_2 = void 0, __asyncValues(batch)), batch_1_1; batch_1_1 = yield __await(batch_1.next()), _d = batch_1_1.done, !_d;) {
                                _f = batch_1_1.value;
                                _h = false;
                                try {
                                    const row = _f;
                                    yield yield __await(row);
                                }
                                finally {
                                    _h = true;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (!_h && !_d && (_e = batch_1.return)) yield __await(_e.call(batch_1));
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    finally {
                        _g = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = batches_1.return)) yield __await(_b.call(batches_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
}
exports.ArrowBackend = ArrowBackend;
//# sourceMappingURL=arrow-backend.js.map