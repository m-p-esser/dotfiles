"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParquetBackend = void 0;
const logger_1 = require("../logger");
const parquet_tools_backend_1 = require("./parquet-tools-backend");
const parquets_backend_1 = require("./parquets-backend");
const parquet_wasm_backend_1 = require("./parquet-wasm-backend");
const arrow_cpp_backend_1 = require("./arrow-cpp-backend");
function createParquetBackend(backend) {
    (0, logger_1.getLogger)().info(`using ${backend} backend`);
    switch (backend) {
        case 'parquet-tools':
            return new parquet_tools_backend_1.ParquetToolsBackend;
        case 'parquets':
            return new parquets_backend_1.ParquetsBackend;
        case 'arrow':
            return new arrow_cpp_backend_1.ArrowCppBackend;
        case 'parquet-wasm':
            return new parquet_wasm_backend_1.ParquetWasmBackend;
    }
}
exports.createParquetBackend = createParquetBackend;
//# sourceMappingURL=parquet-backend-factory.js.map