"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceDb = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const ProtocolGui_1 = require("../../communication/ProtocolGui");
const WebSession_1 = require("../WebSession");
class ShellInterfaceDb {
    moduleSessionLookupId = "";
    async startSession(id, connection) {
        this.moduleSessionLookupId = `dbSession.${id}`;
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbStartSession,
            parameters: { args: { connection } },
        });
        WebSession_1.webSession.setModuleSessionId(this.moduleSessionLookupId, response.result.moduleSessionId);
    }
    async closeSession() {
        if (!this.moduleSessionId) {
            return;
        }
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbCloseSession,
            parameters: { args: { moduleSessionId: this.moduleSessionId } },
        });
        WebSession_1.webSession.setModuleSessionId(this.moduleSessionLookupId);
    }
    async getCatalogObjects(type, filter) {
        if (!this.moduleSessionId) {
            return [];
        }
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbGetCatalogObjectNames,
            parameters: { args: { type, filter, moduleSessionId: this.moduleSessionId } },
        });
        const result = [];
        response.forEach((entry) => {
            result.push(...entry.result);
        });
        return result;
    }
    async getSchemaObjects(schema, type, routineType, filter) {
        if (!this.moduleSessionId) {
            return [];
        }
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbGetSchemaObjectNames,
            parameters: {
                args: {
                    type,
                    filter,
                    schemaName: schema,
                    routineType,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        const result = [];
        response.forEach((entry) => {
            result.push(...entry.result);
        });
        return result;
    }
    async getTableObjects(schema, table, type, filter) {
        if (!this.moduleSessionId) {
            return [];
        }
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbGetTableObjectNames,
            parameters: {
                args: {
                    type,
                    filter,
                    schemaName: schema,
                    tableName: table,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        const result = [];
        response.forEach((entry) => {
            result.push(...entry.result);
        });
        return result;
    }
    get moduleSessionId() {
        return WebSession_1.webSession.moduleSessionId(this.moduleSessionLookupId);
    }
}
exports.ShellInterfaceDb = ShellInterfaceDb;
//# sourceMappingURL=ShellInterfaceDb.js.map