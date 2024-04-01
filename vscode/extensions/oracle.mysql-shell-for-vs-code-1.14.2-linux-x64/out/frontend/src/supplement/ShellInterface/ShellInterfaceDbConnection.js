"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceDbConnection = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const ProtocolGui_1 = require("../../communication/ProtocolGui");
class ShellInterfaceDbConnection {
    id = "dbConnection";
    async addDbConnection(profileId, connection, folderPath = "") {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsAddDbConnection,
            parameters: {
                args: {
                    profileId,
                    connection: {
                        dbType: connection.dbType,
                        caption: connection.caption,
                        description: connection.description,
                        options: connection.options,
                    },
                    folderPath,
                },
            },
        });
        return response.result;
    }
    async updateDbConnection(profileId, connection, folderPath = "") {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsUpdateDbConnection,
            parameters: {
                args: {
                    profileId,
                    connectionId: connection.id,
                    connection: {
                        dbType: connection.dbType,
                        caption: connection.caption,
                        description: connection.description,
                        options: connection.options,
                    },
                    folderPath,
                },
            },
        });
    }
    async removeDbConnection(profileId, connectionId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsRemoveDbConnection,
            parameters: { args: { profileId, connectionId } },
        });
    }
    async listDbConnections(profileId, folderPath = "") {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsListDbConnections,
            parameters: { args: { profileId, folderPath } },
        });
        const result = [];
        response.forEach((entry) => {
            result.push(...entry.result);
        });
        return result;
    }
    async getDbConnection(connectionId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsGetDbConnection,
            parameters: { args: { dbConnectionId: connectionId } },
        });
        return response.result;
    }
}
exports.ShellInterfaceDbConnection = ShellInterfaceDbConnection;
//# sourceMappingURL=ShellInterfaceDbConnection.js.map