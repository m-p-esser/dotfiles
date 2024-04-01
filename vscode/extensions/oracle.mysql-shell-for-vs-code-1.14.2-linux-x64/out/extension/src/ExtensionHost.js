"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionHost = void 0;
const vscode_1 = require("vscode");
const ShellTask_1 = require("../../frontend/src/shell-tasks/ShellTask");
const Settings_1 = require("../../frontend/src/supplement/Settings/Settings");
const SettingsRegistry_1 = require("../../frontend/src/supplement/Settings/SettingsRegistry");
const WebSession_1 = require("../../frontend/src/supplement/WebSession");
const extension_1 = require("./extension");
const ShellTasksTreeProvider_1 = require("./tree-providers/ShellTreeProvider/ShellTasksTreeProvider");
const Requisitions_1 = require("../../frontend/src/supplement/Requisitions");
const ShellInterface_1 = require("../../frontend/src/supplement/ShellInterface/ShellInterface");
const NodeMessageScheduler_1 = require("./communication/NodeMessageScheduler");
const DBEditorCommandHandler_1 = require("./DBEditorCommandHandler");
const NotebookEditorProvider_1 = require("./editor-providers/NotebookEditorProvider");
const MDSCommandHandler_1 = require("./MDSCommandHandler");
const MRSCommandHandler_1 = require("./MRSCommandHandler");
const ShellConsoleCommandHandler_1 = require("./ShellConsoleCommandHandler");
const ConnectionsTreeProvider_1 = require("./tree-providers/ConnectionsTreeProvider/ConnectionsTreeProvider");
const DBConnectionViewProvider_1 = require("./web-views/DBConnectionViewProvider");
class ExtensionHost {
    context;
    url;
    providers = [];
    lastActiveProvider;
    activeProfile;
    updatingSettings = false;
    connectionsProvider = new ConnectionsTreeProvider_1.ConnectionsTreeDataProvider();
    dbEditorCommandHandler = new DBEditorCommandHandler_1.DBEditorCommandHandler(this.connectionsProvider);
    shellConsoleCommandHandler = new ShellConsoleCommandHandler_1.ShellConsoleCommandHandler();
    notebookProvider = new NotebookEditorProvider_1.NotebookEditorProvider();
    mrsCommandHandler = new MRSCommandHandler_1.MRSCommandHandler();
    mdsCommandHandler = new MDSCommandHandler_1.MDSCommandHandler();
    scriptsTreeDataProvider;
    shellTasksTreeDataProvider;
    shellTasks = [];
    moduleDataCategories = new Map();
    #visibleStatusbarItems = new Map();
    constructor(context) {
        this.context = context;
        this.setupEnvironment();
        Requisitions_1.requisitions.register("settingsChanged", this.updateVscodeSettings);
        Requisitions_1.requisitions.register("webSessionStarted", (data) => {
            WebSession_1.webSession.sessionId = data.sessionUuid;
            WebSession_1.webSession.localUserMode = data.localUserMode ?? false;
            if (WebSession_1.webSession.userName === "") {
                if (WebSession_1.webSession.localUserMode) {
                    ShellInterface_1.ShellInterface.users.authenticate("LocalAdministrator", "").then((profile) => {
                        if (profile) {
                            void this.onAuthentication(profile);
                        }
                    }).catch((reason) => {
                        (0, extension_1.printChannelOutput)("Internal error: " + String(reason), true);
                    });
                }
            }
            else {
                WebSession_1.webSession.loadProfile(data.activeProfile);
                this.activeProfile = data.activeProfile;
            }
            return Promise.resolve(true);
        });
        Requisitions_1.requisitions.register("connectedToUrl", this.connectedToUrl);
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
    }
    get connections() {
        return this.connectionsProvider.connections;
    }
    closeAllTabs() {
        this.providers.forEach((provider) => {
            provider.close();
        });
        this.providers = [];
        this.dbEditorCommandHandler.clear();
        this.lastActiveProvider = undefined;
        this.shellConsoleCommandHandler.closeProviders();
    }
    async addNewShellTask(caption, shellArgs, dbConnectionId, showOutputChannel = true, responses) {
        const task = new ShellTask_1.ShellTask(caption, this.taskPromptCallback, this.taskMessageCallback);
        this.shellTasks.push(task);
        this.shellTasksTreeDataProvider.refresh();
        if (showOutputChannel) {
            extension_1.taskOutputChannel.show();
        }
        await task.runTask(shellArgs, dbConnectionId, responses);
        this.shellTasksTreeDataProvider.refresh();
    }
    determineConnection = async (dbType, forcePicker) => {
        let connections = this.connectionsProvider.connections;
        let title = "Select a connection for SQL execution";
        if (!forcePicker) {
            const connectionName = vscode_1.workspace.getConfiguration("msg.editor").get("defaultDbConnection");
            if (connectionName) {
                const connection = connections.find((candidate) => {
                    return candidate.treeItem.details.caption === connectionName;
                });
                if (!connection) {
                    void vscode_1.window.showErrorMessage(`The default Database Connection ${connectionName} is not available ` +
                        `anymore.`);
                }
                else if (dbType && connection.treeItem.details.dbType !== dbType) {
                    void vscode_1.window.showErrorMessage(`The default Database Connection ${connectionName} is a ` +
                        `${String(connection.treeItem.details.dbType)} connection. This function requires a ` +
                        `${String(dbType)} connection.`);
                }
                else {
                    return connection;
                }
                title = "Select another connection for SQL execution";
            }
        }
        if (dbType) {
            connections = connections.filter((conn) => {
                return conn.treeItem.details.dbType === dbType;
            });
        }
        if (connections.length === 0) {
            if (dbType) {
                void vscode_1.window.showErrorMessage(`Please create a ${String(dbType)} Database Connection first.`);
            }
            else {
                void vscode_1.window.showErrorMessage("Please create a Database Connection first.");
            }
            return undefined;
        }
        const items = connections.map((connection) => {
            return connection.treeItem.details.caption;
        });
        const name = await vscode_1.window.showQuickPick(items, {
            title,
            matchOnDescription: true,
            placeHolder: "Type the name of an existing DB connection",
        });
        const connection = connections.find((candidate) => {
            return candidate.treeItem.details.caption === name;
        });
        return connection;
    };
    broadcastRequest = async (sender, requestType, parameter) => {
        await Promise.all(this.providers.map((provider) => {
            if (sender === undefined || provider !== sender) {
                return provider.runCommand(requestType, parameter);
            }
            return Promise.resolve();
        }));
    };
    get currentProvider() {
        if (this.lastActiveProvider) {
            return this.lastActiveProvider;
        }
        if (this.providers.length > 0) {
            return this.providers[this.providers.length - 1];
        }
        return this.newProvider;
    }
    get newProvider() {
        if (this.url) {
            const caption = this.dbEditorCommandHandler.generateNewProviderCaption();
            const provider = new DBConnectionViewProvider_1.DBConnectionViewProvider(this.url, this.providerDisposed, this.providerStateChanged);
            provider.caption = caption;
            this.providers.push(provider);
            return provider;
        }
        return undefined;
    }
    setupEnvironment() {
        void NodeMessageScheduler_1.NodeMessageScheduler.get;
        Requisitions_1.requisitions.setRemoteTarget(this);
        this.dbEditorCommandHandler.setup(this);
        this.shellConsoleCommandHandler.setup(this);
        this.notebookProvider.setup(this);
        this.mrsCommandHandler.setup(this);
        this.mdsCommandHandler.setup(this);
        const updateLogLevel = () => {
            const configuration = vscode_1.workspace.getConfiguration(`msg.debugLog`);
            const level = configuration.get("level", "INFO");
            void ShellInterface_1.ShellInterface.core.setLogLevel(level).catch((error) => {
                void vscode_1.window.showErrorMessage("Error while setting log level: " + String(error));
            });
        };
        updateLogLevel();
        this.context.subscriptions.push(vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("msg")) {
                updateLogLevel();
                this.updateProfileSettings();
            }
        }));
        this.shellTasksTreeDataProvider = new ShellTasksTreeProvider_1.ShellTasksTreeDataProvider(this.shellTasks);
        this.context.subscriptions.push(vscode_1.window.registerTreeDataProvider("msg.shellTasks", this.shellTasksTreeDataProvider));
        this.context.subscriptions.push(vscode_1.commands.registerCommand("msg.selectProfile", async () => {
            await this.selectProfile();
        }));
        this.context.subscriptions.push(vscode_1.commands.registerCommand("msg.dumpSchemaToDisk", (entry) => {
            if (entry) {
                void vscode_1.window.showOpenDialog({
                    title: "Select an output folder for the dump.",
                    openLabel: "Select Dump Folder",
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                }).then((targetUri) => {
                    const item = entry.treeItem;
                    if (targetUri && targetUri.length === 1) {
                        const shellArgs = [
                            "--",
                            "util",
                            "dump-schemas",
                            item.schema,
                            "--outputUrl",
                            targetUri[0].fsPath,
                        ];
                        void this.addNewShellTask(`Dump Schema ${item.schema} to Disk`, shellArgs, item.connectionId)
                            .then(() => {
                            this.shellTasksTreeDataProvider.refresh();
                        });
                    }
                });
            }
        }));
        this.context.subscriptions.push(vscode_1.commands.registerCommand("msg.dumpSchemaToDiskForMds", (entry) => {
            if (entry) {
                void vscode_1.window.showOpenDialog({
                    title: "Select an output folder for the dump.",
                    openLabel: "Select Dump Folder",
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                }).then((targetUri) => {
                    const item = entry.treeItem;
                    if (targetUri && targetUri.length === 1) {
                        const shellArgs = [
                            "--",
                            "util",
                            "dump-schemas",
                            item.schema,
                            "--outputUrl",
                            targetUri[0].fsPath,
                            "--ocimds",
                            "true",
                            "--compatibility",
                            "create_invisible_pks,force_innodb,skip_invalid_accounts," +
                                "strip_definers,strip_restricted_grants,strip_tablespaces",
                        ];
                        void this.addNewShellTask(`Dump Schema ${item.schema} to Disk`, shellArgs, item.connectionId)
                            .then(() => {
                            this.shellTasksTreeDataProvider.refresh();
                        });
                    }
                });
            }
        }));
        this.context.subscriptions.push(vscode_1.commands.registerCommand("msg.loadDumpFromDisk", (entry) => {
            if (entry) {
                void vscode_1.window.showOpenDialog({
                    title: "Select a folder that contains a MySQL Shell dump.",
                    openLabel: "Select Dump Folder",
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                }).then((targetUri) => {
                    if (targetUri && targetUri.length === 1) {
                        const shellArgs = [
                            "--",
                            "util",
                            "load-dump",
                            targetUri[0].fsPath,
                        ];
                        let folderName = "";
                        const m = targetUri[0].fsPath.match(/([^/]*)\/*$/);
                        if (m && m.length > 1) {
                            folderName = m[1] + " ";
                        }
                        void this.addNewShellTask(`Loading Dump ${folderName}from Disk`, shellArgs, entry.treeItem.details.id)
                            .then(() => {
                            this.shellTasksTreeDataProvider.refresh();
                            void vscode_1.commands.executeCommand("msg.refreshConnections");
                        });
                    }
                });
            }
        }));
    }
    async onAuthentication(profile) {
        this.activeProfile = profile;
        const categories = await ShellInterface_1.ShellInterface.modules.listDataCategories();
        categories.forEach((row) => {
            this.moduleDataCategories.set(row.name, row);
        });
        await this.dbEditorCommandHandler.refreshConnectionTree();
        void vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
    }
    updateProfileSettings() {
        if (!this.updatingSettings) {
            this.updatingSettings = true;
            const handleChildren = (children, configuration) => {
                children?.forEach((child) => {
                    child.values.forEach((value) => {
                        const configValue = configuration?.get(`${child.key}.${value.key}`);
                        if (configValue != null) {
                            Settings_1.Settings.set(value.id, configValue);
                        }
                    });
                    handleChildren(child.children, configuration);
                });
            };
            const categories = SettingsRegistry_1.settingCategories.children;
            if (categories) {
                categories.forEach((category) => {
                    const configuration = vscode_1.workspace.getConfiguration(`msg.${category.key}`);
                    category.values.forEach((value) => {
                        const configValue = configuration.get(value.key);
                        if (configValue != null) {
                            Settings_1.Settings.set(value.id, configValue);
                        }
                    });
                    handleChildren(category.children, configuration);
                });
            }
            Settings_1.Settings.saveSettings();
            this.updatingSettings = false;
        }
    }
    updateVscodeSettings = async (entry) => {
        if (!this.updatingSettings) {
            this.updatingSettings = true;
            if (entry) {
                const parts = entry.key.split(".");
                if (parts.length === 3) {
                    const configuration = vscode_1.workspace.getConfiguration(`msg.${parts[0]}`);
                    const currentValue = configuration.get(`${parts[1]}.${parts[2]}`);
                    if (currentValue !== entry.value) {
                        await configuration.update(`${parts[1]}.${parts[2]}`, entry.value, vscode_1.ConfigurationTarget.Global);
                    }
                }
            }
            else {
                const categories = SettingsRegistry_1.settingCategories.children;
                if (categories) {
                    const updateFromChildren = async (children, configuration) => {
                        if (children && configuration) {
                            for await (const child of children) {
                                for await (const value of child.values) {
                                    const setting = Settings_1.Settings.get(value.id);
                                    const currentValue = configuration.get(`${child.key}.${value.key}`);
                                    if (setting !== currentValue) {
                                        await configuration.update(`${child.key}.${value.key}`, setting, vscode_1.ConfigurationTarget.Global);
                                    }
                                }
                                await updateFromChildren(child.children, configuration);
                            }
                        }
                    };
                    for await (const category of categories) {
                        if (category.key !== "theming") {
                            const configuration = vscode_1.workspace.getConfiguration(`msg.${category.key}`);
                            for await (const value of category.values) {
                                const setting = Settings_1.Settings.get(value.id);
                                const currentValue = configuration.get(value.key);
                                if (setting !== currentValue) {
                                    await configuration.update(value.key, setting, vscode_1.ConfigurationTarget.Global);
                                }
                            }
                            await updateFromChildren(category.children, configuration);
                        }
                    }
                }
            }
            this.updatingSettings = false;
        }
        return true;
    };
    async selectProfile() {
        if (this.activeProfile) {
            const profiles = await ShellInterface_1.ShellInterface.users.listProfiles(this.activeProfile.userId);
            const items = profiles.map((profile) => {
                return profile.name;
            });
            const name = await vscode_1.window.showQuickPick(items, {
                title: "Activate a Profile",
                matchOnDescription: true,
                placeHolder: "Type the name of an existing profile",
            });
            if (name) {
                const row = profiles.find((candidate) => {
                    return candidate.name === name;
                });
                if (row) {
                    await ShellInterface_1.ShellInterface.users.setCurrentProfile(row.id);
                    vscode_1.window.setStatusBarMessage("Profile set successfully", 5000);
                }
            }
        }
    }
    taskPromptCallback = (text, isPassword) => {
        return new Promise((resolve) => {
            const match = text.match(/\[([\w\d\s/]+)\]:\s*?$/);
            if (match && match.length === 2 && match.index) {
                const buttons = match[1].split("/");
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i] = buttons[i].charAt(0).toUpperCase() + buttons[i].slice(1);
                }
                void vscode_1.window.showInformationMessage(text.substring(0, match.index), ...buttons).then((value) => {
                    resolve(value);
                });
            }
            else {
                void vscode_1.window.showInputBox({ title: text, password: isPassword }).then((value) => {
                    resolve(value);
                });
            }
        });
    };
    taskMessageCallback = (message) => {
        if (typeof message === "string") {
            extension_1.taskOutputChannel.append(message);
        }
        else {
            extension_1.taskOutputChannel.append(JSON.stringify(message));
        }
    };
    connectedToUrl = (url) => {
        this.url = url;
        this.closeAllTabs();
        return Promise.resolve(true);
    };
    providerDisposed = (provider) => {
        const index = this.providers.findIndex((candidate) => {
            return candidate === provider;
        });
        if (index > -1) {
            this.providers.splice(index, 1);
        }
        if (this.lastActiveProvider === provider) {
            this.lastActiveProvider = undefined;
        }
        this.dbEditorCommandHandler.providerClosed(provider);
    };
    providerStateChanged = (provider, active) => {
        if (active) {
            this.lastActiveProvider = provider;
            this.lastActiveProvider.reselectLastItem();
        }
        this.dbEditorCommandHandler.providerStateChanged(provider, active);
    };
    proxyRequest = (request) => {
        switch (request.original.requestType) {
            case "updateStatusbar": {
                this.updateStatusbar(request.original.parameter);
                return Promise.resolve(true);
            }
            case "connectionAdded":
            case "connectionUpdated":
            case "connectionRemoved":
            case "refreshConnections": {
                return new Promise((resolve) => {
                    void Requisitions_1.requisitions.broadcastRequest(request.provider, request.original.requestType, request.original.parameter).then(() => {
                        resolve(true);
                    });
                });
            }
            default:
        }
        return Promise.resolve(false);
    };
    updateStatusbar = (info) => {
        info.forEach((i) => {
            if (i.text) {
                let entry = this.#visibleStatusbarItems.get(i.id);
                if (!entry) {
                    entry = [vscode_1.window.createStatusBarItem(), setTimeout(() => {
                            entry?.[0].dispose();
                            this.#visibleStatusbarItems.delete(i.id);
                        }, i.hideAfter ?? 25000)];
                    this.#visibleStatusbarItems.set(i.id, entry);
                    entry[0].show();
                }
                else {
                    clearTimeout(entry[1]);
                    entry[1] = setTimeout(() => {
                        entry?.[0].dispose();
                        this.#visibleStatusbarItems.delete(i.id);
                    }, i.hideAfter ?? 25000);
                }
                entry[0].text = i.text;
            }
            else {
                const entry = this.#visibleStatusbarItems.get(i.id);
                if (entry) {
                    entry[0].dispose();
                    clearTimeout(entry[1]);
                    this.#visibleStatusbarItems.delete(i.id);
                }
            }
        });
    };
}
exports.ExtensionHost = ExtensionHost;
//# sourceMappingURL=ExtensionHost.js.map