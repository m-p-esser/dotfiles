"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenEditorsTreeDataProvider = void 0;
const vscode_1 = require("vscode");
const db_editor_1 = require("../../../../frontend/src/modules/db-editor");
const Requisitions_1 = require("../../../../frontend/src/supplement/Requisitions");
const EditorOverviewTreeItem_1 = require("./EditorOverviewTreeItem");
const EditorConnectionTreeItem_1 = require("./EditorConnectionTreeItem");
const EditorTabTreeItem_1 = require("./EditorTabTreeItem");
const EditorTreeItem_1 = require("./EditorTreeItem");
const ShellConsoleSessionTreeItem_1 = require("../ShellTreeProvider/ShellConsoleSessionTreeItem");
class OpenEditorsTreeDataProvider {
    #openProviders = new Map();
    #openSessions = new Map();
    #lastSelectedItems = new Map();
    #changeEvent = new vscode_1.EventEmitter();
    #selectCallback;
    #connectionOverview;
    get onDidChangeTreeData() {
        return this.#changeEvent.event;
    }
    set onSelect(callback) {
        this.#selectCallback = callback;
    }
    constructor() {
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
        Requisitions_1.requisitions.register("editorSaved", this.editorSaved);
        this.#connectionOverview = this.createOverviewItems(null);
    }
    dispose() {
        Requisitions_1.requisitions.unregister("proxyRequest", this.proxyRequest);
        Requisitions_1.requisitions.unregister("editorSaved", this.editorSaved);
    }
    clear(provider) {
        if (provider) {
            this.#openProviders.delete(provider);
        }
        else {
            this.#openProviders.clear();
        }
        this.#changeEvent.fire(undefined);
        return this.#openProviders.size === 0;
    }
    isOpen(item) {
        for (const [_, entry] of this.#openProviders.entries()) {
            if (entry.connections.some((connection) => {
                return connection.connectionId === item.details.id;
            })) {
                return true;
            }
        }
        return false;
    }
    currentConnectionId(provider) {
        const item = this.#lastSelectedItems.get(provider);
        if (item && item.type === "editor") {
            const parent = item.parent;
            return parent.connectionId;
        }
        else if (item && item.type === "connection") {
            return item.connectionId;
        }
        return null;
    }
    createUniqueCaption = () => {
        if (this.#openProviders.size === 0) {
            return "MySQL Shell";
        }
        let index = 2;
        while (index < 100) {
            const caption = `MySQL Shell (${index})`;
            let found = false;
            this.#openProviders.forEach((entry) => {
                if (entry.caption === caption) {
                    found = true;
                }
            });
            if (!found) {
                return caption;
            }
            ++index;
        }
        return "";
    };
    getTreeItem(element) {
        return element.treeItem;
    }
    getParent(element) {
        if (element.type === "editor") {
            return element.parent;
        }
        if (element.type === "connection") {
            return element.parent;
        }
        return null;
    }
    getChildren(element) {
        if (!element) {
            const connectionProviders = [...this.#openProviders.values()];
            const sessionProviders = [...this.#openSessions.values()];
            if (connectionProviders.length === 0) {
                return [this.#connectionOverview, ...sessionProviders.values()];
            }
            if (connectionProviders.length === 1) {
                const provider = [...this.#openProviders.values()][0];
                return [
                    provider.connectionOverview,
                    ...provider.connections,
                    ...sessionProviders.values(),
                ];
            }
            return [...this.#openProviders.values(), ...sessionProviders.values()];
        }
        if (element.type === "connectionProvider") {
            const provider = element;
            return [provider.connectionOverview, ...provider.connections];
        }
        if (element.type === "sessionProvider") {
            const provider = element;
            return [...provider.sessions];
        }
        if (element.type === "connection") {
            return element.editors;
        }
        return null;
    }
    updateEditors = (provider, details) => {
        if (details.opened) {
            let entry = this.#openProviders.get(provider);
            if (!entry) {
                entry = {
                    type: "connectionProvider",
                    provider,
                    caption: provider.caption,
                    treeItem: new EditorTabTreeItem_1.EditorTabTreeItem(provider.caption),
                    connections: [],
                };
                this.#openProviders.set(provider, entry);
                entry.connectionOverview = this.createOverviewItems(provider);
                entry.connectionOverview.parent = entry;
            }
            let connection = entry.connections.find((item) => {
                return item.connectionId === details.connectionId;
            });
            const editorCommand = {
                title: "",
                command: "",
                arguments: [provider, details.connectionCaption, details.connectionId, details.editorId],
            };
            switch (details.editorType) {
                case db_editor_1.EntityType.Notebook: {
                    editorCommand.command = "msg.showNotebook";
                    break;
                }
                case db_editor_1.EntityType.Script: {
                    editorCommand.command = "msg.showScript";
                    break;
                }
                case db_editor_1.EntityType.Status: {
                    editorCommand.command = "msg.showServerStatus";
                    break;
                }
                case db_editor_1.EntityType.Connections: {
                    editorCommand.command = "msg.showClientConnections";
                    break;
                }
                case db_editor_1.EntityType.Dashboard: {
                    editorCommand.command = "msg.showPerformanceDashboard";
                    break;
                }
                default:
            }
            if (connection) {
                const alternativeCaption = `${details.editorCaption} (${details.connectionCaption})`;
                connection.editors.push({
                    type: "editor",
                    caption: details.editorCaption,
                    alternativeCaption,
                    id: details.editorId,
                    language: details.language,
                    editorType: details.editorType,
                    parent: connection,
                    treeItem: new EditorTreeItem_1.EditorTreeItem(details.editorCaption, alternativeCaption, details.language, details.editorType, editorCommand),
                });
            }
            else {
                connection = {
                    type: "connection",
                    connectionId: details.connectionId,
                    caption: details.connectionCaption,
                    dbType: details.dbType,
                    editors: [],
                    parent: entry,
                    treeItem: new EditorConnectionTreeItem_1.EditorConnectionTreeItem(details.connectionCaption, details.dbType, details.connectionId),
                };
                const alternativeCaption = `${details.editorCaption} (${details.connectionCaption})`;
                connection.editors.push({
                    type: "editor",
                    caption: details.editorCaption,
                    alternativeCaption,
                    id: details.editorId,
                    language: details.language,
                    editorType: details.editorType,
                    parent: connection,
                    treeItem: new EditorTreeItem_1.EditorTreeItem(details.editorCaption, alternativeCaption, details.language, details.editorType, editorCommand),
                });
                entry.connections.push(connection);
            }
            const itemToSelect = connection.editors[connection.editors.length - 1];
            this.#changeEvent.fire(undefined);
            this.#lastSelectedItems.set(provider, itemToSelect);
            if (itemToSelect.caption !== "DB Connection Overview") {
                provider.caption = details.connectionCaption;
            }
            this.#selectCallback(itemToSelect);
        }
        else {
            const entry = this.#openProviders.get(provider);
            if (!entry) {
                return;
            }
            const connectionIndex = entry.connections.findIndex((item) => {
                return item.connectionId === details.connectionId;
            });
            if (connectionIndex > -1) {
                const connection = entry.connections[connectionIndex];
                if (details.editorId === undefined) {
                    connection.editors = [];
                }
                else {
                    const editorIndex = connection.editors.findIndex((item) => {
                        return item.id === details.editorId;
                    });
                    if (editorIndex !== -1) {
                        connection.editors.splice(editorIndex, 1);
                    }
                }
                if (connection.editors.length === 0) {
                    entry.connections.splice(connectionIndex, 1);
                }
            }
            if (entry.connections.length === 0) {
                this.#openProviders.delete(provider);
            }
            this.#changeEvent.fire(undefined);
        }
    };
    createOverviewItems = (provider) => {
        const connectionCommand = {
            command: "msg.openDBBrowser",
            arguments: [provider],
        };
        const connectionOverview = {
            type: "connectionOverview",
            caption: "DB Connection Overview",
            treeItem: new EditorOverviewTreeItem_1.EditorOverviewTreeItem("DB Connection Overview", "Open the DB Connection Overview", connectionCommand),
            parent: null,
        };
        return connectionOverview;
    };
    proxyRequest = (request) => {
        switch (request.original.requestType) {
            case "editorsChanged": {
                const response = request.original.parameter;
                this.updateEditors(request.provider, response);
                return Promise.resolve(true);
            }
            case "editorSelect": {
                const response = request.original.parameter;
                return this.selectItem(request.provider, response.connectionId, response.editorId);
            }
            case "selectConnectionTab": {
                const response = request.original.parameter;
                return this.selectItem(request.provider, response.connectionId, response.page);
            }
            case "refreshSessions": {
                const response = request.original.parameter;
                return this.refreshSessions(request.provider, response);
            }
            default:
        }
        return Promise.resolve(false);
    };
    selectItem = (provider, connectionId, editorOrPage) => {
        const entry = this.#openProviders.get(provider);
        if (!entry) {
            return Promise.resolve(false);
        }
        if (connectionId < 0 && editorOrPage.length === 0) {
            const lastItem = this.#lastSelectedItems.get(provider);
            if (lastItem) {
                this.#selectCallback(lastItem);
            }
            return Promise.resolve(true);
        }
        const connection = entry.connections.find((item) => {
            return item.connectionId === connectionId;
        });
        if (connection) {
            const editor = connection.editors.find((item) => {
                return item.id === editorOrPage;
            }) ?? connection.editors[0];
            if (editor) {
                this.#lastSelectedItems.set(provider, editor);
                this.#selectCallback(editor);
            }
        }
        else {
            this.#lastSelectedItems.set(provider, entry.connectionOverview);
            if (editorOrPage === "DB Connection Overview") {
                provider.caption = entry.caption;
            }
            else {
                provider.caption = editorOrPage ?? entry.caption;
            }
            this.#selectCallback(entry.connectionOverview);
        }
        return Promise.resolve(false);
    };
    refreshSessions = (provider, sessions) => {
        if (sessions.length === 0) {
            provider.close();
            this.#openSessions.delete(provider);
        }
        else {
            let entry = this.#openSessions.get(provider);
            if (!entry) {
                entry = {
                    type: "sessionProvider",
                    provider,
                    caption: provider.caption,
                    treeItem: new EditorTabTreeItem_1.EditorTabTreeItem(provider.caption),
                    sessions: [],
                };
                this.#openSessions.set(provider, entry);
            }
            entry.sessions = sessions.map((details) => {
                return {
                    type: "shellSession",
                    caption: details.caption,
                    id: details.sessionId,
                    parent: entry,
                    details,
                    treeItem: new ShellConsoleSessionTreeItem_1.ShellConsoleSessionTreeItem(details.caption ?? "Unknown", {
                        title: "Open Shell GUI Console",
                        command: "msg.openSession",
                        arguments: [details],
                    }),
                };
            });
        }
        this.#changeEvent.fire(undefined);
        return Promise.resolve(true);
    };
    editorSaved = (details) => {
        for (const entry of this.#openProviders.values()) {
            for (const connection of entry.connections) {
                for (const editor of connection.editors) {
                    if (editor.id === details.id) {
                        editor.caption = details.newName;
                        editor.treeItem.label = details.newName;
                        this.#changeEvent.fire(editor);
                    }
                }
            }
        }
        return Promise.resolve(true);
    };
    updateEditorItemCaptions = (provider, simpleView) => {
        for (const connection of provider.connections) {
            for (const editor of connection.editors) {
                editor.treeItem.updateLabel(simpleView);
            }
        }
    };
}
exports.OpenEditorsTreeDataProvider = OpenEditorsTreeDataProvider;
//# sourceMappingURL=OpenEditorsTreeProvider.js.map