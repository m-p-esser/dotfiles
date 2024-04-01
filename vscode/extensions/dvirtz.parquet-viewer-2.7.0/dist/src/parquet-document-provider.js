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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetTextDocumentContentProvider = void 0;
const vscode = __importStar(require("vscode"));
const parquet_document_1 = __importDefault(require("./parquet-document"));
class ParquetTextDocumentContentProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
        this._documents = new Map();
        this._subscriptions = vscode.workspace.onDidCloseTextDocument(doc => {
            var _a;
            (_a = this._documents.get(doc.uri)) === null || _a === void 0 ? void 0 : _a.dispose();
            this._documents.delete(doc.uri);
        });
    }
    dispose() {
        this._subscriptions.dispose();
        this._documents.forEach(doc => doc.dispose());
        this._documents.clear();
        this._onDidChange.dispose();
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    provideTextDocumentContent(uri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // already loaded?
            if (!this._documents.has(uri)) {
                const document = yield parquet_document_1.default.create(uri, this._onDidChange);
                this._documents.set(uri, document);
            }
            return (_a = this._documents.get(uri)) === null || _a === void 0 ? void 0 : _a.value;
        });
    }
}
exports.ParquetTextDocumentContentProvider = ParquetTextDocumentContentProvider;
//# sourceMappingURL=parquet-document-provider.js.map