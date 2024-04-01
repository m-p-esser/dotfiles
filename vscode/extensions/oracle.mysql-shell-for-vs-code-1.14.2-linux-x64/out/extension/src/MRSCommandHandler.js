"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MRSCommandHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const vscode_1 = require("vscode");
const ShellInterface_1 = require("../../frontend/src/supplement/ShellInterface");
const MySQL_1 = require("../../frontend/src/communication/MySQL");
const ModuleInfo_1 = require("../../frontend/src/modules/ModuleInfo");
const ShellInterfaceSqlEditor_1 = require("../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor");
const file_utilities_1 = require("../../frontend/src/utilities/file-utilities");
const MySQLShellLauncher_1 = require("../../frontend/src/utilities/MySQLShellLauncher");
const string_helpers_1 = require("../../frontend/src/utilities/string-helpers");
const utilities_1 = require("./utilities");
const utilitiesShellGui_1 = require("./utilitiesShellGui");
class MRSCommandHandler {
    #docsWebviewPanel;
    #docsCurrentFile;
    #host;
    setup = (host) => {
        this.#host = host;
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.configureMySQLRestService", async (entry) => {
            await this.configureMrs(entry);
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.disableMySQLRestService", async (entry) => {
            await this.configureMrs(entry?.parent, false);
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.enableMySQLRestService", async (entry) => {
            await this.configureMrs(entry?.parent, true);
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.bootstrapLocalRouter", async (entry) => {
            await this.bootstrapLocalRouter(host.context, entry);
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.startLocalRouter", async (entry) => {
            await this.startStopLocalRouter(host.context, entry);
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.killLocalRouters", () => {
            let term = vscode_1.window.terminals.find((t) => { return t.name === "MySQL Router MRS"; });
            if (term === undefined) {
                term = vscode_1.window.createTerminal("MySQL Router MRS");
            }
            if (os_1.default.platform() === "win32") {
                term.sendText("taskkill /IM mysqlrouter.exe /F", true);
            }
            else {
                term.sendText("killall -9 mysqlrouter", true);
            }
            try {
                fs_1.default.unlinkSync(path_1.default.join(this.getLocalRouterConfigDir(), "mysqlrouter.pid"));
            }
            catch (error) {
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.stopLocalRouter", async (item) => {
            await this.startStopLocalRouter(host.context, item, false);
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.docs", () => {
            this.browseDocs();
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.docs.service", () => {
            this.browseDocs("rest-service-properties");
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.deleteRouter", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const answer = await vscode_1.window.showInformationMessage(`Are you sure the MRS router ${item.value.address} should be deleted?`, "Yes", "No");
                if (answer === "Yes") {
                    try {
                        await item.backend?.mrs.deleteRouter(item.value.id);
                        await vscode_1.commands.executeCommand("msg.refreshConnections");
                        (0, utilities_1.showMessageWithTimeout)("The MRS Router has been deleted successfully.");
                    }
                    catch (error) {
                        void vscode_1.window.showErrorMessage(`Error deleting the MRS Router: ${String(error)}`);
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.addService", (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const connectionId = String(item.connectionId);
                const provider = this.#host.currentProvider;
                if (provider) {
                    void provider.runCommand("job", [
                        { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                        { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: connectionId } },
                        { requestType: "showMrsServiceDialog", parameter: undefined },
                    ], "newConnection");
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.editService", (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const connectionId = String(item.connectionId);
                const provider = this.#host.currentProvider;
                if (provider) {
                    void provider.runCommand("job", [
                        { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                        { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: connectionId } },
                        { requestType: "showMrsServiceDialog", parameter: item.value },
                    ], "newConnection");
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.deleteService", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const answer = await vscode_1.window.showInformationMessage(`Are you sure the MRS service ${item.value.urlContextRoot} should be deleted?`, "Yes", "No");
                if (answer === "Yes") {
                    try {
                        await item.backend?.mrs.deleteService(item.value.id);
                        await vscode_1.commands.executeCommand("msg.refreshConnections");
                        (0, utilities_1.showMessageWithTimeout)("The MRS service has been deleted successfully.");
                    }
                    catch (error) {
                        void vscode_1.window.showErrorMessage(`Error adding the MRS service: ${String(error)}`);
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.setCurrentService", async (entry) => {
            if (entry) {
                try {
                    const item = entry.treeItem;
                    await item.backend?.mrs.setCurrentService(item.value.id);
                    await vscode_1.commands.executeCommand("msg.refreshConnections");
                    (0, utilities_1.showMessageWithTimeout)("The MRS service has been set as the new default service.");
                }
                catch (reason) {
                    void vscode_1.window.showErrorMessage(`Error setting the default MRS service: ${String(reason)}`);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.exportServiceSdk", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const backend = item.backend;
                    await vscode_1.window.showSaveDialog({
                        title: "Export REST Service SDK Files...",
                        defaultUri: vscode_1.Uri.file(`${os_1.default.homedir()}/${(0, string_helpers_1.pathToCamelCase)(item.value.urlContextRoot)}` +
                            `.mrs.sdk`),
                        saveLabel: "Export SDK Files",
                    }).then(async (value) => {
                        if (value !== undefined) {
                            try {
                                const path = value.fsPath;
                                await backend.mrs.dumpSdkServiceFiles(item.value.id, "TypeScript", path);
                                (0, utilities_1.showMessageWithTimeout)("MRS Service REST Files exported successfully.");
                            }
                            catch (error) {
                                void vscode_1.window.showErrorMessage(`Error while exporting the REST Service SDK Files: ${String(error)}`);
                            }
                        }
                    });
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.deleteSchema", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const answer = await vscode_1.window.showInformationMessage(`Are you sure the MRS schema ${item.value.name} should be deleted?`, "Yes", "No");
                if (answer === "Yes") {
                    try {
                        await entry.treeItem.backend.mrs.deleteSchema(item.value.id, item.value.serviceId);
                        await vscode_1.commands.executeCommand("msg.refreshConnections");
                        (0, utilities_1.showMessageWithTimeout)("The MRS schema has been deleted successfully.");
                    }
                    catch (error) {
                        void vscode_1.window.showErrorMessage(`Error removing an MRS schema: ${String(error)}`);
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.editSchema", (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const connectionId = String(item.connectionId);
                const provider = this.#host.currentProvider;
                if (provider) {
                    void provider.runCommand("job", [
                        { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                        { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: connectionId } },
                        {
                            requestType: "showMrsSchemaDialog",
                            parameter: { schemaName: item.value.name, schema: item.value },
                        },
                    ], "newConnection");
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.addSchema", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const connectionId = String(item.connectionId);
                const provider = this.#host.currentProvider;
                if (provider) {
                    const services = await item.backend.mrs.listServices();
                    if (services.length > 0) {
                        void provider.runCommand("job", [
                            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                            {
                                requestType: "showPage", parameter: {
                                    module: ModuleInfo_1.DBEditorModuleId, page: connectionId,
                                },
                            },
                            {
                                requestType: "showMrsSchemaDialog",
                                parameter: { schemaName: item.schema },
                            },
                        ], "newConnection");
                    }
                    else {
                        void vscode_1.window.showErrorMessage(`Please create a REST Service before adding a DB Schema.`);
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.copyDbObjectRequestPath", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const o = item.value;
                    await vscode_1.env.clipboard.writeText((o.hostCtx ?? "") + (o.schemaRequestPath ?? "") + o.requestPath);
                    (0, utilities_1.showMessageWithTimeout)("The DB Object was copied to the system clipboard");
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.openDbObjectRequestPath", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const o = item.value;
                    let url = (o.hostCtx ?? "") + (o.schemaRequestPath ?? "") + o.requestPath;
                    if (url.startsWith("/")) {
                        url = `https://localhost:8443${url}`;
                    }
                    else {
                        url = `https://${url}`;
                    }
                    await vscode_1.env.openExternal(vscode_1.Uri.parse(url));
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.openContentFileRequestPath", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const o = item.value;
                    let url = (o.hostCtx ?? "") + (o.contentSetRequestPath ?? "") + o.requestPath;
                    if (url.startsWith("/")) {
                        url = `https://localhost:8443${url}`;
                    }
                    else {
                        url = `https://${url}`;
                    }
                    await vscode_1.env.openExternal(vscode_1.Uri.parse(url));
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.deleteDbObject", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const backend = item.backend;
                    const accepted = await (0, utilities_1.showModalDialog)(`Are you sure you want to delete the REST DB Object ${item.value.name}?`, "Delete DB Object", "This operation cannot be reverted!");
                    if (accepted) {
                        try {
                            await backend.mrs.deleteDbObject(item.value.id);
                            void vscode_1.commands.executeCommand("msg.refreshConnections");
                            (0, utilities_1.showMessageWithTimeout)(`The REST DB Object ${item.value.name} has been deleted.`);
                        }
                        catch (reason) {
                            void vscode_1.window.showErrorMessage(`Error deleting the REST DB Object: ${String(reason)}`);
                        }
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.editAuthApp", (entry) => {
            if (entry) {
                const item = entry.treeItem;
                const connectionId = String(item.connectionId);
                const provider = this.#host.currentProvider;
                if (provider) {
                    void provider.runCommand("job", [
                        { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                        { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: connectionId } },
                        { requestType: "showMrsAuthAppDialog", parameter: { authApp: item.value } },
                    ], "newConnection");
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.addAuthApp", (entry) => {
            try {
                if (entry) {
                    const item = entry.treeItem;
                    if (item.value) {
                        const connectionId = String(item.connectionId);
                        const provider = this.#host.currentProvider;
                        if (provider) {
                            void provider.runCommand("job", [
                                { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                                {
                                    requestType: "showPage",
                                    parameter: { module: ModuleInfo_1.DBEditorModuleId, page: connectionId },
                                },
                                { requestType: "showMrsAuthAppDialog", parameter: { service: item.value } },
                            ], "newConnection");
                        }
                    }
                }
            }
            catch (reason) {
                void vscode_1.window.showErrorMessage(`Error adding a new MRS Authentication App: ${String(reason)}`);
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.deleteAuthApp", async (entry) => {
            try {
                if (entry) {
                    const item = entry.treeItem;
                    if (item.value?.name) {
                        const backend = item.backend;
                        const answer = await vscode_1.window.showInformationMessage(`Are you sure the MRS authentication app ${item.value.name} should be deleted?`, "Yes", "No");
                        if (answer === "Yes") {
                            await backend.mrs.deleteAuthApp(item.value.id);
                            void vscode_1.commands.executeCommand("msg.refreshConnections");
                            (0, utilities_1.showMessageWithTimeout)(`The MRS Authentication App ${item.value.name} ` +
                                `has been deleted.`);
                        }
                    }
                }
            }
            catch (reason) {
                void vscode_1.window.showErrorMessage(`Error deleting the MRS Authentication App: ${String(reason)}`);
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.deleteUser", async (entry) => {
            try {
                if (entry) {
                    const item = entry.treeItem;
                    if (item.value.id && item.value.name) {
                        const backend = item.backend;
                        const answer = await vscode_1.window.showInformationMessage(`Are you sure the MRS user ${item.value.name ?? "unknown"} should be deleted?`, "Yes", "No");
                        if (answer === "Yes") {
                            await backend.mrs.deleteUser(item.value.id);
                            void vscode_1.commands.executeCommand("msg.refreshConnections");
                            (0, utilities_1.showMessageWithTimeout)(`The MRS User ${item.value.name} has been deleted.`);
                        }
                    }
                }
            }
            catch (reason) {
                void vscode_1.window.showErrorMessage(`Error deleting the MRS User: ${String(reason)}`);
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.addUser", (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const connectionId = String(item.connectionId);
                    const provider = this.#host.currentProvider;
                    if (provider) {
                        void provider.runCommand("job", [
                            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                            { requestType: "showPage", parameter: { module: ModuleInfo_1.DBEditorModuleId, page: connectionId } },
                            { requestType: "showMrsUserDialog", parameter: { authApp: item.value } },
                        ], "newConnection");
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.editUser", (entry) => {
            const item = entry?.treeItem;
            const backend = item?.backend;
            try {
                if (backend && item.value && item.value.authAppId) {
                    backend.mrs.getAuthApp(item.value.authAppId).then((authApp) => {
                        if (authApp) {
                            const connectionId = String(item.connectionId);
                            const provider = this.#host.currentProvider;
                            if (provider) {
                                void provider.runCommand("job", [
                                    { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                                    {
                                        requestType: "showPage", parameter: {
                                            module: ModuleInfo_1.DBEditorModuleId, page: connectionId,
                                        },
                                    },
                                    { requestType: "showMrsUserDialog", parameter: { authApp, user: item.value } },
                                ], "newConnection");
                            }
                        }
                        else {
                            throw new Error("Unable to find authApp");
                        }
                    }).catch((reason) => {
                        void vscode_1.window.showErrorMessage(`Error adding a new User: ${String(reason)}`);
                    });
                }
            }
            catch (reason) {
                void vscode_1.window.showErrorMessage(`Error adding a new User: ${String(reason)}`);
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.addFolderAsContentSet", async (directory) => {
            if (directory) {
                const connection = await host.determineConnection(ShellInterface_1.DBType.MySQL);
                if (connection) {
                    const provider = this.#host.currentProvider;
                    if (provider) {
                        void provider.runCommand("job", [
                            { requestType: "showModule", parameter: ModuleInfo_1.DBEditorModuleId },
                            {
                                requestType: "showPage", parameter: {
                                    module: ModuleInfo_1.DBEditorModuleId, page: String(connection.treeItem.details.id),
                                },
                            },
                            {
                                requestType: "showMrsContentSetDialog", parameter: {
                                    directory: directory.fsPath,
                                },
                            },
                        ], "newConnection");
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.rebuildMrsSdk", async (directory) => {
            if (directory) {
                const connection = await host.determineConnection(ShellInterface_1.DBType.MySQL);
                if (connection) {
                    void vscode_1.window.showErrorMessage("Not yet implemented.");
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.deleteContentSet", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const backend = item.backend;
                    const accepted = await (0, utilities_1.showModalDialog)(`Are you sure you want to drop the static content set ${item.value.requestPath}?`, "Delete Static Content Set", "This operation cannot be reverted!");
                    if (accepted) {
                        try {
                            await backend.mrs.deleteContentSet(item.value.id);
                            void vscode_1.commands.executeCommand("msg.refreshConnections");
                            (0, utilities_1.showMessageWithTimeout)("The MRS static content set has been deleted successfully.");
                        }
                        catch (error) {
                            void vscode_1.window.showErrorMessage(`Error deleting the Static Content Set: ${String(error)}`);
                        }
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.dumpSchemaToJSONFile", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const backend = item.backend;
                    await vscode_1.window.showSaveDialog({
                        title: "REST Schema Dump...",
                        saveLabel: "Select the target file",
                        defaultUri: vscode_1.Uri.file(`${os_1.default.homedir()}/${(0, string_helpers_1.pathToCamelCase)(item.value.requestPath)}.mrs.json`),
                        filters: {
                            JSON: ["mrs.json"],
                        },
                    }).then(async (value) => {
                        if (value !== undefined) {
                            try {
                                const path = value.fsPath;
                                await backend.mrs.dumpSchema(path, item.value.serviceId, undefined, item.value.id);
                                (0, utilities_1.showMessageWithTimeout)("The REST Schema has been dumped successfully.");
                            }
                            catch (error) {
                                void vscode_1.window.showErrorMessage(`Error dumping the REST Schema: ${String(error)}`);
                            }
                        }
                    });
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.dumpObjectToJSONFile", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const backend = item.backend;
                    await vscode_1.window.showSaveDialog({
                        title: "REST Database Object Dump...",
                        saveLabel: "Select the target file",
                        defaultUri: vscode_1.Uri.file(`${os_1.default.homedir()}/${item.value.name}.mrs.json`),
                        filters: {
                            JSON: ["mrs.json"],
                        },
                    }).then(async (value) => {
                        if (value !== undefined) {
                            try {
                                const path = value.fsPath;
                                await backend.mrs.dumpObject(path, item.value.serviceId, undefined, item.value.dbSchemaId, undefined, item.value.id);
                                (0, utilities_1.showMessageWithTimeout)("The REST Database Object has been dumped successfully.");
                            }
                            catch (error) {
                                void vscode_1.window.showErrorMessage(`Error dumping the REST Database Object: ${String(error)}`);
                            }
                        }
                    });
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.loadSchemaFromJSONFile", async (entry) => {
            if (!entry) {
                return;
            }
            if (!(entry instanceof vscode_1.Uri)) {
                if (!entry.treeItem.value) {
                    return;
                }
                const backend = entry.treeItem.backend;
                await vscode_1.window.showOpenDialog({
                    title: "REST Schema Load...",
                    openLabel: "Select the source file",
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        JSON: ["mrs.json"],
                    },
                }).then(async (value) => {
                    if (value !== undefined) {
                        const statusbarItem = vscode_1.window.createStatusBarItem();
                        try {
                            statusbarItem.text = "$(loading~spin) Loading REST Schema ...";
                            statusbarItem.show();
                            const path = value[0].fsPath;
                            await backend.mrs.loadSchema(path, entry.treeItem.value.id);
                            void vscode_1.commands.executeCommand("msg.refreshConnections");
                            (0, utilities_1.showMessageWithTimeout)("The REST Schema has been loaded successfully.");
                        }
                        catch (error) {
                            void vscode_1.window.showErrorMessage(`Error loading REST Schema: ${String(error)}`);
                        }
                        finally {
                            statusbarItem.hide();
                        }
                    }
                });
            }
            else {
                const connection = await host.determineConnection(ShellInterface_1.DBType.MySQL);
                if (connection) {
                    const sqlEditor = new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor();
                    const statusbarItem = vscode_1.window.createStatusBarItem();
                    try {
                        statusbarItem.text = "$(loading~spin) Starting Database Session ...";
                        statusbarItem.show();
                        statusbarItem.text = "$(loading~spin) Starting Database Session ...";
                        await sqlEditor.startSession(String(connection.treeItem.details.id) + "MRSContentSetDlg");
                        statusbarItem.text = "$(loading~spin) Opening Database Connection ...";
                        await (0, utilitiesShellGui_1.openSqlEditorConnection)(sqlEditor, connection.treeItem.details.id, (message) => {
                            statusbarItem.text = "$(loading~spin) " + message;
                        });
                        const services = await sqlEditor.mrs.listServices();
                        let service;
                        if (services.length === 0) {
                            void vscode_1.window.showErrorMessage("No MRS Services available for this connection.");
                        }
                        else if (services.length === 1) {
                            service = services[0];
                        }
                        else {
                            statusbarItem.text = "Please select a MRS Service ...";
                            const items = services.map((service) => {
                                return service.hostCtx;
                            });
                            const serviceHostCtx = await vscode_1.window.showQuickPick(items, {
                                title: "Select a MRS Service to load the MRS schema dump",
                                matchOnDescription: true,
                                placeHolder: "Type the name of an existing MRS Service",
                            });
                            service = services.find((candidate) => {
                                return candidate.hostCtx === serviceHostCtx;
                            });
                        }
                        if (service !== undefined) {
                            statusbarItem.text = "$(loading~spin) Loading REST Schema ...";
                            await sqlEditor.mrs.loadSchema(entry.fsPath, service.id);
                            void vscode_1.commands.executeCommand("msg.refreshConnections");
                            (0, utilities_1.showMessageWithTimeout)("The REST Schema has been loaded successfully.");
                        }
                    }
                    catch (error) {
                        void vscode_1.window.showErrorMessage("A error occurred when trying to show the MRS Static " +
                            `Content Set Dialog. Error: ${error instanceof Error ? error.message : String(error)}`);
                    }
                    finally {
                        statusbarItem.hide();
                        await sqlEditor.closeSession();
                    }
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.loadObjectFromJSONFile", async (entry) => {
            if (entry) {
                const item = entry.treeItem;
                if (item.value) {
                    const backend = item.backend;
                    await vscode_1.window.showOpenDialog({
                        title: "REST Database Object Load...",
                        openLabel: "Select the source file",
                        canSelectFiles: true,
                        canSelectFolders: false,
                        canSelectMany: false,
                        filters: {
                            JSON: ["mrs.json"],
                        },
                    }).then(async (value) => {
                        if (value !== undefined) {
                            try {
                                const path = value[0].fsPath;
                                await backend.mrs.loadObject(path, item.value.serviceId, undefined, item.value.id);
                                void vscode_1.commands.executeCommand("msg.refreshConnections");
                                (0, utilities_1.showMessageWithTimeout)("The REST Database Object has been loaded successfully.");
                            }
                            catch (error) {
                                void vscode_1.window.showErrorMessage(`Error loading REST Database Object: ${String(error)}`);
                            }
                        }
                    });
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mrs.saveExampleProject", async (exampleCodePath) => {
            const path = exampleCodePath.fsPath;
            let m;
            if (os_1.default.platform() === "win32") {
                m = path.match(/([^\\]*)\/*$/);
            }
            else {
                m = path.match(/([^/]*)\/*$/);
            }
            if (m === null) {
                void vscode_1.window.showErrorMessage(`Error storing the MRS Project: Project folder contains no path.`);
                return;
            }
            const dirName = m[1];
            await vscode_1.window.showOpenDialog({
                title: `Saving MRS Example Project "${dirName}" ...`,
                openLabel: `Save ${dirName} Project`,
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                defaultUri: vscode_1.Uri.file(`${os_1.default.homedir()}/Documents`),
            }).then(async (value) => {
                if (value !== undefined) {
                    try {
                        const targetPath = vscode_1.Uri.joinPath(value[0], dirName);
                        const filter = (src) => { return src.indexOf("node_modules") === -1; };
                        fs_1.default.cpSync(path, targetPath.fsPath, { filter, recursive: true });
                        (0, utilities_1.showMessageWithTimeout)(`The MRS Project ${dirName} has been stored successfully.`);
                        const answer = await vscode_1.window.showInformationMessage(`Do you want to open the MRS Project ${dirName} ` +
                            `in a new VS Code Window?`, "Yes", "No");
                        if (answer === "Yes") {
                            void vscode_1.commands.executeCommand(`vscode.openFolder`, targetPath, { forceNewWindow: true });
                        }
                    }
                    catch (error) {
                        void vscode_1.window.showErrorMessage(`Error storing the MRS Project: ${String(error)}`);
                    }
                }
            });
        }));
    };
    configureMrs = async (entry, enableMrs) => {
        let answer = "Yes";
        if (enableMrs === undefined) {
            answer = await vscode_1.window.showInformationMessage(`Do you want to configure this instance for MySQL REST Service Support? ` +
                `This operation will create the MRS metadata database schema.`, "Yes", "No");
        }
        if (entry && answer === "Yes") {
            const sqlEditor = new ShellInterfaceSqlEditor_1.ShellInterfaceSqlEditor();
            try {
                await (0, utilitiesShellGui_1.openSqlEditorSessionAndConnection)(sqlEditor, entry.treeItem.details.id, "msg.mrs.configureMySQLRestService");
                const statusbarItem = vscode_1.window.createStatusBarItem();
                try {
                    statusbarItem.text = "$(loading~spin) Configuring the MySQL REST Service " +
                        "Metadata Schema ...";
                    statusbarItem.show();
                    await sqlEditor.mrs.configure(enableMrs);
                }
                finally {
                    statusbarItem.hide();
                }
                void vscode_1.commands.executeCommand("msg.refreshConnections");
                (0, utilities_1.showMessageWithTimeout)("MySQL REST Service configured successfully.");
            }
            catch (error) {
                void vscode_1.window.showErrorMessage("A error occurred when trying to " +
                    "configure the MySQL REST Service. " +
                    `Error: ${error instanceof Error ? error.message : String(error)}`);
            }
            finally {
                await sqlEditor.closeSession();
            }
        }
    };
    bootstrapLocalRouter = async (context, entry, waitAndClosedWhenFinished = false) => {
        if (entry) {
            if ((0, file_utilities_1.findExecutable)("mysqlrouter_bootstrap").length > 0) {
                const shellConfDir = MySQLShellLauncher_1.MySQLShellLauncher.getShellUserConfigDir(context.extensionMode === vscode_1.ExtensionMode.Development);
                const certDir = path_1.default.join(shellConfDir, "plugin_data", "gui_plugin", "web_certs");
                const mysqlConnOptions = entry.parent.treeItem.details.options;
                if (mysqlConnOptions.scheme !== MySQL_1.MySQLConnectionScheme.MySQL) {
                    void vscode_1.window.showErrorMessage("Only DB Connections using classic MySQL protocol can be used for bootstrapping.");
                    return;
                }
                if (mysqlConnOptions.ssh !== undefined || mysqlConnOptions["mysql-db-system-id"] !== undefined) {
                    void vscode_1.window.showErrorMessage("DB Connection using SSH Tunneling or MDS Bastion settings cannot be used for bootstrapping.");
                    return;
                }
                const connString = `${mysqlConnOptions.user ?? ""}@${mysqlConnOptions.host}` +
                    ((mysqlConnOptions.port !== undefined) ? `:${mysqlConnOptions.port}` : "");
                let term = vscode_1.window.terminals.find((t) => { return t.name === "MySQL Router MRS"; });
                if (term === undefined) {
                    term = vscode_1.window.createTerminal("MySQL Router MRS");
                }
                let routerConfigDir;
                if (process.env.MYSQL_ROUTER_CUSTOM_DIR !== undefined) {
                    routerConfigDir = process.env.MYSQL_ROUTER_CUSTOM_DIR;
                }
                else {
                    if (os_1.default.platform() === "win32") {
                        routerConfigDir = path_1.default.join(this.getBaseDir(), "mysqlrouter");
                    }
                    else {
                        routerConfigDir = path_1.default.join(this.getBaseDir(), ".mysqlrouter");
                    }
                }
                if (fs_1.default.existsSync(routerConfigDir)) {
                    const answer = await vscode_1.window.showInformationMessage(`The MySQL Router config directory ${routerConfigDir} already exists. `
                        + "Do you want to rename the existing directory and proceed?", "Yes", "No");
                    if (answer === "Yes") {
                        try {
                            fs_1.default.renameSync(routerConfigDir, routerConfigDir + "_old");
                        }
                        catch (e) {
                            fs_1.default.rmSync(routerConfigDir + "_old", { recursive: true, force: true });
                            fs_1.default.renameSync(routerConfigDir, routerConfigDir + "_old");
                        }
                    }
                    else {
                        return;
                    }
                }
                if (term !== undefined) {
                    term.show();
                    term.sendText(`mysqlrouter_bootstrap ${connString} --mrs --directory "${routerConfigDir}" ` +
                        `"--conf-set-option=http_server.ssl_cert=${path_1.default.join(certDir, "server.crt")}" ` +
                        `"--conf-set-option=http_server.ssl_key=${path_1.default.join(certDir, "server.key")}" ` +
                        `--conf-set-option=logger.level=DEBUG --conf-set-option=logger.sinks=consolelog`, !waitAndClosedWhenFinished);
                    if (waitAndClosedWhenFinished) {
                        term.sendText("; exit");
                        return new Promise((resolve, reject) => {
                            const disposeToken = vscode_1.window.onDidCloseTerminal((closedTerminal) => {
                                if (closedTerminal === term) {
                                    disposeToken.dispose();
                                    if (term.exitStatus !== undefined) {
                                        resolve(term.exitStatus);
                                    }
                                    else {
                                        reject("Terminal exited with undefined status");
                                    }
                                }
                            });
                        });
                    }
                }
            }
            else {
                const answer = await vscode_1.window.showInformationMessage("The mysqlrouter_bootstrap executable could not be found in any directory listed in the " +
                    "PATH environment variable. This seems to indicate that MySQL Router has not been installed. " +
                    "Do you want to download and install the MySQL Router now?", "Yes", "No");
                if (answer === "Yes") {
                    const labsUrl = "https://downloads.mysql.com/snapshots/pb/mysql-router-8.1.0-labs-mrs-preview-6/";
                    let fileUrl;
                    switch (os_1.default.platform()) {
                        case "darwin": {
                            switch (os_1.default.arch()) {
                                case "arm":
                                case "arm64": {
                                    fileUrl = `${labsUrl}mysql-router-8.1.0-labs-mrs-6-macos13-arm64.dmg`;
                                    break;
                                }
                                default: {
                                    fileUrl = `${labsUrl}mysql-router-8.1.0-labs-mrs-6-macos13-x86_64.dmg`;
                                    break;
                                }
                            }
                            break;
                        }
                        case "win32": {
                            fileUrl = `${labsUrl}mysql-router-8.1.0-labs-mrs-6-winx64.msi`;
                            break;
                        }
                        default: {
                            fileUrl = "https://labs.mysql.com";
                            break;
                        }
                    }
                    await vscode_1.env.openExternal(vscode_1.Uri.parse(fileUrl));
                    await vscode_1.window.showInformationMessage("After installing MySQL Router, VS Code needs to be restarted to read " +
                        "the updated PATH environment variable. Please manually restart VS Code after " +
                        "completing the installation process.", "OK");
                }
            }
        }
    };
    getBaseDir = () => {
        if (os_1.default.platform() !== "win32") {
            return os_1.default.homedir();
        }
        return path_1.default.join(os_1.default.homedir(), "AppData", "Roaming", "MySQL");
    };
    getLocalRouterConfigDir = () => {
        let routerConfigDir;
        if (os_1.default.platform() === "win32") {
            routerConfigDir = path_1.default.join(this.getBaseDir(), "mysqlrouter");
        }
        else {
            routerConfigDir = path_1.default.join(this.getBaseDir(), ".mysqlrouter");
        }
        return routerConfigDir;
    };
    startStopLocalRouter = async (context, entry, start = true) => {
        if (entry) {
            if ((0, file_utilities_1.findExecutable)("mysqlrouter")) {
                const routerConfigDir = this.getLocalRouterConfigDir();
                if (fs_1.default.existsSync(routerConfigDir)) {
                    let term = vscode_1.window.terminals.find((t) => { return t.name === "MySQL Router MRS"; });
                    if (term === undefined) {
                        term = vscode_1.window.createTerminal("MySQL Router MRS");
                    }
                    if (term !== undefined) {
                        let cmd = (start ? "start" : "stop") + (os_1.default.platform() === "win32" ? ".ps1" : ".sh");
                        cmd = path_1.default.join(routerConfigDir, cmd);
                        if (cmd.includes(" ")) {
                            if (os_1.default.platform() === "win32") {
                                if (cmd.includes(" ")) {
                                    cmd = "& \"" + cmd + "\"";
                                }
                            }
                            else {
                                cmd = "\"" + cmd + "\"";
                            }
                        }
                        term.show();
                        if (os_1.default.platform() === "win32") {
                            term.sendText("Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser", true);
                            term.sendText("clear", true);
                        }
                        term.sendText(cmd, true);
                    }
                }
                else {
                    if (start) {
                        const answer = await vscode_1.window.showInformationMessage(`The MySQL Router config directory ${routerConfigDir} was not found. `
                            + "Do you want to bootstrap a local MySQL Router instance for development now?", "Yes", "No");
                        if (answer === "Yes") {
                            await this.bootstrapLocalRouter(this.#host.context, entry, true);
                            void this.startStopLocalRouter(this.#host.context, entry);
                        }
                    }
                    else {
                        (0, utilities_1.showMessageWithTimeout)(`The MySQL Router config directory ${routerConfigDir} was not found. ` +
                            "Please bootstrap a local MySQL Router instance for development first.");
                    }
                }
            }
            else {
                const answer = await vscode_1.window.showInformationMessage(`The mysqlrouter executable could not be found. `
                    + "Do you want to download and install the MySQL Router now?", "Yes", "No");
                if (answer === "Yes") {
                    void vscode_1.env.openExternal(vscode_1.Uri.parse("https://labs.mysql.com"));
                }
            }
        }
    };
    browseDocs = (id, file = "index.html") => {
        const fileChange = this.#docsCurrentFile !== file;
        if (!this.#docsWebviewPanel || fileChange) {
            this.#docsCurrentFile = file;
            try {
                let data;
                let mrsPluginDir = path_1.default.join(this.#host.context.extensionPath, "shell", "lib", "mysqlsh", "plugins", "mrs_plugin");
                let indexPath = path_1.default.join(mrsPluginDir, "docs", file);
                if (fs_1.default.existsSync(indexPath)) {
                    data = fs_1.default.readFileSync(indexPath, "utf8");
                }
                else {
                    if (os_1.default.platform() === "win32") {
                        mrsPluginDir = path_1.default.join(this.getBaseDir(), "mysqlsh", "plugins", "mrs_plugin");
                    }
                    else {
                        mrsPluginDir = path_1.default.join(this.getBaseDir(), ".mysqlsh", "plugins", "mrs_plugin");
                    }
                    indexPath = path_1.default.join(mrsPluginDir, "docs", file);
                    if (fs_1.default.existsSync(indexPath)) {
                        data = fs_1.default.readFileSync(indexPath, "utf8");
                    }
                    else {
                        throw new Error(`MRS Documentation not found.`);
                    }
                }
                if (!this.#docsWebviewPanel) {
                    this.#docsWebviewPanel = vscode_1.window.createWebviewPanel("mrsDocs", "MRS Docs", vscode_1.ViewColumn.One, {
                        enableScripts: true,
                        retainContextWhenHidden: true,
                        localResourceRoots: [
                            vscode_1.Uri.file(path_1.default.join(mrsPluginDir, "docs")),
                            vscode_1.Uri.file(path_1.default.join(mrsPluginDir, "docs", "style")),
                            vscode_1.Uri.file(path_1.default.join(mrsPluginDir, "docs", "images")),
                        ],
                    });
                    this.#docsWebviewPanel.onDidDispose(() => { this.handleDocsWebviewPanelDispose(); });
                    this.#docsWebviewPanel.webview.onDidReceiveMessage((message) => {
                        if (message.path && typeof message.path === "string" && os_1.default.platform() === "win32") {
                            message.path = String(message.path).replaceAll("/", "\\");
                        }
                        switch (message.command) {
                            case "openSqlFile": {
                                if (message.path && typeof message.path === "string") {
                                    const fullPath = vscode_1.Uri.file(path_1.default.join(mrsPluginDir, String(message.path)));
                                    void vscode_1.commands.executeCommand("msg.editInScriptEditor", fullPath);
                                }
                                break;
                            }
                            case "loadMrsDump": {
                                if (message.path && typeof message.path === "string") {
                                    const fullPath = vscode_1.Uri.file(path_1.default.join(mrsPluginDir, String(message.path)));
                                    void vscode_1.commands.executeCommand("msg.mrs.loadSchemaFromJSONFile", fullPath);
                                }
                                break;
                            }
                            case "saveProject": {
                                if (message.path && typeof message.path === "string") {
                                    const fullPath = vscode_1.Uri.file(path_1.default.join(mrsPluginDir, String(message.path)));
                                    void vscode_1.commands.executeCommand("msg.mrs.saveExampleProject", fullPath);
                                }
                                break;
                            }
                            case "goto": {
                                let file;
                                let id;
                                if (message.path && typeof message.path === "string") {
                                    file = message.path;
                                }
                                if (message.id && typeof message.id === "string") {
                                    id = message.id;
                                }
                                this.browseDocs(id, file);
                                break;
                            }
                            default:
                        }
                    });
                }
                const docUrl = this.#docsWebviewPanel.webview.asWebviewUri(vscode_1.Uri.file(path_1.default.join(mrsPluginDir, "docs/")));
                data = data.replace("\"style/", `"${docUrl.toString()}style/`);
                data = data.replace(/(src=")(.*)(\/images)/gm, `$1${docUrl.toString()}$3`);
                data = data.replace(/(href=")((?!http).*?\.html)(#.*?)?(")/gm, `$1$2$3$4 onclick="` +
                    `document.vscode.postMessage({ command: 'goto', path: '$2', id: '$3' });" `);
                this.#docsWebviewPanel.webview.html = data;
            }
            catch (reason) {
                this.#docsWebviewPanel = undefined;
                void vscode_1.window.showErrorMessage(`${String(reason)}`);
            }
        }
        else {
            this.#docsWebviewPanel.reveal();
        }
        if (id && this.#docsWebviewPanel) {
            if (id.startsWith("#")) {
                id = id.slice(1);
            }
            if (fileChange) {
                setTimeout(() => {
                    void this.#docsWebviewPanel?.webview.postMessage({ command: "goToId", id });
                }, 200);
            }
            else {
                void this.#docsWebviewPanel.webview.postMessage({ command: "goToId", id });
            }
        }
    };
    handleDocsWebviewPanelDispose = () => {
        this.#docsWebviewPanel = undefined;
    };
}
exports.MRSCommandHandler = MRSCommandHandler;
//# sourceMappingURL=MRSCommandHandler.js.map