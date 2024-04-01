"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceSqlEditor = void 0;
const WebSession_1 = require("../WebSession");
const Settings_1 = require("../Settings/Settings");
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const Protocol_1 = require("../../communication/Protocol");
const ProtocolGui_1 = require("../../communication/ProtocolGui");
const ShellInterfaceDb_1 = require("./ShellInterfaceDb");
const ShellInterfaceMds_1 = require("./ShellInterfaceMds");
const ShellInterfaceMrs_1 = require("./ShellInterfaceMrs");
class ShellInterfaceSqlEditor extends ShellInterfaceDb_1.ShellInterfaceDb {
    mds = new ShellInterfaceMds_1.ShellInterfaceMds();
    mrs = new ShellInterfaceMrs_1.ShellInterfaceMrs();
    get hasSession() {
        return this.moduleSessionId !== undefined;
    }
    async startSession(id) {
        this.moduleSessionLookupId = `sqlEditor.${id}`;
        this.mrs.moduleSessionLookupId = this.moduleSessionLookupId;
        if (!this.hasSession) {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorStartSession,
                parameters: { args: {} },
            });
            if (response.result?.moduleSessionId) {
                WebSession_1.webSession.setModuleSessionId(this.moduleSessionLookupId, response.result.moduleSessionId);
            }
        }
    }
    async closeSession() {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorCloseSession,
                parameters: { args: { moduleSessionId } },
            });
            WebSession_1.webSession.setModuleSessionId(this.moduleSessionLookupId);
        }
    }
    async getGuiModuleDisplayInfo() {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorGetGuiModuleDisplayInfo,
            parameters: { args: {} },
        });
    }
    async isGuiModuleBackend() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorIsGuiModuleBackend,
            parameters: { args: {} },
        });
        return response.result;
    }
    async openConnection(dbConnectionId, requestId, callback) {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestId,
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorOpenConnection,
                parameters: { args: { moduleSessionId, dbConnectionId } },
                onData: callback,
            });
            return response.result;
        }
        return undefined;
    }
    async execute(sql, params, requestId, callback) {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorExecute,
                requestId,
                parameters: {
                    args: {
                        moduleSessionId,
                        sql,
                        params,
                        options: { rowPacketSize: Settings_1.Settings.get("sql.rowPacketSize", 1000) },
                    },
                },
                onData: callback,
            });
            const result = {};
            response.forEach((entry) => {
                if (entry.result.executionTime) {
                    result.executionTime = entry.result.executionTime;
                }
                if (entry.result.rows) {
                    if (!result.rows) {
                        result.rows = [];
                    }
                    result.rows.push(...entry.result.rows);
                }
                if (entry.result.columns) {
                    if (!result.columns) {
                        result.columns = [];
                    }
                    result.columns.push(...entry.result.columns);
                }
                if (entry.result.totalRowCount) {
                    result.totalRowCount = entry.result.totalRowCount;
                }
            });
            return result;
        }
    }
    async reconnect() {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorReconnect,
                parameters: { args: { moduleSessionId } },
            });
        }
    }
    async killQuery() {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorKillQuery,
                parameters: { args: { moduleSessionId } },
            });
        }
    }
    async setAutoCommit(state) {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorSetAutoCommit,
                parameters: { args: { moduleSessionId, state } },
            });
        }
    }
    async getAutoCommit() {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorGetAutoCommit,
                parameters: { args: { moduleSessionId } },
            });
            return response.result;
        }
    }
    async getCurrentSchema() {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorGetCurrentSchema,
                parameters: { args: { moduleSessionId } },
            });
            return response.result;
        }
    }
    async setCurrentSchema(schemaName) {
        const moduleSessionId = this.moduleSessionId;
        if (moduleSessionId) {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiSqleditorSetCurrentSchema,
                parameters: { args: { moduleSessionId, schemaName } },
            });
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
}
exports.ShellInterfaceSqlEditor = ShellInterfaceSqlEditor;
//# sourceMappingURL=ShellInterfaceSqlEditor.js.map