"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceMds = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const ProtocolMds_1 = require("../../communication/ProtocolMds");
class ShellInterfaceMds {
    async getMdsConfigProfiles(configFilePath) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListConfigProfiles,
            parameters: { kwargs: { configFilePath } },
        });
        return response.result;
    }
    async setDefaultConfigProfile(profile) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsSetDefaultConfigProfile,
            parameters: { args: { profileName: profile } },
        });
    }
    async getMdsCompartments(configProfile, compartmentId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListCompartments,
            parameters: { kwargs: { configProfile, compartmentId } },
        });
        return response.result;
    }
    async getMdsMySQLDbSystems(configProfile, compartmentId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListDbSystems,
            parameters: { kwargs: { configProfile, compartmentId } },
        });
        return response.result;
    }
    async getMdsMySQLDbSystem(configProfile, dbSystemId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsGetDbSystem,
            parameters: { kwargs: { configProfile, dbSystemId } },
        });
        return response.result;
    }
    async getMdsComputeInstances(configProfile, compartmentId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListComputeInstances,
            parameters: { kwargs: { configProfile, compartmentId } },
        });
        return response.result;
    }
    async getMdsBastions(configProfile, compartmentId, validForDbSystemId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListBastions,
            parameters: { kwargs: { configProfile, compartmentId, validForDbSystemId } },
        });
        return response.result;
    }
    async getMdsBastion(configProfile, bastionId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsGetBastion,
            parameters: { kwargs: { configProfile, bastionId } },
        });
        return response.result;
    }
    async createBastion(configProfile, dbSystemId, awaitActiveState) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsCreateBastion,
            parameters: { kwargs: { configProfile, dbSystemId, awaitActiveState } },
        });
        return response.result;
    }
    async createBastionSession(configProfile, targetId, sessionType, compartmentId, awaitCreation, callback) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsCreateBastionSession,
            parameters: { kwargs: { configProfile, targetId, sessionType, compartmentId, awaitCreation } },
            onData: callback,
        });
        return response.result;
    }
    async listLoadBalancers(configProfile, compartmentId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListLoadBalancers,
            parameters: { kwargs: { configProfile, compartmentId } },
        });
        return response.result;
    }
    async setCurrentCompartment(parameters) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsSetCurrentCompartment,
            parameters: { kwargs: parameters },
        });
    }
    async setCurrentBastion(parameters) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsSetCurrentBastion,
            parameters: { kwargs: parameters },
        });
    }
    async listDbSystemShapes(isSupportedFor, configProfile, compartmentId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListDbSystemShapes,
            parameters: { kwargs: { configProfile, isSupportedFor, compartmentId } },
        });
        return response.result;
    }
    async listComputeShapes(configProfile, compartmentId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMds_1.ShellAPIMds.MdsListComputeShapes,
            parameters: { kwargs: { configProfile, compartmentId } },
        });
        return response.result;
    }
}
exports.ShellInterfaceMds = ShellInterfaceMds;
//# sourceMappingURL=ShellInterfaceMds.js.map