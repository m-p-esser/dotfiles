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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetEditorProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const util_1 = require("./util");
const dispose_1 = require("./dispose");
const parquet_document_provider_1 = require("./parquet-document-provider");
const logger_1 = require("./logger");
class CustomParquetDocument extends dispose_1.Disposable {
    constructor(uri) {
        super();
        this.uri = uri;
        this.path = uri.fsPath;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, logger_1.getLogger)().info(`opening ${this.path}.as.json`);
            yield vscode.window.showTextDocument(this.uri.with({ scheme: 'parquet', path: this.path + '.as.json' }));
        });
    }
}
class ParquetEditorProvider {
    static register(context) {
        (0, logger_1.getLogger)().info('registering ParquetEditorProvider as parquet document viewer');
        const provider = new ParquetEditorProvider;
        const providerRegistration = vscode.window.registerCustomEditorProvider(ParquetEditorProvider.viewType, provider);
        context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('parquet', new parquet_document_provider_1.ParquetTextDocumentContentProvider));
        return providerRegistration;
    }
    openCustomDocument(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return new CustomParquetDocument(uri);
        });
    }
    resolveCustomEditor(document, webviewPanel, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Setup initial content for the webview
            webviewPanel.webview.options = {
                enableScripts: true,
            };
            webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document);
            webviewPanel.webview.onDidReceiveMessage(e => this.onMessage(document, e));
            yield document.open();
        });
    }
    onMessage(document, message) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (message) {
                case 'clicked':
                    yield document.open();
                    break;
            }
        });
    }
    getHtmlForWebview(webview, document) {
        // Use a nonce to whitelist which scripts can be run
        const nonce = (0, util_1.getNonce)();
        const res = /* html */ `
<!DOCTYPE html>
<html>
  <head>
    <title>browser-amd-editor</title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'nonce-${nonce}'; img-src ${webview.cspSource}; style-src 'unsafe-inline' ${webview.cspSource};"> -->
    </head>
  <body>
    <p>Click <a href="${path.basename(document.uri.fsPath)}.as.json" id="here">here</a> to open JSON</p>
    <script nonce="${nonce}">
      //# sourceURL=to-json.js
      const vscode = acquireVsCodeApi();
      document.getElementById('here').addEventListener('click', _ => {
        vscode.postMessage('clicked');
      });
    </script>
  </body>
</html>`;
        return res;
    }
}
exports.ParquetEditorProvider = ParquetEditorProvider;
ParquetEditorProvider.viewType = 'parquetViewer.parquetViewer';
//# sourceMappingURL=parquet-editor-provider.js.map