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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const os = __importStar(require("os"));
const fs_1 = require("fs");
const logger_1 = require("./logger");
const parquet_backend_factory_1 = require("./backends/parquet-backend-factory");
const settings_1 = require("./settings");
const formatter_factory_1 = require("./formatter-factory");
class ParquetDocument {
    constructor(uri, emitter) {
        this._lines = [];
        this._disposables = [];
        this._lastMod = 0;
        this._backend = (0, parquet_backend_factory_1.createParquetBackend)((0, settings_1.backend)());
        this._formatter = (0, formatter_factory_1.createFormatter)();
        this._uri = uri;
        this._emitter = emitter;
        this._parquetPath = this._uri.fsPath.replace(/\.as\.json$/, '');
        const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(this._parquetPath, "*"));
        this._disposables.push(watcher);
        this._disposables.push(watcher.onDidChange(this.tryPopulate.bind(this)));
        this._disposables.push(watcher.onDidCreate(this.tryPopulate.bind(this)));
    }
    dispose() {
        for (const disposable of this._disposables) {
            disposable.dispose();
        }
    }
    static create(uri, emitter) {
        return __awaiter(this, void 0, void 0, function* () {
            const parquet = new ParquetDocument(uri, emitter);
            yield parquet.tryPopulate();
            return parquet;
        });
    }
    get value() {
        return `${this._lines.join(os.EOL)}${os.EOL}`;
    }
    tryPopulate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.populate();
            }
            catch (error) {
                const message = `while reading ${this._parquetPath}: ${error}`;
                (0, logger_1.getLogger)().error(message);
                void vscode.window.showErrorMessage(message);
                this._lines.push(this._formatter.format_error(message));
            }
        });
    }
    populate() {
        return __awaiter(this, void 0, void 0, function* () {
            // protect against onCreate firing right after create
            const { mtimeMs } = yield fs_1.promises.stat(this._parquetPath);
            if (mtimeMs == this._lastMod) {
                (0, logger_1.getLogger)().debug("skipping populate() as modification timestamp hasn't changed");
                return;
            }
            this._lastMod = mtimeMs;
            const lines = [];
            const encoder = new TextEncoder();
            const FILE_SIZE_MB_LIMIT = 50;
            const limitExceededMsg = JSON.stringify({ warning: `file size exceeds ${FILE_SIZE_MB_LIMIT}MB limit` });
            let totalByteLength = encoder.encode(limitExceededMsg).byteLength;
            yield vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `opening ${path.basename(this._parquetPath)}`,
                cancellable: true
            }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                try {
                    for (var _d = true, _e = __asyncValues(this._formatter.format(this._backend.generateRows(this._parquetPath, token))), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const line = _c;
                            const lineByteLength = encoder.encode(`${line}${os.EOL}`).byteLength;
                            totalByteLength += lineByteLength;
                            if (totalByteLength >= FILE_SIZE_MB_LIMIT * 1024 * 1024) {
                                lines.push(limitExceededMsg);
                                break;
                            }
                            lines.push(line);
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }));
            if (lines != this._lines) {
                this._lines = lines;
                this._emitter.fire(this._uri);
            }
        });
    }
}
exports.default = ParquetDocument;
//# sourceMappingURL=parquet-document.js.map