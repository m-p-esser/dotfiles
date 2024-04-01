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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const webview_1 = require("./webview");
function activate(context) {
    const cmd = "jsoncrack-vscode.start";
    const init = () => initJsonCrack(context);
    const disposable = vscode.commands.registerCommand(cmd, init);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function initJsonCrack(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const panel = (0, webview_1.createWebviewPanel)(context);
        const editor = vscode.window.activeTextEditor;
        const onReceiveMessage = panel.webview.onDidReceiveMessage((e) => {
            if (e === "ready") {
                panel.webview.postMessage({
                    json: editor === null || editor === void 0 ? void 0 : editor.document.getText(),
                });
            }
        });
        const onTextChange = vscode.workspace.onDidChangeTextDocument((changeEvent) => {
            if (changeEvent.document === (editor === null || editor === void 0 ? void 0 : editor.document)) {
                panel.webview.postMessage({
                    json: changeEvent.document.getText(),
                });
            }
        });
        const disposer = () => {
            onTextChange.dispose();
            onReceiveMessage.dispose();
        };
        panel.onDidDispose(disposer, null, context.subscriptions);
    });
}
// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map