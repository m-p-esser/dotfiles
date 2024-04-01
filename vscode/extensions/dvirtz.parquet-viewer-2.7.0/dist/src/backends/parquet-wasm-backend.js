"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetWasmBackend = void 0;
const apache_arrow_1 = require("apache-arrow");
const arrow1_1 = require("parquet-wasm/node/arrow1");
const fs_1 = require("fs");
const arrow_backend_1 = require("./arrow-backend");
class ParquetWasmBackend extends arrow_backend_1.ArrowBackend {
    readParquet(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = new Uint8Array(yield fs_1.promises.readFile(path));
            const stream = (0, arrow1_1.readParquet)(data);
            return apache_arrow_1.AsyncRecordBatchStreamReader.from(stream.intoIPCStream());
        });
    }
}
exports.ParquetWasmBackend = ParquetWasmBackend;
//# sourceMappingURL=parquet-wasm-backend.js.map