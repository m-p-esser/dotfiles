"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceShellSession = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const Protocol_1 = require("../../communication/Protocol");
const ProtocolGui_1 = require("../../communication/ProtocolGui");
const WebSession_1 = require("../WebSession");
const ShellInterfaceMds_1 = require("./ShellInterfaceMds");
class ShellInterfaceShellSession {
    mds = new ShellInterfaceMds_1.ShellInterfaceMds();
    moduleSessionLookupId = "";
    constructor(sessionId) {
        if (sessionId) {
            this.moduleSessionLookupId = "shellSession.temporary";
            WebSession_1.webSession.setModuleSessionId(this.moduleSessionLookupId, sessionId);
        }
    }
    get hasSession() {
        return this.moduleSessionId !== undefined;
    }
    async startShellSession(id, dbConnectionId, shellArgs, requestId, callback) {
        this.moduleSessionLookupId = `shellSession.${id}`;
        if (this.hasSession) {
            return undefined;
        }
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiShellStartSession,
            requestId,
            parameters: {
                args: {
                    dbConnectionId,
                    shellArgs,
                },
            },
            onData: callback,
        });
        if (response.result?.moduleSessionId) {
            WebSession_1.webSession.setModuleSessionId(this.moduleSessionLookupId, response.result.moduleSessionId);
        }
        return response.result;
    }
    async closeShellSession() {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiShellCloseSession,
                parameters: {
                    args: {
                        moduleSessionId,
                    },
                },
            });
            WebSession_1.webSession.setModuleSessionId(this.moduleSessionLookupId);
        }
    }
    async execute(command, requestId, callback) {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiShellExecute,
                requestId,
                parameters: {
                    args: {
                        command,
                        moduleSessionId,
                    },
                },
                onData: callback,
            });
            return response.result;
        }
    }
    async sendReply(requestId, type, reply, moduleSessionId) {
        moduleSessionId = moduleSessionId ?? this.moduleSessionId;
        if (moduleSessionId) {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: Protocol_1.Protocol.PromptReply,
                parameters: { moduleSessionId, requestId, type, reply },
            }, false);
        }
    }
    async getCompletionItems(text, offset) {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiShellComplete,
                parameters: {
                    args: {
                        data: text,
                        offset,
                        moduleSessionId,
                    },
                },
            });
            const result = [];
            response.forEach((list) => {
                if (list.result) {
                    result.push(list.result);
                }
            });
            return result;
        }
        return [];
    }
    get moduleSessionId() {
        return WebSession_1.webSession.moduleSessionId(this.moduleSessionLookupId);
    }
}
exports.ShellInterfaceShellSession = ShellInterfaceShellSession;
//# sourceMappingURL=ShellInterfaceShellSession.js.map