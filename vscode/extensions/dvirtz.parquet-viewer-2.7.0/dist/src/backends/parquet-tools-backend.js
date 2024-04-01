"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.ParquetToolsBackend = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const assert_1 = require("assert");
const logger_1 = require("../logger");
const settings_1 = require("../settings");
const readline_1 = require("readline");
const parquet_backend_1 = require("./parquet-backend");
class ParquetToolsBackend extends parquet_backend_1.ParquetBackend {
    static spawnParquetTools(params, token) {
        return __asyncGenerator(this, arguments, function* spawnParquetTools_1() {
            var _a, e_1, _b, _c;
            const [command, ...args] = yield __await(ParquetToolsBackend.parquetToolsPath());
            (0, logger_1.getLogger)().debug(`spawning ${command} ${args.concat(params).join(' ')}`);
            const childProcess = (0, child_process_1.spawn)(command, args.concat(params));
            token === null || token === void 0 ? void 0 : token.onCancellationRequested(_ => {
                childProcess.kill();
            });
            childProcess.stdout.setEncoding('utf-8');
            try {
                for (var _d = true, _e = __asyncValues((0, readline_1.createInterface)({ input: childProcess.stdout })), _f; _f = yield __await(_e.next()), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const line = _c;
                        yield yield __await(line);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                }
                finally { if (e_1) throw e_1.error; }
            }
            let stderr = '';
            childProcess.stderr.on('data', data => stderr += data);
            const code = yield __await(new Promise((resolve, reject) => {
                childProcess.once("error", reject);
                childProcess.on("close", (code) => {
                    resolve(code);
                });
            }));
            if (!(token === null || token === void 0 ? void 0 : token.isCancellationRequested)) {
                if (code) {
                    throw new Error(`parquet-tools exited with code ${code}\n${stderr}`);
                }
            }
            return yield __await(stderr);
        });
    }
    static parquetToolsPath() {
        return __awaiter(this, void 0, void 0, function* () {
            let parquetTools = (0, settings_1.parquetTools)();
            if (!parquetTools) {
                throw Error(`illegal value for parquet-viewer.parquetToolsPath setting: ${parquetTools}`);
            }
            if (parquetTools.endsWith('.jar')) {
                if (!path.isAbsolute(parquetTools)) {
                    const files = yield vscode.workspace.findFiles(parquetTools);
                    assert_1.strict.equal(files.length, 1);
                    parquetTools = files[0].fsPath;
                }
                return [`java`, '-jar', parquetTools];
            }
            return [parquetTools];
        });
    }
    generateRowsImpl(parquetPath, token) {
        return __asyncGenerator(this, arguments, function* generateRowsImpl_1() {
            var _a, e_2, _b, _c;
            try {
                for (var _d = true, _e = __asyncValues(ParquetToolsBackend.spawnParquetTools(['cat', '-j', parquetPath], token)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const line = _c;
                        yield yield __await(JSON.parse(line));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
}
exports.ParquetToolsBackend = ParquetToolsBackend;
//# sourceMappingURL=parquet-tools-backend.js.map