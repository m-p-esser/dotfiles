"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellConsoleCommandHandler = void 0;
const vscode_1 = require("vscode");
const Requisitions_1 = require("../../frontend/src/supplement/Requisitions");
const ConnectionTreeItem_1 = require("./tree-providers/ConnectionsTreeProvider/ConnectionTreeItem");
const ShellConsoleViewProvider_1 = require("./web-views/ShellConsoleViewProvider");
class ShellConsoleCommandHandler {
    providers = [];
    url;
    setup(host) {
        const context = host.context;
        Requisitions_1.requisitions.register("connectedToUrl", this.connectedToUrl);
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.openSessionBrowser", (provider) => {
            provider ??= this.currentProvider;
            if (provider instanceof ShellConsoleViewProvider_1.ShellConsoleViewProvider) {
                void provider?.show("sessions");
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newSession", () => {
            const provider = this.currentProvider;
            void provider?.openSession({ sessionId: -1 });
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.openSession", (details) => {
            const provider = this.currentProvider;
            void provider?.openSession(details);
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.newSessionUsingConnection", (entry) => {
            const provider = this.currentProvider;
            let caption;
            let dbConnectionId;
            if (entry.treeItem instanceof ConnectionTreeItem_1.ConnectionTreeItem) {
                caption = entry.treeItem.details.caption;
                dbConnectionId = entry.treeItem.details.id;
            }
            else {
                caption = entry.caption;
                dbConnectionId = entry.connectionId;
            }
            const details = {
                sessionId: -1,
                caption: `Session to ${caption}`,
                dbConnectionId,
            };
            void provider?.openSession(details);
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("msg.removeSession", (entry) => {
            const provider = entry.parent.provider;
            if (provider instanceof ShellConsoleViewProvider_1.ShellConsoleViewProvider) {
                void provider.removeSession(entry.details);
            }
        }));
    }
    closeProviders() {
        this.providers.forEach((provider) => {
            provider.close();
        });
        this.providers = [];
    }
    get currentProvider() {
        if (this.providers.length > 0) {
            return this.providers[this.providers.length - 1];
        }
        else if (this.url) {
            const caption = this.createTabCaption();
            const provider = new ShellConsoleViewProvider_1.ShellConsoleViewProvider(this.url, (view) => {
                const index = this.providers.findIndex((candidate) => { return candidate === view; });
                if (index > -1) {
                    this.providers.splice(index, 1);
                }
            });
            provider.caption = caption;
            this.providers.push(provider);
            return provider;
        }
        return undefined;
    }
    connectedToUrl = (url) => {
        this.url = url;
        this.closeProviders();
        return Promise.resolve(true);
    };
    createTabCaption = () => {
        if (this.providers.length === 0) {
            return "MySQL Shell Consoles";
        }
        let index = 1;
        while (true) {
            const caption = `MySQL Shell Consoles (${index})`;
            if (!this.providers.find((candidate) => {
                return candidate.caption === caption;
            })) {
                return caption;
            }
            ++index;
        }
    };
}
exports.ShellConsoleCommandHandler = ShellConsoleCommandHandler;
//# sourceMappingURL=ShellConsoleCommandHandler.js.map