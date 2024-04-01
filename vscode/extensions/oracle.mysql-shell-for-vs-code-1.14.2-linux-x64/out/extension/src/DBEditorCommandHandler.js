"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBEditorCommandHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const vscode_1 = require("vscode");
const Requisitions_1 = require("../../frontend/src/supplement/Requisitions");
const db_editor_1 = require("../../frontend/src/modules/db-editor");
const DBConnectionViewProvider_1 = require("./web-views/DBConnectionViewProvider");
const ShellInterface_1 = require("../../frontend/src/supplement/ShellInterface");
const helpers_1 = require("../../frontend/src/utilities/helpers");
const CodeBlocks_1 = require("./CodeBlocks");
const ConnectionsTreeBaseItem_1 = require("./tree-providers/ConnectionsTreeProvider/ConnectionsTreeBaseItem");
const OpenEditorsTreeProvider_1 = require("./tree-providers/OpenEditorsTreeProvider/OpenEditorsTreeProvider");
const utilities_1 = require("./utilities");
const string_helpers_1 = require("../../frontend/src/utilities/string-helpers");
class DBEditorCommandHandler {
    connectionsProvider;
    #isConnected = false;
    #host;
    #codeBlocks = new CodeBlocks_1.CodeBlocks();
    #openScripts = new Map();
    #openEditorsTreeDataProvider;
    #initialDisplayOfOpenEditorsView = true;
    #displayDbConnectionOverviewWhenConnected = false;
    constructor(connectionsProvider) {
        this.connectionsProvider = connectionsProvider;
    }
    setup(host) {
        this.#host = host;
        const context = host.context;
        this.#codeBlocks.setup(context);
        const dbConnectionsTreeView = vscode_1.window.createTreeView("msg.connections", {
            treeDataProvider: this.connectionsProvider,
            showCollapseAll: true,
            canSelectMany: false,
        });
        context.subscriptions.push(dbConnectionsTreeView);
        dbConnectionsTreeView.onDidExpandElement((event) => {
            this.connectionsProvider.didExpandElement(event.element);
        });
        dbConnectionsTreeView.onDidCollapseElement((event) => {
            this.connectionsProvider.didCollapseElement(event.element);
        });
        this.#openEditorsTreeDataProvider = new OpenEditorsTreeProvider_1.OpenEditorsTreeDataProvider();
        const openEditorsTreeView = vscode_1.window.createTreeView("msg.openEditors", {
            treeDataProvider: this.#openEditorsTreeDataProvider,
            showCollapseAll: true,
            canSelectMany: false,
        });
        context.subscriptions.push(openEditorsTreeView);
        this.#openEditorsTreeDataProvider.onSelect = (item) => {
            void openEditorsTreeView.reveal(item, { select: true, focus: false, expand: 3 });
        };
        openEditorsTreeView.onDidChangeVisibility((e) => {
            const showDbConnectionsTab = vscode_1.workspace.getConfiguration(`msg.startup`)
                .get("showDbConnectionsTab", true);
            if (e.visible && this.#initialDisplayOfOpenEditorsView && showDbConnectionsTab) {
                this.#initialDisplayOfOpenEditorsView = false;
                if (this.#isConnected) {
                    void vscode_1.commands.executeCommand("msg.openDBBrowser");
                }
                else {
                    this.#displayDbConnectionOverviewWhenConnected = true;
                }
            }
        });
        Requisitions_1.requisitions.register("connectedToUrl", this.connectedToUrl);
        Requisitions_1.requisitions.register("editorRunQuery", this.editorRunQuery);
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.refreshConnections", () => {
            void Requisitions_1.requisitions.execute("refreshConnections", undefined);
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.refreshVisibleRouters", () => {
            this.connectionsProvider.refreshMrsRouters();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.openConnection", (entry) => {
            if (entry) {
                let provider;
                if (this.#openEditorsTreeDataProvider.isOpen(entry.treeItem)) {
                    provider = this.#host.newProvider;
                }
                else {
                    provider = this.#host.currentProvider;
                }
                void provider?.show(String(entry.treeItem.details.id));
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.openConnectionNewTab", (entry) => {
            if (entry) {
                const provider = this.#host.newProvider;
                void provider?.show(String(entry.treeItem.details.id));
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.showTableData", (entry) => {
            if (entry) {
                const provider = this.#host.currentProvider;
                const configuration = vscode_1.workspace.getConfiguration(`msg.dbEditor`);
                const uppercaseKeywords = configuration.get("upperCaseKeywords", true);
                const select = uppercaseKeywords ? "SELECT" : "select";
                const from = uppercaseKeywords ? "FROM" : "from";
                const item = entry.treeItem;
                const query = `${select} * ${from} \`${item.schema}\`.\`${item.label}\``;
                const name = `${item.schema}.${item.label} - Data`;
                void provider?.runScript(String(item.connectionId), {
                    scriptId: (0, helpers_1.uuid)(),
                    language: "mysql",
                    content: query,
                    name,
                });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.selectTableRows", (entry) => {
            if (entry) {
                const provider = this.#host.currentProvider;
                const configuration = vscode_1.workspace.getConfiguration(`msg.dbEditor`);
                const uppercaseKeywords = configuration.get("upperCaseKeywords", true);
                const select = uppercaseKeywords ? "SELECT" : "select";
                const from = uppercaseKeywords ? "FROM" : "from";
                const item = entry.treeItem;
                const query = `${select} * ${from} \`${item.schema}\`.\`${item.label}\``;
                void provider?.runQuery(String(item.connectionId), {
                    query,
                    data: {},
                    linkId: -1,
                    parameters: [],
                });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.showNotebook", (provider, caption, connectionId, itemId) => {
            provider ??= this.#host.currentProvider;
            if (provider instanceof DBConnectionViewProvider_1.DBConnectionViewProvider) {
                provider.caption = caption;
                void provider.showPageSection(String(connectionId), db_editor_1.EntityType.Notebook, itemId);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.showScript", (provider, caption, connectionId, itemId) => {
            provider ??= this.#host.currentProvider;
            if (provider instanceof DBConnectionViewProvider_1.DBConnectionViewProvider) {
                provider.caption = caption;
                void provider.showPageSection(String(connectionId), db_editor_1.EntityType.Script, itemId);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.showServerStatus", (provider, caption, connectionId, itemId) => {
            provider ??= this.#host.currentProvider;
            if (provider instanceof DBConnectionViewProvider_1.DBConnectionViewProvider) {
                provider.caption = caption;
                void provider.showPageSection(String(connectionId), db_editor_1.EntityType.Status, itemId);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.showClientConnections", (provider, caption, connectionId, itemId) => {
            provider ??= this.#host.currentProvider;
            if (provider instanceof DBConnectionViewProvider_1.DBConnectionViewProvider) {
                provider.caption = caption;
                void provider.showPageSection(String(connectionId), db_editor_1.EntityType.Connections, itemId);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.showPerformanceDashboard", (provider, caption, connectionId, itemId) => {
            provider ??= this.#host.currentProvider;
            if (provider instanceof DBConnectionViewProvider_1.DBConnectionViewProvider) {
                provider.caption = caption;
                void provider.showPageSection(String(connectionId), db_editor_1.EntityType.Dashboard, itemId);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.insertScript", (item) => {
            if (item) {
                const provider = this.#host.currentProvider;
                void provider?.insertScriptData(item.entry);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.addConnection", () => {
            const provider = this.#host.currentProvider;
            void provider?.addConnection();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.refreshConnection", (item) => {
            void Requisitions_1.requisitions.execute("refreshConnections", { item });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.removeConnection", (entry) => {
            if (entry) {
                const provider = this.#host.currentProvider;
                void provider?.removeConnection(entry.treeItem.details.id);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.editConnection", (entry) => {
            if (entry) {
                const provider = this.#host.currentProvider;
                void provider?.editConnection(entry?.treeItem.details.id);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.duplicateConnection", (entry) => {
            if (entry) {
                const provider = this.#host.currentProvider;
                void provider?.duplicateConnection(entry.treeItem.details.id);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.showSystemSchemasOnConnection", (entry) => {
            if (entry) {
                entry.treeItem.details.hideSystemSchemas = false;
                void Requisitions_1.requisitions.execute("refreshConnections", { entry });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.hideSystemSchemasOnConnection", (entry) => {
            if (entry) {
                entry.treeItem.details.hideSystemSchemas = true;
                void Requisitions_1.requisitions.execute("refreshConnections", { entry });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.openDBBrowser", (provider) => {
            provider ??= this.#host.currentProvider;
            if (provider instanceof DBConnectionViewProvider_1.DBConnectionViewProvider) {
                void provider.show("connections");
            }
            else {
                const provider = this.#host.currentProvider;
                if (provider) {
                    void provider.show("connections");
                }
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.makeCurrentSchema", (entry) => {
            if (entry) {
                const provider = this.#host.currentProvider;
                if (provider) {
                    void provider?.makeCurrentSchema(entry.parent.treeItem.details.id, entry.treeItem.name)
                        .then((success) => {
                        if (success) {
                            this.connectionsProvider.makeCurrentSchema(entry);
                        }
                    });
                }
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.dropSchema", (entry) => {
            entry?.treeItem.dropItem();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.dropTable", (entry) => {
            entry?.treeItem.dropItem();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.dropView", (entry) => {
            entry?.treeItem.dropItem();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.dropRoutine", (entry) => {
            entry?.treeItem.dropItem();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.dropTrigger", (entry) => {
            entry?.treeItem.dropItem();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.dropEvent", (item) => {
            item?.dropItem();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.defaultConnection", (entry) => {
            if (entry) {
                const configuration = vscode_1.workspace.getConfiguration(`msg.editor`);
                void configuration.update("defaultDbConnection", entry.treeItem.details.caption, vscode_1.ConfigurationTarget.Global).then(() => {
                    void vscode_1.window.showInformationMessage(`"${entry.treeItem.label}" has been set as default DB Connection.`);
                });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.copyNameToClipboard", (entry) => {
            if (entry && entry.treeItem instanceof ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem) {
                entry.treeItem.copyNameToClipboard();
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.copyCreateScriptToClipboard", (entry) => {
            if (entry && entry.treeItem instanceof ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem) {
                entry.treeItem.copyCreateScriptToClipboard();
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.copyCreateScriptWithDelimitersToClipboard", (entry) => {
            if (entry && entry.treeItem instanceof ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem) {
                entry.treeItem.copyCreateScriptToClipboard(true);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.copyDropCreateScriptWithDelimitersToClipboard", (entry) => {
            if (entry && entry.treeItem instanceof ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem) {
                entry.treeItem.copyCreateScriptToClipboard(true, true);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.editInScriptEditor", async (uri) => {
            if (uri?.scheme === "file") {
                if (!fs_1.default.existsSync(uri.fsPath)) {
                    void vscode_1.window.showErrorMessage(`The file ${uri.fsPath} could not be found.`);
                }
                else {
                    const stat = await vscode_1.workspace.fs.stat(uri);
                    if (stat.size >= 10000000) {
                        await vscode_1.window.showInformationMessage(`The file "${uri.fsPath}" ` +
                            `is too large to edit it in a web view. Instead use the VS Code built-in editor.`);
                    }
                    else {
                        const connection = await host.determineConnection();
                        if (connection) {
                            await vscode_1.workspace.fs.readFile(uri).then((value) => {
                                const content = value.toString();
                                const provider = this.#host.currentProvider;
                                if (provider) {
                                    const name = (0, path_1.basename)(uri.fsPath);
                                    const details = {
                                        scriptId: (0, helpers_1.uuid)(),
                                        name,
                                        content,
                                        language: this.languageFromConnection(connection),
                                    };
                                    let scripts = this.#openScripts.get(provider);
                                    if (!scripts) {
                                        scripts = new Map();
                                        this.#openScripts.set(provider, scripts);
                                    }
                                    scripts.set(details.scriptId, uri);
                                    void provider.editScript(String(connection.treeItem.details.id), details);
                                }
                            });
                        }
                    }
                }
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.loadScriptFromDisk", (entry) => {
            if (entry) {
                void vscode_1.window.showOpenDialog({
                    title: "Select the script file to load to MySQL Shell",
                    openLabel: "Select Script File",
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        SQL: ["sql", "mysql"], TypeScript: ["ts"], JavaScript: ["js"],
                    },
                }).then(async (value) => {
                    if (value && value.length === 1) {
                        const uri = value[0];
                        const stat = await vscode_1.workspace.fs.stat(uri);
                        if (stat.size >= 10000000) {
                            await vscode_1.window.showInformationMessage(`The file "${uri.fsPath}" ` +
                                `is too large to edit it in a web view. Instead use the VS Code built-in editor.`);
                        }
                        else {
                            await vscode_1.workspace.fs.readFile(uri).then((value) => {
                                const content = value.toString();
                                const provider = this.#host.currentProvider;
                                if (provider) {
                                    let language = "mysql";
                                    const name = (0, path_1.basename)(uri.fsPath);
                                    const ext = name.substring(name.lastIndexOf(".") ?? 0);
                                    switch (ext) {
                                        case ".ts": {
                                            language = "typescript";
                                            break;
                                        }
                                        case ".js": {
                                            language = "javascript";
                                            break;
                                        }
                                        case ".sql": {
                                            if (entry.treeItem.details.dbType === ShellInterface_1.DBType.Sqlite) {
                                                language = "sql";
                                            }
                                            break;
                                        }
                                        default:
                                    }
                                    const details = {
                                        scriptId: (0, helpers_1.uuid)(),
                                        name,
                                        content,
                                        language,
                                    };
                                    let scripts = this.#openScripts.get(provider);
                                    if (!scripts) {
                                        scripts = new Map();
                                        this.#openScripts.set(provider, scripts);
                                    }
                                    scripts.set(details.scriptId, uri);
                                    void provider.editScript(String(entry.treeItem.details.id), details);
                                }
                            });
                        }
                    }
                });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.createConnectionViaBastionService", (item) => {
            if (item) {
                const provider = this.#host.currentProvider;
                void provider?.addConnection(item.dbSystem, item.profile.profile);
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerTextEditorCommand("msg.executeEmbeddedSqlFromEditor", (editor) => {
            if (editor) {
                void host.determineConnection().then((connection) => {
                    if (connection) {
                        this.#codeBlocks.executeSqlFromEditor(editor, connection.treeItem.details.caption, connection.treeItem.details.id);
                    }
                });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerTextEditorCommand("msg.executeSelectedSqlFromEditor", (editor) => {
            if (editor) {
                void host.determineConnection().then((connection) => {
                    if (connection) {
                        const provider = this.#host.currentProvider;
                        if (provider) {
                            let sql = "";
                            if (!editor.selection.isEmpty) {
                                editor.selections.forEach((selection) => {
                                    sql += editor.document.getText(selection);
                                });
                            }
                            else {
                                sql = editor.document.getText();
                            }
                            return provider.runScript(String(connection.treeItem.details.id), {
                                scriptId: (0, helpers_1.uuid)(),
                                content: sql,
                                language: this.languageFromConnection(connection),
                            });
                        }
                    }
                });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.closeEditor", (entry) => {
            if (entry) {
                const provider = entry.parent.parent.provider;
                if (provider instanceof DBConnectionViewProvider_1.DBConnectionViewProvider) {
                    void provider.closeEditor(entry.parent.connectionId, entry.id);
                }
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newNotebookMysql", (entry) => {
            void this.createNewEditor({ entry, language: "msg" });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newNotebookSqlite", (entry) => {
            void this.createNewEditor({ entry, language: "msg" });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newScriptJs", (entry) => {
            void this.createNewEditor({ entry, language: "javascript" });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newScriptMysql", (entry) => {
            void this.createNewEditor({ entry, language: "mysql" });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newScriptSqlite", (entry) => {
            void this.createNewEditor({ entry, language: "sql" });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newScriptTs", (entry) => {
            void this.createNewEditor({ entry, language: "typescript" });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.addDbObject", (entry) => {
            if (entry) {
                let objectType;
                if (entry.type === "routine") {
                    objectType = entry.treeItem.dbType.toUpperCase();
                }
                else {
                    objectType = entry.type.toUpperCase();
                }
                const item = entry.treeItem;
                if (objectType === "TABLE" || objectType === "VIEW" || objectType === "PROCEDURE") {
                    this.createNewDbObject(entry.treeItem.backend, item, objectType).then((dbObject) => {
                        const provider = this.#host.currentProvider;
                        void provider?.editMrsDbObject(String(item.connectionId), { dbObject, createObject: true });
                    }).catch((reason) => {
                        void vscode_1.window.showErrorMessage(`${String(reason)}`);
                    });
                }
                else {
                    void vscode_1.window.showErrorMessage(`The database object type '${objectType}' is not supported at this time`);
                }
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.editDbObject", (entry) => {
            if (entry) {
                const provider = this.#host.currentProvider;
                void provider?.editMrsDbObject(String(entry.treeItem.connectionId), { dbObject: entry.treeItem.value, createObject: false });
            }
        }));
    }
    async refreshConnectionTree() {
        await this.connectionsProvider.closeAllConnections();
        this.connectionsProvider.refresh();
    }
    clear() {
        this.#openEditorsTreeDataProvider.clear();
    }
    providerClosed(provider) {
        this.#openScripts.delete(provider);
        if (this.#openEditorsTreeDataProvider.clear(provider)) {
            this.connectionsProvider.resetCurrentSchemas();
        }
    }
    generateNewProviderCaption() {
        return this.#openEditorsTreeDataProvider.createUniqueCaption();
    }
    providerStateChanged(provider, active) {
        this.connectionsProvider.providerStateChanged(provider, active);
    }
    createNewDbObject = async (backend, item, objectType) => {
        const dbObject = {
            comments: "",
            crudOperations: (objectType === "PROCEDURE") ? ["UPDATE"] : ["READ"],
            crudOperationFormat: "FEED",
            dbSchemaId: "",
            enabled: 1,
            id: "",
            name: item.name,
            objectType,
            requestPath: `/${(0, string_helpers_1.snakeToCamelCase)(item.name)}`,
            requiresAuth: 1,
            rowUserOwnershipEnforced: 0,
            serviceId: "",
            autoDetectMediaType: 0,
        };
        const services = await backend.mrs.listServices();
        let service;
        if (services.length === 1) {
            service = services[0];
        }
        else if (services.length > 1) {
            service = services.find((service) => {
                return service.isCurrent;
            });
            if (!service) {
                const items = services.map((s) => {
                    return s.urlContextRoot;
                });
                const name = await vscode_1.window.showQuickPick(items, {
                    title: "Select a connection for SQL execution",
                    matchOnDescription: true,
                    placeHolder: "Type the name of an existing DB connection",
                });
                if (name) {
                    service = services.find((candidate) => {
                        return candidate.urlContextRoot === name;
                    });
                }
            }
        }
        if (service) {
            const schemas = await backend.mrs.listSchemas(service.id);
            const schema = schemas.find((schema) => {
                return schema.name === item.schema;
            });
            dbObject.schemaName = item.schema;
            if (schema) {
                dbObject.dbSchemaId = schema.id;
            }
            else {
                const answer = await vscode_1.window.showInformationMessage(`The database schema ${item.schema} has not been added to the `
                    + "REST Service. Do you want to add the schema now?", "Yes", "No");
                if (answer === "Yes") {
                    dbObject.dbSchemaId = await backend.mrs.addSchema(service.id, item.schema, `/${(0, string_helpers_1.snakeToCamelCase)(item.schema)}`, false, null, null, undefined);
                    void vscode_1.commands.executeCommand("msg.refreshConnections");
                    (0, utilities_1.showMessageWithTimeout)(`The MRS schema ${item.schema} has been added successfully.`, 5000);
                }
                else {
                    throw new Error("Operation cancelled.");
                }
            }
        }
        else {
            if (services.length === 0) {
                throw new Error("Please create a REST Service before adding DB Objects.");
            }
            else {
                throw new Error("No REST Service selected.");
            }
        }
        return dbObject;
    };
    connectedToUrl = (url) => {
        this.#isConnected = url !== undefined;
        if (this.#displayDbConnectionOverviewWhenConnected) {
            this.#displayDbConnectionOverviewWhenConnected = false;
            void vscode_1.commands.executeCommand("msg.openDBBrowser");
        }
        return Promise.resolve(true);
    };
    editorRunQuery = (details) => {
        const provider = this.#host.currentProvider;
        if (provider) {
            return provider.runQuery(details.data.connectionId, {
                linkId: details.linkId,
                query: details.query,
                data: {},
                parameters: [],
            });
        }
        return Promise.resolve(false);
    };
    editorLoadScript = (details) => {
        const filters = {};
        switch (details.language) {
            case "mysql": {
                filters.SQL = ["mysql", "sql"];
                break;
            }
            case "sql": {
                filters.SQL = ["sql"];
                break;
            }
            case "typescript": {
                filters.TypeScript = ["ts"];
                break;
            }
            case "javascript": {
                filters.JavaScript = ["js"];
                break;
            }
            default:
        }
        void vscode_1.window.showOpenDialog({
            title: "Load Script File",
            filters,
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
        }).then((list) => {
            if (list.length > 0) {
                void vscode_1.workspace.fs.readFile(list[0]).then((content) => {
                    const provider = this.#host.currentProvider;
                    if (provider) {
                        const scripts = this.#openScripts.get(provider);
                        if (scripts) {
                            scripts.set(details.scriptId, list[0]);
                            const newName = (0, path_1.basename)(list[0].fsPath);
                            void provider.renameFile({
                                scriptId: details.scriptId,
                                name: newName,
                                language: details.language,
                                content: details.content,
                            });
                            void Requisitions_1.requisitions.execute("editorSaved", { id: details.scriptId, newName, saved: false });
                        }
                        details.content = content.toString();
                        const connectionId = this.#openEditorsTreeDataProvider.currentConnectionId(provider) ?? -1;
                        void provider.loadScript(String(connectionId), details);
                    }
                });
            }
        });
        return Promise.resolve(true);
    };
    editorSaveScript = (details) => {
        const provider = this.#host.currentProvider;
        if (provider) {
            const scripts = this.#openScripts.get(provider);
            if (scripts) {
                const uri = scripts.get(details.scriptId);
                if (uri) {
                    if (uri.scheme === "untitled") {
                        const filters = {};
                        switch (details.language) {
                            case "mysql": {
                                filters.SQL = ["mysql", "sql"];
                                break;
                            }
                            case "sql": {
                                filters.SQL = ["sql"];
                                break;
                            }
                            case "typescript": {
                                filters.TypeScript = ["ts"];
                                break;
                            }
                            case "javascript": {
                                filters.JavaScript = ["js"];
                                break;
                            }
                            default:
                        }
                        void vscode_1.window.showSaveDialog({
                            title: "Save Script File",
                            filters,
                        }).then((value) => {
                            if (value) {
                                const newName = (0, path_1.basename)(value.fsPath);
                                scripts.set(details.scriptId, value);
                                void provider.renameFile({
                                    scriptId: details.scriptId,
                                    name: newName,
                                    language: details.language,
                                    content: details.content,
                                });
                                const buffer = Buffer.from(details.content, "utf-8");
                                void vscode_1.workspace.fs.writeFile(value, buffer);
                                void Requisitions_1.requisitions.execute("editorSaved", { id: details.scriptId, newName, saved: value !== undefined });
                            }
                        });
                    }
                    else {
                        const buffer = Buffer.from(details.content, "utf-8");
                        void vscode_1.workspace.fs.writeFile(uri, buffer);
                    }
                }
            }
        }
        return Promise.resolve(true);
    };
    createNewEditor = (params) => {
        return new Promise((resolve) => {
            let connectionId = -1;
            let provider;
            if (params.entry?.parent?.provider) {
                connectionId = params.entry.connectionId;
                provider = params.entry.parent.provider;
            }
            else {
                provider = this.#host.currentProvider;
                if (provider) {
                    connectionId = this.#openEditorsTreeDataProvider.currentConnectionId(provider) ?? -1;
                }
            }
            if (connectionId === -1) {
                void vscode_1.window.showErrorMessage("Please select a connection first.");
                resolve(false);
                return;
            }
            void vscode_1.workspace.openTextDocument({ language: params.language, content: params.content })
                .then((document) => {
                const dbProvider = (params.provider
                    ? params.provider
                    : provider);
                if (provider) {
                    const name = (0, path_1.basename)(document.fileName);
                    if (params.language === "msg") {
                        void dbProvider.createNewEditor({
                            page: String(connectionId),
                            language: params.language,
                            content: params.content,
                        });
                    }
                    else {
                        const request = {
                            scriptId: (0, helpers_1.uuid)(),
                            name,
                            content: document.getText(),
                            language: params.language,
                        };
                        let scripts = this.#openScripts.get(dbProvider);
                        if (!scripts) {
                            scripts = new Map();
                            this.#openScripts.set(dbProvider, scripts);
                        }
                        scripts.set(request.scriptId, document.uri);
                        void dbProvider.editScript(String(connectionId), request);
                    }
                }
                resolve(true);
            });
        });
    };
    languageFromConnection = (entry) => {
        switch (entry.treeItem.details.dbType) {
            case ShellInterface_1.DBType.MySQL: {
                return "mysql";
            }
            default: {
                return "sql";
            }
        }
    };
    proxyRequest = (request) => {
        switch (request.original.requestType) {
            case "editorSaveScript": {
                const response = request.original.parameter;
                return this.editorSaveScript(response);
            }
            case "editorLoadScript": {
                const response = request.original.parameter;
                return this.editorLoadScript(response);
            }
            case "createNewEditor": {
                const response = request.original.parameter;
                return this.createNewEditor({
                    provider: request.provider, language: response.language, content: response.content,
                });
            }
            default:
        }
        return Promise.resolve(false);
    };
}
exports.DBEditorCommandHandler = DBEditorCommandHandler;
//# sourceMappingURL=DBEditorCommandHandler.js.map