"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookEditorProvider = void 0;
const vscode_1 = require("vscode");
const ModuleInfo_1 = require("../../../frontend/src/modules/ModuleInfo");
const Requisitions_1 = require("../../../frontend/src/supplement/Requisitions");
const ShellInterface_1 = require("../../../frontend/src/supplement/ShellInterface");
const webview_1 = require("../web-views/webview");
const Semaphore_1 = require("../../../frontend/src/supplement/Semaphore");
const promises_1 = require("fs/promises");
class NotebookEditorProvider {
    #host;
    #url;
    #requisitions;
    #connectionsAvailable = false;
    #urlReady = new Semaphore_1.Semaphore();
    #connectionsReady = new Semaphore_1.Semaphore();
    #document;
    #saving = false;
    #panel;
    #disposables = [];
    setup(host) {
        this.#host = host;
        Requisitions_1.requisitions.register("connectionsUpdated", this.handleConnectionsUpdated);
        Requisitions_1.requisitions.register("connectedToUrl", this.handleConnectToUrl);
        host.context.subscriptions.push(vscode_1.window.registerCustomEditorProvider("msg.notebook", this, {
            webviewOptions: {
                retainContextWhenHidden: true,
            },
        }));
        host.context.subscriptions.push(vscode_1.workspace.onDidDeleteFiles((event) => {
            for (const file of event.files) {
                if (file.fsPath.endsWith(".mysql-notebook")) {
                    void host.context.workspaceState.update(file.toString(), undefined);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.workspace.onDidRenameFiles((event) => {
            for (const file of event.files) {
                let usedConnectionId = -1;
                if (file.oldUri.fsPath.endsWith(".mysql-notebook")) {
                    usedConnectionId = host.context.workspaceState.get(file.oldUri.toString(), -1);
                    void host.context.workspaceState.update(file.oldUri.toString(), undefined);
                }
                if (file.newUri.fsPath.endsWith(".mysql-notebook")) {
                    void host.context.workspaceState.update(file.newUri.toString(), usedConnectionId);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.openNotebookWithConnection", (uri) => {
            if (!uri) {
                return;
            }
            void host.determineConnection(ShellInterface_1.DBType.MySQL, true).then((connection) => {
                if (connection) {
                    void vscode_1.workspace.openTextDocument(uri).then((document) => {
                        const item = connection.treeItem;
                        void vscode_1.commands.executeCommand("vscode.openWith", uri, "msg.notebook").then(() => {
                            void host.context.workspaceState.update(document.uri.toString(), item.details.id);
                            void this.showNotebookPage(item.details.id, document.getText());
                        });
                    });
                }
            });
        }));
    }
    resolveCustomTextEditor(document, webviewPanel) {
        return new Promise((resolve) => {
            void this.setupWebview(document, webviewPanel).then(() => {
                resolve();
            });
        });
    }
    showNotebookPage(connectionId, content) {
        return Promise.resolve(this.#requisitions?.executeRemote("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            {
                requestType: "showPage",
                parameter: {
                    module: ModuleInfo_1.DBEditorModuleId, page: String(connectionId), suppressAbout: true, noEditor: true,
                },
            },
            { requestType: "editorLoadNotebook", parameter: { content, standalone: true } },
        ]) ?? true);
    }
    handleConnectionsUpdated = () => {
        this.#connectionsAvailable = true;
        if (this.#document && this.#panel) {
            const connectionId = this.#host.context.workspaceState.get(this.#document.uri.toString());
            if (!this.isValidConnectionId(connectionId)) {
                if (this.#document.isDirty) {
                    void this.#document.save().then(() => {
                        this.#panel.dispose();
                        return Promise.resolve(true);
                    });
                }
                else {
                    this.#panel.dispose();
                    return Promise.resolve(true);
                }
            }
        }
        this.#connectionsReady.notifyAll();
        return Promise.resolve(true);
    };
    handleConnectToUrl = (url) => {
        if (this.#url) {
            this.#panel?.dispose();
            return Promise.resolve(true);
        }
        this.#url = url;
        this.#connectionsAvailable = false;
        this.#urlReady.notifyAll();
        return Promise.resolve(true);
    };
    async setupWebview(document, webviewPanel) {
        webviewPanel.webview.html = "<br/><h2>Loading...</h2>";
        if (!this.#url) {
            await this.#urlReady.wait();
        }
        (0, webview_1.prepareWebviewContent)(webviewPanel, this.#url);
        if (!this.#connectionsAvailable) {
            await this.#connectionsReady.wait();
        }
        let usedConnectionId = this.#host.context.workspaceState.get(document.uri.toString());
        if (!this.isValidConnectionId(usedConnectionId)) {
            usedConnectionId = undefined;
            await this.#host.context.workspaceState.update(document.uri.toString(), undefined);
        }
        if (usedConnectionId === undefined) {
            const connection = await this.#host.determineConnection(ShellInterface_1.DBType.MySQL);
            if (connection) {
                usedConnectionId = connection.treeItem.details.id;
            }
        }
        if (usedConnectionId !== undefined) {
            this.#panel = webviewPanel;
            this.#document = document;
            void this.#host.context.workspaceState.update(document.uri.toString(), usedConnectionId);
            webviewPanel.webview.options = {
                ...webviewPanel.webview.options,
                enableScripts: true,
            };
            this.#requisitions = new Requisitions_1.RequisitionHub("host");
            this.#requisitions.setRemoteTarget(webviewPanel.webview);
            this.#requisitions.register("editorChanged", async () => {
                await this.makeDocumentDirty();
                return Promise.resolve(true);
            });
            this.#requisitions.register("editorSaveNotebook", this.triggerSave);
            this.#requisitions.register("editorLoadNotebook", this.triggerLoad);
            this.#requisitions.register("applicationDidStart", () => {
                return this.showNotebookPage(usedConnectionId, document.getText());
            });
            this.#disposables.push(webviewPanel.webview.onDidReceiveMessage((message) => {
                if (message.source === "app") {
                    this.#requisitions?.handleRemoteMessage(message);
                }
            }));
            this.#disposables.push(webviewPanel.onDidChangeViewState((event) => {
                if (event.webviewPanel.active) {
                }
            }));
            this.#disposables.push(vscode_1.workspace.onWillSaveTextDocument((event) => {
                if (event.document.uri.toString() === this.#document?.uri.toString()) {
                    event.waitUntil(this.saveNotebook());
                }
            }));
            this.#disposables.push(this.#panel.onDidDispose(() => {
                this.handleDispose();
            }));
        }
        else {
            webviewPanel.webview.html = "<br/><h2>No connection selected</h2>";
        }
    }
    isValidConnectionId(connectionId) {
        return connectionId !== undefined
            && this.#host.connections.find((c) => { return c.treeItem.details.id === connectionId; }) !== undefined;
    }
    handleDispose() {
        this.#disposables.forEach((d) => { d.dispose(); });
        this.#panel = undefined;
    }
    async makeDocumentDirty() {
        if (this.#document) {
            const edits = new vscode_1.WorkspaceEdit();
            edits.insert(this.#document.uri, new vscode_1.Position(0, 0), " ");
            await vscode_1.workspace.applyEdit(edits);
            const edits2 = new vscode_1.WorkspaceEdit();
            edits2.delete(this.#document.uri, new vscode_1.Range(new vscode_1.Position(0, 0), new vscode_1.Position(0, 1)));
            await vscode_1.workspace.applyEdit(edits2);
        }
    }
    saveNotebook() {
        if (!this.#saving) {
            this.#requisitions.executeRemote("editorSaveNotebook", undefined);
        }
        return Promise.resolve();
    }
    triggerSave = async (content) => {
        if (this.#document && content) {
            const edit = new vscode_1.WorkspaceEdit();
            edit.replace(this.#document.uri, new vscode_1.Range(0, 0, this.#document.lineCount, 0), content);
            await vscode_1.workspace.applyEdit(edit);
            this.#saving = true;
            await this.#document.save();
            this.#saving = false;
        }
        return Promise.resolve(true);
    };
    triggerLoad = async () => {
        const dialogOptions = {
            title: "",
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                "MySQL Notebook": ["mysql-notebook"],
            },
            openLabel: "Open Notebook",
        };
        const paths = await vscode_1.window.showOpenDialog(dialogOptions);
        if (paths && paths.length > 0) {
            const path = paths[0].fsPath;
            const content = await (0, promises_1.readFile)(path, { encoding: "utf-8" });
            if (this.#document) {
                const edit = new vscode_1.WorkspaceEdit();
                edit.replace(this.#document.uri, new vscode_1.Range(0, 0, this.#document.lineCount, 0), content);
                await vscode_1.workspace.applyEdit(edit);
                this.#requisitions.executeRemote("editorLoadNotebook", { content, standalone: true });
            }
        }
        return true;
    };
}
exports.NotebookEditorProvider = NotebookEditorProvider;
//# sourceMappingURL=NotebookEditorProvider.js.map