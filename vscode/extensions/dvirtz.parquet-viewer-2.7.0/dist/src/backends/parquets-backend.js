"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
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
exports.ParquetsBackend = void 0;
const parquets_1 = require("@dvirtz/parquets");
const parquet_backend_1 = require("./parquet-backend");
class ParquetsBackend extends parquet_backend_1.ParquetBackend {
    generateRowsImpl(parquetPath, _token) {
        return __asyncGenerator(this, arguments, function* generateRowsImpl_1() {
            const reader = yield __await(parquets_1.ParquetReader.openFile(parquetPath));
            const cursor = reader.getCursor();
            // read all records from the file and print them
            let record = null;
            while ((record = yield __await(cursor.next()))) {
                yield yield __await(record);
            }
            yield __await(reader.close());
        });
    }
}
exports.ParquetsBackend = ParquetsBackend;
//# sourceMappingURL=parquets-backend.js.map