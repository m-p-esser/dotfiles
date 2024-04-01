"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellConsoleViewProvider = void 0;
const Requisitions_1 = require("../../../frontend/src/supplement/Requisitions");
const ModuleInfo_1 = require("../../../frontend/src/modules/ModuleInfo");
const WebviewProvider_1 = require("./WebviewProvider");
class ShellConsoleViewProvider extends WebviewProvider_1.WebviewProvider {
    openSessions = [];
    constructor(url, onDispose) {
        super(url, onDispose);
    }
    show(page) {
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.ShellModuleId },
            { requestType: "showPage", parameter: { module: ModuleInfo_1.ShellModuleId, page } },
        ], "newShellConsole");
    }
    openSession(session) {
        const command = session.sessionId === -1 ? "newSession" : "openSession";
        return this.runCommand("job", [
            { requestType: "showModule", parameter: ModuleInfo_1.ShellModuleId },
            { requestType: command, parameter: session },
        ], "newShellConsole");
    }
    removeSession(session) {
        return this.runCommand("removeSession", session, "newShellConsole");
    }
    requisitionsCreated() {
        super.requisitionsCreated();
        if (this.requisitions) {
            this.requisitions.register("sessionAdded", this.sessionAdded);
            this.requisitions.register("sessionRemoved", this.sessionRemoved);
        }
    }
    sessionAdded = (session) => {
        this.openSessions.push(session);
        return Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: {
                requestType: "refreshSessions",
                parameter: this.openSessions,
            },
        });
    };
    sessionRemoved = (session) => {
        const index = this.openSessions.findIndex((candidate) => {
            return candidate.sessionId === session.sessionId;
        });
        if (index > -1) {
            this.openSessions.splice(index, 1);
        }
        return Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: {
                requestType: "refreshSessions",
                parameter: this.openSessions,
            },
        });
    };
    handleDispose() {
        super.handleDispose();
        this.openSessions = [];
        void Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: {
                requestType: "refreshSessions",
                parameter: [],
            },
        });
    }
}
exports.ShellConsoleViewProvider = ShellConsoleViewProvider;
//# sourceMappingURL=ShellConsoleViewProvider.js.map