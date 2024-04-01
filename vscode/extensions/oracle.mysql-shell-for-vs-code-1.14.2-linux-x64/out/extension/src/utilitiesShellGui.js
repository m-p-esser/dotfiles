"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openSqlEditorSessionAndConnection = exports.openSqlEditorConnection = void 0;
const anser_1 = __importDefault(require("anser"));
const vscode_1 = require("vscode");
const Protocol_1 = require("../../frontend/src/communication/Protocol");
const isShellPromptResult = (response) => {
    const candidate = response;
    return candidate?.prompt !== undefined;
};
const openSqlEditorConnection = async (sqlEditor, connectionId, progress) => {
    await sqlEditor.openConnection(connectionId, undefined, (data, requestId) => {
        const result = data.result;
        if (isShellPromptResult(result)) {
            if (result.type === "password") {
                void vscode_1.window.showInputBox({ title: result.prompt, password: true }).then((value) => {
                    if (value !== undefined) {
                        void sqlEditor.sendReply(requestId, Protocol_1.ShellPromptResponseType.Ok, value);
                    }
                    else {
                        void sqlEditor.sendReply(requestId, Protocol_1.ShellPromptResponseType.Cancel, "");
                    }
                });
            }
            else if (result.prompt) {
                void vscode_1.window.showInputBox({ title: anser_1.default.ansiToText(result.prompt), password: false, value: "N" })
                    .then((value) => {
                    if (value) {
                        void sqlEditor.sendReply(requestId, Protocol_1.ShellPromptResponseType.Ok, value);
                    }
                    else {
                        void sqlEditor.sendReply(requestId, Protocol_1.ShellPromptResponseType.Cancel, "");
                    }
                });
            }
        }
        else if (progress) {
            const raw = data;
            progress(raw.requestState.msg);
        }
    });
};
exports.openSqlEditorConnection = openSqlEditorConnection;
const openSqlEditorSessionAndConnection = async (sqlEditor, connectionId, sessionName) => {
    const statusbarItem = vscode_1.window.createStatusBarItem();
    try {
        statusbarItem.text = "$(loading~spin) Starting Database Session ...";
        statusbarItem.show();
        statusbarItem.text = "$(loading~spin) Starting Database Session ...";
        await sqlEditor.startSession(String(connectionId) + sessionName);
        statusbarItem.text = "$(loading~spin) Opening Database Connection ...";
        await (0, exports.openSqlEditorConnection)(sqlEditor, connectionId, (message) => {
            statusbarItem.text = "$(loading~spin) " + message;
        });
        statusbarItem.hide();
    }
    catch (error) {
        statusbarItem.hide();
        await sqlEditor.closeSession();
        throw new Error("A error occurred when trying to open the database connection. " +
            `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.openSqlEditorSessionAndConnection = openSqlEditorSessionAndConnection;
//# sourceMappingURL=utilitiesShellGui.js.map