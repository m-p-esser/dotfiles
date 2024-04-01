"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnectionViewProvider = void 0;
const promises_1 = require("fs/promises");
const vscode_1 = require("vscode");
const Requisitions_1 = require("../../../frontend/src/supplement/Requisitions");
const ModuleInfo_1 = require("../../../frontend/src/modules/ModuleInfo");
const utilities_1 = require("../utilities");
const WebviewProvider_1 = require("./WebviewProvider");
class DBConnectionViewProvider extends WebviewProvider_1.WebviewProvider {
    currentSchemas = new Map();
    #lastNotebookUri;
    show(page) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page } },
        ], "newConnection");
    }
    showPageSection(pageId, type, id) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: pageId } },
            { requestType: "showPageSection", parameter: { id, type } },
        ], "newConnection");
    }
    runQuery(page, details) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page, suppressAbout: true } },
            { requestType: "editorRunQuery", parameter: details },
        ], details.linkId === -1 ? "newConnection" : "newConnectionWithEmbeddedSql");
    }
    runScript(page, details) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            {
                requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page, suppressAbout: true, noEditor: true },
            },
            { requestType: "editorRunScript", parameter: details },
        ], "newConnection");
    }
    editScript(page, details) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page, suppressAbout: true } },
            { requestType: "editorEditScript", parameter: details },
        ], "newConnection");
    }
    loadScript(page, details) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page, suppressAbout: true } },
            { requestType: "editorLoadScript", parameter: details },
        ], "newConnection");
    }
    createNewEditor(details) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            {
                requestType: "showPage",
                parameter: { module: ModuleInfo_1.DBEditorModuleId, page: details.page, suppressAbout: true },
            },
            { requestType: "createNewEditor", parameter: details },
        ], "newConnection");
    }
    insertScriptData(state) {
        if (state.dbDataId) {
            return this.runCommand("editorInsertUserScript", { language: state.language, resourceId: state.dbDataId }, "newConnection");
        }
        return Promise.resolve(false);
    }
    addConnection(mdsData, profileName) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: "connections" } },
            { requestType: "addNewConnection", parameter: { mdsData, profileName } },
        ], "connections");
    }
    removeConnection(connectionId) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: "connections" } },
            { requestType: "removeConnection", parameter: connectionId },
        ], "connections");
    }
    editConnection(connectionId) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: "connections" } },
            { requestType: "editConnection", parameter: connectionId },
        ], "connections");
    }
    duplicateConnection(connectionId) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: "connections" } },
            { requestType: "duplicateConnection", parameter: connectionId },
        ], "connections");
    }
    renameFile(request) {
        return this.runCommand("job", [
            { requestType: "editorRenameScript", parameter: request },
        ], "connections");
    }
    closeEditor(connectionId, editorId) {
        return this.runCommand("job", [
            { requestType: "editorClose", parameter: { connectionId, editorId } },
        ], "");
    }
    reselectLastItem() {
        void Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: {
                requestType: "editorSelect",
                parameter: { connectionId: -1, editorId: "" },
            },
        });
    }
    createScript(language) {
        void Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: {
                requestType: "createNewEditor",
                parameter: language,
            },
        });
    }
    editMrsDbObject(page, data) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page } },
            { requestType: "showMrsDbObjectDialog", parameter: data },
        ], "newConnection");
    }
    makeCurrentSchema(connectionId, schema) {
        this.currentSchemas.set(connectionId, schema);
        if (this.panel) {
            return this.runCommand("job", [
                { requestType: "sqlSetCurrentSchema", parameter: { id: "", connectionId, schema } },
            ], "connections");
        }
        return Promise.resolve(false);
    }
    requisitionsCreated() {
        super.requisitionsCreated();
        if (this.requisitions) {
            ["refreshConnections", "connectionAdded", "connectionUpdated", "connectionRemoved", "refreshOciTree",
                "codeBlocksUpdate", "editorLoadScript",
                "editorSaveScript", "createNewEditor", "editorsChanged", "editorSelect"]
                .forEach((requestType) => {
                this.requisitions.register(requestType, this.forwardRequest.bind(this, requestType));
            });
            this.requisitions.register("newSession", this.createNewSession);
            this.requisitions.register("closeInstance", this.closeInstance);
            this.requisitions.register("showInfo", this.showInfo);
            this.requisitions.register("editorSaveNotebook", this.editorSaveNotebook);
            this.requisitions.register("editorSaveNotebookInPlace", this.editorSaveNotebookInPlace);
            this.requisitions.register("editorLoadNotebook", this.editorLoadNotebook);
            this.requisitions.register("showOpenDialog", this.showOpenDialog);
            this.requisitions.register("sqlSetCurrentSchema", this.setCurrentSchema);
        }
    }
    forwardRequest = async (requestType, parameter) => {
        return Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: { requestType, parameter },
        });
    };
    createNewSession = async (_details) => {
        await vscode_1.commands.executeCommand("msg.newSession");
        return true;
    };
    setCurrentSchema = (data) => {
        this.currentSchemas.set(data.connectionId, data.schema);
        return Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: { requestType: "sqlSetCurrentSchema", parameter: data },
        });
    };
    showInfo = (values) => {
        (0, utilities_1.showMessageWithTimeout)(values.join("\n"), 5000);
        return Promise.resolve(true);
    };
    editorSaveNotebook = (content) => {
        return new Promise((resolve) => {
            if (content) {
                const dialogOptions = {
                    title: "",
                    filters: {
                        "MySQL Notebook": ["mysql-notebook"],
                    },
                    saveLabel: "Save Notebook",
                };
                void vscode_1.window.showSaveDialog(dialogOptions).then((uri) => {
                    if (uri !== undefined) {
                        this.#lastNotebookUri = uri;
                        const path = uri.fsPath;
                        (0, promises_1.writeFile)(path, content).then(() => {
                            vscode_1.window.setStatusBarMessage(`DB Notebook saved to ${path}`, 5000);
                            return resolve(true);
                        }).catch(() => {
                            void vscode_1.window.showErrorMessage(`Could not save notebook to ${path}.`);
                            return resolve(false);
                        });
                    }
                    else {
                        return resolve(false);
                    }
                });
            }
            else {
                return resolve(false);
            }
        });
    };
    editorSaveNotebookInPlace = (content) => {
        return new Promise((resolve) => {
            if (content) {
                if (this.#lastNotebookUri === undefined) {
                    void this.editorSaveNotebook(content);
                }
                else {
                    const path = this.#lastNotebookUri.fsPath;
                    (0, promises_1.writeFile)(path, content).then(() => {
                        vscode_1.window.setStatusBarMessage(`DB Notebook saved to ${path}`, 5000);
                        return resolve(true);
                    }).catch(() => {
                        void vscode_1.window.showErrorMessage(`Could not save notebook to ${path}.`);
                        return resolve(false);
                    });
                }
            }
            else {
                return resolve(false);
            }
        });
    };
    editorLoadNotebook = () => {
        return new Promise((resolve) => {
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
            void vscode_1.window.showOpenDialog(dialogOptions).then((paths) => {
                if (paths && paths.length > 0) {
                    this.#lastNotebookUri = paths[0];
                    const path = paths[0].fsPath;
                    (0, promises_1.readFile)(path, { encoding: "utf-8" }).then((content) => {
                        this.requisitions?.executeRemote("editorLoadNotebook", { content, standalone: false });
                    }).catch(() => {
                        void vscode_1.window.showErrorMessage(`Could not load notebook from ${path}.`);
                    });
                }
                resolve(true);
            });
        });
    };
    showOpenDialog = (options) => {
        return new Promise((resolve) => {
            const dialogOptions = {
                id: options.id,
                defaultUri: vscode_1.Uri.file(options.default ?? ""),
                openLabel: options.openLabel,
                canSelectFiles: options.canSelectFiles,
                canSelectFolders: options.canSelectFolders,
                canSelectMany: options.canSelectMany,
                filters: options.filters,
                title: options.title,
            };
            void vscode_1.window.showOpenDialog(dialogOptions).then((paths) => {
                if (paths) {
                    const result = {
                        resourceId: dialogOptions.id ?? "",
                        path: paths.map((path) => {
                            return path.fsPath;
                        }),
                    };
                    void this.requisitions?.executeRemote("selectFile", result);
                }
                resolve(true);
            });
        });
    };
    closeInstance = () => {
        this.close();
        return Promise.resolve(true);
    };
}
exports.DBConnectionViewProvider = DBConnectionViewProvider;
//# sourceMappingURL=DBConnectionViewProvider.js.map