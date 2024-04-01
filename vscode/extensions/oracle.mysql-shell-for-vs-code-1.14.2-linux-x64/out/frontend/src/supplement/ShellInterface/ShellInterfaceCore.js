"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceCore = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const ProtocolGui_1 = require("../../communication/ProtocolGui");
const string_helpers_1 = require("../../utilities/string-helpers");
class ShellInterfaceCore {
    get backendInformation() {
        return (async () => {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiCoreGetBackendInformation,
                parameters: {},
            });
            return {
                architecture: response.result.architecture,
                major: (0, string_helpers_1.filterInt)(response.result.major),
                minor: (0, string_helpers_1.filterInt)(response.result.minor),
                patch: (0, string_helpers_1.filterInt)(response.result.patch),
                platform: response.result.platform,
                serverDistribution: response.result.serverDistribution,
                serverMajor: (0, string_helpers_1.filterInt)(response.result.serverMajor),
                serverMinor: (0, string_helpers_1.filterInt)(response.result.serverMinor),
                serverPatch: (0, string_helpers_1.filterInt)(response.result.serverPatch),
            };
        })();
    }
    async getLogLevel() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiCoreGetLogLevel,
            parameters: {},
        });
        return response.result;
    }
    async setLogLevel(logLevel) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiCoreSetLogLevel,
            parameters: { args: { logLevel } },
        });
    }
    async getDbTypes() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsGetDbTypes,
            parameters: {},
        });
        return response.result;
    }
    async validatePath(path) {
        try {
            await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiCoreValidatePath,
                parameters: { args: { path } },
            });
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async createDatabaseFile(path) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiCoreCreateFile,
            parameters: { args: { path } },
        });
    }
    async getDebuggerScriptNames() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDebuggerGetScripts,
            parameters: {},
        });
        return response.result;
    }
    async getDebuggerScriptContent(path) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDebuggerGetScriptContent,
            parameters: { args: { path } },
        });
        return response.result;
    }
}
exports.ShellInterfaceCore = ShellInterfaceCore;
//# sourceMappingURL=ShellInterfaceCore.js.map