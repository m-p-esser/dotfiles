"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsTreeDataProvider = void 0;
const vscode_1 = require("vscode");
const Requisitions_1 = require("../../../../frontend/src/supplement/Requisitions");
const ShellInterface_1 = require("../../../../frontend/src/supplement/ShellInterface");
const ShellInterfaceSqlEditor_1 = require("../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor");
const WebSession_1 = require("../../../../frontend/src/supplement/WebSession");
const SchemaGroupTreeItem_1 = require("./SchemaGroupTreeItem");
const SchemaIndex_1 = require("./SchemaIndex");
const SchemaMySQLTreeItem_1 = require("./SchemaMySQLTreeItem");
const ShellInterface_2 = require("../../../../frontend/src/supplement/ShellInterface/ShellInterface");
const helpers_1 = require("../../../../frontend/src/utilities/helpers");
const string_helpers_1 = require("../../../../frontend/src/utilities/string-helpers");
const extension_1 = require("../../extension");
const utilities_1 = require("../../utilities");
const utilitiesShellGui_1 = require("../../utilitiesShellGui");
const AdminSectionTreeItem_1 = require("./AdminSectionTreeItem");
const AdminTreeItem_1 = require("./AdminTreeItem");
const ConnectionMySQLTreeItem_1 = require("./ConnectionMySQLTreeItem");
const ConnectionSqliteTreeItem_1 = require("./ConnectionSqliteTreeItem");
const MrsAuthAppTreeItem_1 = require("./MrsAuthAppTreeItem");
const MrsContentFileTreeItem_1 = require("./MrsContentFileTreeItem");
const MrsContentSetTreeItem_1 = require("./MrsContentSetTreeItem");
const MrsDbObjectTreeItem_1 = require("./MrsDbObjectTreeItem");
const MrsRouterTreeItem_1 = require("./MrsRouterTreeItem");
const MrsSchemaTreeItem_1 = require("./MrsSchemaTreeItem");
const MrsServiceTreeItem_1 = require("./MrsServiceTreeItem");
const MrsTreeItem_1 = require("./MrsTreeItem");
const MrsUserTreeItem_1 = require("./MrsUserTreeItem");
const SchemaEventTreeItem_1 = require("./SchemaEventTreeItem");
const SchemaRoutineMySQLTreeItem_1 = require("./SchemaRoutineMySQLTreeItem");
const SchemaRoutineTreeItem_1 = require("./SchemaRoutineTreeItem");
const SchemaSqliteTreeItem_1 = require("./SchemaSqliteTreeItem");
const SchemaTableColumnTreeItem_1 = require("./SchemaTableColumnTreeItem");
const SchemaTableForeignKeyTreeItem_1 = require("./SchemaTableForeignKeyTreeItem");
const SchemaTableGroupTreeItem_1 = require("./SchemaTableGroupTreeItem");
const SchemaTableIndexTreeItem_1 = require("./SchemaTableIndexTreeItem");
const SchemaTableMySQLTreeItem_1 = require("./SchemaTableMySQLTreeItem");
const SchemaTableSqliteTreeItem_1 = require("./SchemaTableSqliteTreeItem");
const SchemaTableTriggerTreeItem_1 = require("./SchemaTableTriggerTreeItem");
const SchemaViewMySQLTreeItem_1 = require("./SchemaViewMySQLTreeItem");
const SchemaViewSqliteTreeItem_1 = require("./SchemaViewSqliteTreeItem");
class ConnectionsTreeDataProvider {
    static nextId = 1;
    connections = [];
    expandedMrsTreeItems = new Set();
    changeEvent = new vscode_1.EventEmitter();
    refreshMrsRoutersTimer = null;
    requiredRouterVersion;
    clearCurrentSchemas = false;
    #errorAlreadyDisplayed = false;
    get onDidChangeTreeData() {
        return this.changeEvent.event;
    }
    constructor() {
        Requisitions_1.requisitions.register("refreshConnections", this.refreshConnections);
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
    }
    dispose() {
        if (this.refreshMrsRoutersTimer !== null) {
            clearTimeout(this.refreshMrsRoutersTimer);
            this.refreshMrsRoutersTimer = null;
        }
        Requisitions_1.requisitions.unregister("refreshConnections", this.refreshConnections);
        Requisitions_1.requisitions.unregister("proxyRequest", this.proxyRequest);
        void this.closeAllConnections();
    }
    refresh(entry) {
        if (!entry) {
            void this.updateConnections().then(() => {
                this.changeEvent.fire(entry);
                if (this.refreshMrsRoutersTimer === null) {
                    this.refreshMrsRouters();
                }
                void Requisitions_1.requisitions.execute("connectionsUpdated", undefined);
            });
        }
        else {
            this.changeEvent.fire(entry);
        }
    }
    providerStateChanged(provider, active) {
        if (active) {
            this.clearCurrentSchemas = false;
            const currentSchemas = provider.currentSchemas;
            this.connections.forEach((connection) => {
                connection.currentSchema = currentSchemas.get(connection.treeItem.details.id) ?? "";
            });
            this.changeEvent.fire(undefined);
        }
        else {
            this.clearCurrentSchemas = true;
            setTimeout(() => {
                if (this.clearCurrentSchemas) {
                    this.clearCurrentSchemas = false;
                    this.resetCurrentSchemas();
                }
            }, 300);
        }
    }
    makeCurrentSchema(entry) {
        entry.parent.currentSchema = entry.treeItem.schema;
        this.changeEvent.fire(entry.parent);
    }
    resetCurrentSchemas() {
        this.connections.forEach((connection) => {
            connection.currentSchema = "";
        });
        this.changeEvent.fire(undefined);
    }
    getTreeItem(entry) {
        return entry.treeItem;
    }
    getParent(entry) {
        if ("parent" in entry) {
            return entry.parent;
        }
        return undefined;
    }
    async getChildren(entry) {
        if (!entry) {
            return this.connections;
        }
        switch (entry.type) {
            case "connection": {
                const entries = [];
                await this.updateSchemaList(entry);
                if (entry.mrsEntry !== undefined) {
                    entries.push(entry.mrsEntry);
                }
                if (entry.adminEntry !== undefined) {
                    entries.push(entry.adminEntry);
                }
                entries.push(...entry.schemaEntries);
                return entries;
            }
            case "admin": {
                const serverStatusCommand = {
                    title: "Show Server Status",
                    command: "msg.showServerStatus",
                    arguments: [undefined, "Server Status", entry.treeItem.connectionId, (0, helpers_1.uuid)()],
                };
                const clientConnectionsCommand = {
                    title: "Show Client Connections",
                    command: "msg.showClientConnections",
                    arguments: [undefined, "Client Connections", entry.treeItem.connectionId, (0, helpers_1.uuid)()],
                };
                const performanceDashboardCommand = {
                    title: "Show Performance Dashboard",
                    command: "msg.showPerformanceDashboard",
                    arguments: [undefined, "Performance Dashboard", entry.treeItem.connectionId, (0, helpers_1.uuid)()],
                };
                const item = entry.treeItem;
                entry.sections = [
                    {
                        parent: entry,
                        type: "adminSection",
                        treeItem: new AdminSectionTreeItem_1.AdminSectionTreeItem("Server Status", item.backend, item.connectionId, "adminServerStatus.svg", false, serverStatusCommand),
                    },
                    {
                        parent: entry,
                        type: "adminSection",
                        treeItem: new AdminSectionTreeItem_1.AdminSectionTreeItem("Client Connections", item.backend, item.connectionId, "clientConnections.svg", false, clientConnectionsCommand),
                    },
                    {
                        parent: entry,
                        type: "adminSection",
                        treeItem: new AdminSectionTreeItem_1.AdminSectionTreeItem("Performance Dashboard", item.backend, item.connectionId, "adminPerformanceDashboard.svg", false, performanceDashboardCommand),
                    },
                ];
                return entry.sections;
            }
            case "schema": {
                const item = entry.treeItem;
                entry.groups = [
                    {
                        parent: entry,
                        type: "schemaMemberGroup",
                        treeItem: new SchemaGroupTreeItem_1.SchemaGroupTreeItem(item.schema, item.backend, item.connectionId, SchemaIndex_1.SchemaItemGroupType.Tables),
                        members: [],
                    },
                    {
                        parent: entry,
                        type: "schemaMemberGroup",
                        treeItem: new SchemaGroupTreeItem_1.SchemaGroupTreeItem(item.schema, item.backend, item.connectionId, SchemaIndex_1.SchemaItemGroupType.Views),
                        members: [],
                    },
                ];
                if (entry.parent.treeItem.details.dbType === ShellInterface_1.DBType.MySQL) {
                    entry.groups.push({
                        parent: entry,
                        type: "schemaMemberGroup",
                        treeItem: new SchemaGroupTreeItem_1.SchemaGroupTreeItem(item.schema, item.backend, item.connectionId, SchemaIndex_1.SchemaItemGroupType.Routines),
                        members: [],
                    }, {
                        parent: entry,
                        type: "schemaMemberGroup",
                        treeItem: new SchemaGroupTreeItem_1.SchemaGroupTreeItem(item.schema, item.backend, item.connectionId, SchemaIndex_1.SchemaItemGroupType.Events),
                        members: [],
                    });
                }
                return entry.groups;
            }
            case "schemaMemberGroup": {
                await this.loadSchemaGroupMembers(entry);
                return entry.members;
            }
            case "table": {
                const item = entry.treeItem;
                entry.groups = [];
                for (const type of [
                    SchemaIndex_1.SchemaItemGroupType.Columns, SchemaIndex_1.SchemaItemGroupType.Indexes,
                    SchemaIndex_1.SchemaItemGroupType.ForeignKeys, SchemaIndex_1.SchemaItemGroupType.Triggers,
                ]) {
                    entry.groups.push({
                        parent: entry,
                        type: "tableMemberGroup",
                        treeItem: new SchemaTableGroupTreeItem_1.TableGroupTreeItem(item.schema, item.name, item.backend, item.connectionId, type),
                        members: [],
                    });
                }
                return entry.groups;
            }
            case "tableMemberGroup": {
                await this.loadTableMembers(entry);
                return entry.members;
            }
            case "mrs": {
                await this.loadMrsServices(entry);
                return [...entry.services, ...entry.routers];
            }
            case "mrsService": {
                await this.loadMrsServiceEntries(entry);
                return [...entry.schemas, ...entry.contentSets, ...entry.authApps];
            }
            case "mrsAuthApp": {
                await this.loadMrsAuthAppUsers(entry);
                return entry.users;
            }
            case "mrsContentSet": {
                await this.loadMrsContentSetFiles(entry);
                return entry.files;
            }
            case "mrsSchema": {
                await this.loadMrsDbObjects(entry);
                return entry.dbObjects;
            }
            default: {
                return Promise.resolve([]);
            }
        }
    }
    async closeAllConnections() {
        for (const entry of this.connections) {
            await entry.treeItem.backend.closeSession().catch(() => { });
        }
        this.connections = [];
    }
    didExpandElement = (entry) => {
        if (entry.type === "mrs") {
            this.expandedMrsTreeItems.add(entry);
        }
    };
    didCollapseElement = (entry) => {
        if (entry.type === "mrs") {
            this.expandedMrsTreeItems.delete(entry);
        }
    };
    refreshMrsRouters = () => {
        if (this.refreshMrsRoutersTimer !== null) {
            clearTimeout(this.refreshMrsRoutersTimer);
        }
        for (const item of this.expandedMrsTreeItems) {
            this.refresh(item);
        }
        this.refreshMrsRoutersTimer = setTimeout(() => {
            this.refreshMrsRouters();
        }, 10000);
    };
    async updateConnections() {
        if (WebSession_1.webSession.currentProfileId === -1) {
            await this.closeAllConnections();
        }
        else {
            try {
                const detailList = await ShellInterface_2.ShellInterface.dbConnections.listDbConnections(WebSession_1.webSession.currentProfileId);
                let left = 0;
                let right = 0;
                while (left < this.connections.length && detailList.length > 0) {
                    if (this.connections[left].treeItem.details.caption === detailList[right].caption) {
                        if (right > 0) {
                            for (let i = 0; i < right; ++i) {
                                const details = detailList[i];
                                this.connections.splice(left, 0, {
                                    id: ConnectionsTreeDataProvider.nextId++,
                                    type: "connection",
                                    isOpen: false,
                                    openEditors: 0,
                                    currentSchema: "",
                                    treeItem: details.dbType === ShellInterface_1.DBType.MySQL
                                        ? new ConnectionMySQLTreeItem_1.ConnectionMySQLTreeItem(details, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor())
                                        : new ConnectionSqliteTreeItem_1.ConnectionSqliteTreeItem(details, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor()),
                                    schemaEntries: [],
                                });
                            }
                            detailList.splice(0, right);
                            right = 0;
                        }
                        ++left;
                        detailList.shift();
                    }
                    else {
                        while (++right < detailList.length) {
                            if (this.connections[left].treeItem.details.caption === detailList[right].caption) {
                                break;
                            }
                        }
                        if (right === detailList.length) {
                            const entry = this.connections.splice(left, 1)[0];
                            void entry.treeItem.backend.closeSession();
                            right = 0;
                        }
                    }
                }
                while (detailList.length > 0) {
                    ++left;
                    const details = detailList.shift();
                    this.connections.push({
                        id: ConnectionsTreeDataProvider.nextId++,
                        type: "connection",
                        isOpen: false,
                        openEditors: 0,
                        currentSchema: "",
                        treeItem: details.dbType === ShellInterface_1.DBType.MySQL
                            ? new ConnectionMySQLTreeItem_1.ConnectionMySQLTreeItem(details, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor())
                            : new ConnectionSqliteTreeItem_1.ConnectionSqliteTreeItem(details, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor()),
                        schemaEntries: [],
                    });
                }
                while (left < this.connections.length) {
                    const entry = this.connections.splice(left, 1)[0];
                    await entry.treeItem.backend.closeSession();
                }
            }
            catch (reason) {
                void vscode_1.window.showErrorMessage(`Cannot load DB connections: ${String(reason)}`);
                throw reason;
            }
        }
    }
    updateSchemaList = async (entry) => {
        if (entry.isOpen) {
            return this.doUpdateSchemaList(entry);
        }
        const item = entry.treeItem;
        await item.backend.startSession(String(entry.id) + "ConnectionTreeProvider");
        try {
            if (item.details.dbType === ShellInterface_1.DBType.Sqlite) {
                const options = item.details.options;
                if (await ShellInterface_2.ShellInterface.core.validatePath(options.dbFile)) {
                    await (0, utilitiesShellGui_1.openSqlEditorConnection)(item.backend, item.details.id, (message) => {
                        (0, extension_1.showStatusText)(message);
                    });
                    entry.isOpen = true;
                    return this.doUpdateSchemaList(entry);
                }
                else {
                    try {
                        await ShellInterface_2.ShellInterface.core.createDatabaseFile(options.dbFile);
                        return this.doUpdateSchemaList(entry);
                    }
                    catch (error) {
                        throw Error(`DB Creation Error: \n${String(error) ?? "<unknown>"}`);
                    }
                }
            }
            else {
                await (0, utilitiesShellGui_1.openSqlEditorConnection)(item.backend, item.details.id, (message) => {
                    (0, extension_1.showStatusText)(message);
                });
                entry.isOpen = true;
                return this.doUpdateSchemaList(entry);
            }
        }
        catch (error) {
            await item.backend.closeSession();
            throw new Error(`Error during module session creation: \n` +
                `${(error instanceof Error) ? error.message : String(error)}`);
        }
    };
    doUpdateSchemaList = async (entry) => {
        try {
            const item = entry.treeItem;
            entry.schemaEntries = [];
            if (item.details.dbType === ShellInterface_1.DBType.MySQL) {
                entry.adminEntry = {
                    parent: entry,
                    type: "admin",
                    treeItem: new AdminTreeItem_1.AdminTreeItem("MySQL Administration", item.backend, item.details.id, true),
                    sections: [],
                };
            }
            const schemas = await item.backend.getCatalogObjects("Schema");
            for (const schema of schemas) {
                if (item.details.dbType === "MySQL") {
                    if (schema === "mysql_rest_service_metadata") {
                        try {
                            let addMrsTreeItem = true;
                            const status = await item.backend.mrs.status();
                            this.requiredRouterVersion = status.requiredRouterVersion;
                            if (status.majorUpgradeRequired) {
                                addMrsTreeItem = false;
                                let answer = await vscode_1.window.showInformationMessage("This MySQL Shell version requires a new major version of the MRS metadata " +
                                    `schema, ${String(status.requiredMetadataVersion)}. The currently deployed ` +
                                    `schema version is ${String(status.currentMetadataVersion)}. You need to ` +
                                    "downgrade the MySQL Shell version or drop and recreate the MRS metadata " +
                                    "schema. Do you want to drop and recreate the MRS metadata schema? " +
                                    "WARNING: All existing MRS data will be lost.", "Yes", "No");
                                if (answer === "Yes") {
                                    answer = await vscode_1.window.showInformationMessage("Are you really sure you want to drop and recreate the MRS metadata " +
                                        "schema? WARNING: All existing MRS data will be lost.", "Drop and Recreate", "No");
                                    if (answer === "Drop and Recreate") {
                                        await item.backend.mrs.configure(true, true);
                                        addMrsTreeItem = true;
                                    }
                                }
                            }
                            else if (status.serviceUpgradeable) {
                                addMrsTreeItem = false;
                                const answer = await vscode_1.window.showInformationMessage("This MySQL Shell version requires a new minor version of the MRS metadata " +
                                    `schema, ${String(status.requiredMetadataVersion)}. The currently deployed ` +
                                    `schema version is ${String(status.currentMetadataVersion)}. Do you want to ` +
                                    "update the MRS metadata schema?", "Yes", "No");
                                if (answer === "Yes") {
                                    addMrsTreeItem = true;
                                    const statusbarItem = vscode_1.window.createStatusBarItem();
                                    try {
                                        statusbarItem.text = "$(loading~spin) Updating the MySQL REST Service " +
                                            "Metadata Schema ...";
                                        statusbarItem.show();
                                        await item.backend.mrs.configure(true, false, true);
                                        (0, utilities_1.showMessageWithTimeout)("The MySQL REST Service Metadata Schema has been updated.");
                                    }
                                    finally {
                                        statusbarItem.hide();
                                    }
                                }
                            }
                            if (addMrsTreeItem) {
                                entry.mrsEntry = {
                                    parent: entry,
                                    type: "mrs",
                                    treeItem: new MrsTreeItem_1.MrsTreeItem("MySQL REST Service", schema, item.backend, item.details.id, true, status.serviceEnabled),
                                    routers: [],
                                    services: [],
                                };
                            }
                        }
                        catch (reason) {
                            void vscode_1.window.showErrorMessage("Failed to check and upgrade the MySQL REST Service Schema. " +
                                `Error: ${reason instanceof Error ? reason.message : String(reason)}`);
                        }
                    }
                    const hideSystemSchemas = item.details.hideSystemSchemas ?? true;
                    if ((schema !== "mysql" &&
                        schema !== "mysql_innodb_cluster_metadata" &&
                        schema !== "mysql_rest_service_metadata")
                        || !hideSystemSchemas) {
                        entry.schemaEntries.push({
                            parent: entry,
                            type: "schema",
                            treeItem: new SchemaMySQLTreeItem_1.SchemaMySQLTreeItem(schema, schema, item.backend, item.details.id, schema === entry.currentSchema, true),
                            groups: [],
                        });
                    }
                }
                else {
                    entry.schemaEntries.push({
                        parent: entry,
                        type: "schema",
                        treeItem: new SchemaSqliteTreeItem_1.SchemaSqliteTreeItem(schema, schema, item.backend, item.details.id, schema === entry.currentSchema, true),
                        groups: [],
                    });
                }
            }
        }
        catch (error) {
            throw new Error(`Error retrieving schema list: ${error instanceof Error ? error.message : String(error)}`);
        }
    };
    async loadSchemaGroupMembers(entry) {
        const item = entry.treeItem;
        const isMySQL = entry.parent.parent.treeItem.details.dbType === "MySQL";
        switch (entry.treeItem.groupType) {
            case "Routines": {
                const createItems = (type, list) => {
                    for (const objectName of list) {
                        if (isMySQL) {
                            entry.members.push({
                                parent: entry,
                                type: "routine",
                                treeItem: new SchemaRoutineMySQLTreeItem_1.SchemaRoutineMySQLTreeItem(objectName, item.schema, type, item.backend, item.connectionId, false),
                            });
                        }
                        else {
                            entry.members.push({
                                parent: entry,
                                type: "routine",
                                treeItem: new SchemaRoutineTreeItem_1.SchemaRoutineTreeItem(objectName, item.schema, type, item.backend, item.connectionId, false),
                            });
                        }
                    }
                };
                try {
                    let names = await item.backend.getSchemaObjects(item.schema, "Routine", "function");
                    createItems("function", names);
                    names = await item.backend.getSchemaObjects(item.schema, "Routine", "procedure");
                    createItems("procedure", names);
                }
                catch (error) {
                    void vscode_1.window.showErrorMessage("Error while retrieving schema objects: " + String(error));
                }
                break;
            }
            default: {
                try {
                    const objectType = entry.treeItem.groupType.slice(0, -1);
                    const names = await item.backend.getSchemaObjects(item.schema, objectType);
                    names.forEach((objectName) => {
                        switch (entry.treeItem.groupType) {
                            case SchemaIndex_1.SchemaItemGroupType.Tables: {
                                if (isMySQL) {
                                    entry.members.push({
                                        parent: entry,
                                        type: "table",
                                        treeItem: new SchemaTableMySQLTreeItem_1.SchemaTableMySQLTreeItem(objectName, item.schema, item.backend, item.connectionId, true),
                                        groups: [],
                                    });
                                }
                                else {
                                    entry.members.push({
                                        parent: entry,
                                        type: "table",
                                        treeItem: new SchemaTableSqliteTreeItem_1.SchemaTableSqliteTreeItem(objectName, item.schema, item.backend, item.connectionId, true),
                                        groups: [],
                                    });
                                }
                                break;
                            }
                            case SchemaIndex_1.SchemaItemGroupType.Views: {
                                if (isMySQL) {
                                    entry.members.push({
                                        parent: entry,
                                        type: "view",
                                        treeItem: new SchemaViewMySQLTreeItem_1.SchemaViewMySQLTreeItem(objectName, item.schema, item.backend, item.connectionId, true),
                                    });
                                }
                                else {
                                    entry.members.push({
                                        parent: entry,
                                        type: "view",
                                        treeItem: new SchemaViewSqliteTreeItem_1.SchemaViewSqliteTreeItem(objectName, item.schema, item.backend, item.connectionId, true),
                                    });
                                }
                                break;
                            }
                            case SchemaIndex_1.SchemaItemGroupType.Events: {
                                entry.members.push({
                                    parent: entry,
                                    type: "event",
                                    treeItem: new SchemaEventTreeItem_1.SchemaEventTreeItem(objectName, item.schema, item.backend, item.connectionId, false),
                                });
                                break;
                            }
                            default:
                        }
                    });
                }
                catch (error) {
                    void vscode_1.window.showErrorMessage("Error while retrieving schema objects: " + error);
                }
            }
        }
    }
    async loadTableMembers(entry) {
        const item = entry.treeItem;
        switch (item.groupType) {
            case SchemaIndex_1.SchemaItemGroupType.Columns: {
                const names = await item.backend.getTableObjects(item.schema, item.table, "Column");
                names.forEach((objectName) => {
                    entry.members.push({
                        parent: entry,
                        type: "column",
                        treeItem: new SchemaTableColumnTreeItem_1.SchemaTableColumnTreeItem(objectName, item.schema, item.table, item.backend, item.connectionId),
                    });
                });
                break;
            }
            case SchemaIndex_1.SchemaItemGroupType.Indexes: {
                const names = await item.backend.getTableObjects(item.schema, item.table, "Index");
                names.forEach((objectName) => {
                    entry.members.push({
                        parent: entry,
                        type: "index",
                        treeItem: new SchemaTableIndexTreeItem_1.SchemaTableIndexTreeItem(objectName, item.schema, item.table, item.backend, item.connectionId),
                    });
                });
                break;
            }
            case SchemaIndex_1.SchemaItemGroupType.Triggers: {
                const names = await item.backend.getTableObjects(item.schema, item.table, "Trigger");
                names.forEach((objectName) => {
                    entry.members.push({
                        parent: entry,
                        type: "trigger",
                        treeItem: new SchemaTableTriggerTreeItem_1.SchemaTableTriggerTreeItem(objectName, item.schema, item.table, item.backend, item.connectionId),
                    });
                });
                break;
            }
            case SchemaIndex_1.SchemaItemGroupType.ForeignKeys: {
                const names = await item.backend.getTableObjects(item.schema, item.table, "Foreign Key");
                names.forEach((objectName) => {
                    entry.members.push({
                        parent: entry,
                        type: "foreignKey",
                        treeItem: new SchemaTableForeignKeyTreeItem_1.SchemaTableForeignKeyTreeItem(objectName, item.schema, item.table, item.backend, item.connectionId),
                    });
                });
                break;
            }
            default:
        }
    }
    async loadMrsServices(entry) {
        try {
            const item = entry.treeItem;
            const services = await item.backend.mrs.listServices();
            entry.services = services.map((value) => {
                let label = value.urlContextRoot;
                if (value.urlHostName) {
                    label = label + ` (${value.urlHostName})`;
                }
                return {
                    parent: entry,
                    type: "mrsService",
                    treeItem: new MrsServiceTreeItem_1.MrsServiceTreeItem(label, value, item.backend, item.connectionId),
                    schemas: [],
                    contentSets: [],
                    authApps: [],
                };
            });
            const routers = await item.backend.mrs.listRouters(10);
            entry.routers = routers.map((value) => {
                return {
                    parent: entry,
                    type: "mrsRouter",
                    treeItem: new MrsRouterTreeItem_1.MrsRouterTreeItem(value.address, value, item.backend, item.connectionId, this.requiredRouterVersion !== undefined
                        ? (0, string_helpers_1.compareVersionStrings)(this.requiredRouterVersion, value.version) > 0
                        : false),
                };
            });
            this.#errorAlreadyDisplayed = false;
        }
        catch (error) {
            if (!this.#errorAlreadyDisplayed) {
                vscode_1.window.setStatusBarMessage("An error occurred while retrieving MRS content. " +
                    `Error: ${error instanceof Error ? error.message : String(error) ?? "<unknown>"}`, 10000);
                this.#errorAlreadyDisplayed = true;
            }
            entry.services = [];
            entry.routers = [];
        }
    }
    loadMrsServiceEntries = async (entry) => {
        try {
            const item = entry.treeItem;
            const schemas = await item.backend.mrs.listSchemas(item.value.id);
            entry.schemas = schemas.map((value) => {
                return {
                    parent: entry,
                    type: "mrsSchema",
                    treeItem: new MrsSchemaTreeItem_1.MrsSchemaTreeItem(`${value.requestPath} (${value.name})`, value, item.backend, item.connectionId),
                    dbObjects: [],
                };
            });
            const contentSets = await item.backend.mrs.listContentSets(item.value.id);
            entry.contentSets = contentSets.map((value) => {
                return {
                    parent: entry,
                    type: "mrsContentSet",
                    treeItem: new MrsContentSetTreeItem_1.MrsContentSetTreeItem(`${value.requestPath}`, value, item.backend, item.connectionId),
                    files: [],
                };
            });
            const authApps = await item.backend.mrs.getAuthApps(item.value.id);
            entry.authApps = authApps.map((value) => {
                const name = value.name ?? "unknown";
                const vendor = value.authVendor ?? "unknown";
                return {
                    parent: entry,
                    type: "mrsAuthApp",
                    treeItem: new MrsAuthAppTreeItem_1.MrsAuthAppTreeItem(`${name} (${vendor})`, value, item.backend, item.connectionId),
                    users: [],
                };
            });
            this.#errorAlreadyDisplayed = false;
        }
        catch (error) {
            if (!this.#errorAlreadyDisplayed) {
                vscode_1.window.setStatusBarMessage("An error occurred while retrieving MRS services. " +
                    `Error: ${error instanceof Error ? error.message : String(error) ?? "<unknown>"}`, 10000);
                this.#errorAlreadyDisplayed = true;
            }
            entry.schemas = [];
            entry.contentSets = [];
            entry.authApps = [];
        }
    };
    loadMrsAuthAppUsers = async (entry) => {
        try {
            const item = entry.treeItem;
            const users = await item.backend.mrs.listUsers(undefined, item.value.id);
            entry.users = users.map((value) => {
                return {
                    parent: entry,
                    type: "mrsUser",
                    treeItem: new MrsUserTreeItem_1.MrsUserTreeItem(value.name ?? "unknown", value, item.backend, item.connectionId),
                };
            });
            this.#errorAlreadyDisplayed = false;
        }
        catch (error) {
            if (!this.#errorAlreadyDisplayed) {
                vscode_1.window.setStatusBarMessage("An error occurred while retrieving MRS users. " +
                    `Error: ${error instanceof Error ? error.message : String(error) ?? "<unknown>"}`, 10000);
                this.#errorAlreadyDisplayed = true;
            }
            entry.users = [];
        }
    };
    loadMrsContentSetFiles = async (entry) => {
        try {
            const item = entry.treeItem;
            const contentFiles = await item.backend.mrs.listContentFiles(item.value.id);
            entry.files = contentFiles.map((value) => {
                return {
                    parent: entry,
                    type: "mrsContentFile",
                    treeItem: new MrsContentFileTreeItem_1.MrsContentFileTreeItem(`${value.requestPath} (${(0, string_helpers_1.formatBytes)(value.size)})`, value, item.backend, item.connectionId),
                };
            });
            this.#errorAlreadyDisplayed = false;
        }
        catch (error) {
            if (!this.#errorAlreadyDisplayed) {
                vscode_1.window.setStatusBarMessage("An error occurred while retrieving MRS content files. " +
                    `Error: ${error instanceof Error ? error.message : String(error) ?? "<unknown>"}`, 10000);
                this.#errorAlreadyDisplayed = true;
            }
            entry.files = [];
        }
    };
    async loadMrsDbObjects(entry) {
        const item = entry.treeItem;
        try {
            const objects = await item.backend.mrs.listDbObjects(item.value.id);
            entry.dbObjects = objects.map((value) => {
                return {
                    parent: entry,
                    type: "mrsDbObject",
                    treeItem: new MrsDbObjectTreeItem_1.MrsDbObjectTreeItem(`${value.requestPath} (${value.name})`, value, item.backend, item.connectionId),
                };
            });
            this.#errorAlreadyDisplayed = false;
        }
        catch (error) {
            if (!this.#errorAlreadyDisplayed) {
                vscode_1.window.setStatusBarMessage("An error occurred while retrieving MRS db objects. " +
                    `Error: ${error instanceof Error ? error.message : String(error) ?? "<unknown>"}`, 10000);
                this.#errorAlreadyDisplayed = true;
            }
            entry.dbObjects = [];
        }
    }
    refreshConnections = (data) => {
        this.refresh(data?.entry);
        return Promise.resolve(true);
    };
    proxyRequest = async (request) => {
        switch (request.original.requestType) {
            case "sqlSetCurrentSchema": {
                const response = request.original.parameter;
                const connection = this.connections.find((value) => {
                    return value.treeItem.details.id === response.connectionId;
                });
                if (connection && connection.currentSchema !== response.schema) {
                    connection.currentSchema = response.schema;
                    return this.refreshConnections({ entry: connection });
                }
                break;
            }
            case "refreshConnections": {
                const data = request.original.parameter;
                return this.refreshConnections(data);
            }
            case "connectionAdded": {
                const response = request.original.parameter;
                let connection = this.connections.find((value) => {
                    return value.treeItem.details.id === response.id;
                });
                if (!connection) {
                    let treeItem;
                    if (response.dbType === ShellInterface_1.DBType.MySQL) {
                        treeItem = new ConnectionMySQLTreeItem_1.ConnectionMySQLTreeItem(response, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor());
                    }
                    else {
                        treeItem = new ConnectionSqliteTreeItem_1.ConnectionSqliteTreeItem(response, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor());
                    }
                    connection = {
                        id: ConnectionsTreeDataProvider.nextId++,
                        type: "connection",
                        isOpen: false,
                        openEditors: 0,
                        currentSchema: "",
                        treeItem,
                        schemaEntries: [],
                    };
                    this.connections.push(connection);
                    this.refresh();
                }
                break;
            }
            case "connectionUpdated": {
                const response = request.original.parameter;
                const connection = this.connections.find((value) => {
                    return value.treeItem.details.id === response.id;
                });
                if (connection) {
                    let treeItem;
                    if (response.dbType === ShellInterface_1.DBType.MySQL) {
                        treeItem = new ConnectionMySQLTreeItem_1.ConnectionMySQLTreeItem(response, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor());
                    }
                    else {
                        treeItem = new ConnectionSqliteTreeItem_1.ConnectionSqliteTreeItem(response, new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor());
                    }
                    connection.treeItem = treeItem;
                    this.refresh(connection);
                }
                break;
            }
            case "connectionRemoved": {
                const response = request.original.parameter;
                const connection = this.connections.find((value) => {
                    return value.treeItem.details.id === response.id;
                });
                if (connection) {
                    await connection.treeItem.backend.closeSession();
                    this.connections.splice(this.connections.indexOf(connection), 1);
                }
                this.refresh();
                break;
            }
            case "editorsChanged": {
                const response = request.original.parameter;
                const connection = this.connections.find((value) => {
                    return value.treeItem.details.id === response.connectionId;
                });
                if (connection) {
                    if (response.opened) {
                        ++connection.openEditors;
                    }
                    else {
                        --connection.openEditors;
                        if (connection.openEditors === 0) {
                            connection.currentSchema = "";
                            return this.refreshConnections({ entry: connection });
                        }
                    }
                }
                return Promise.resolve(true);
            }
            default:
        }
        return Promise.resolve(false);
    };
}
exports.ConnectionsTreeDataProvider = ConnectionsTreeDataProvider;
//# sourceMappingURL=ConnectionsTreeProvider.js.map