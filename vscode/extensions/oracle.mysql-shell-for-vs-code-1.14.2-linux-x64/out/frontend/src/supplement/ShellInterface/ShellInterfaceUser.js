"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceUser = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const Protocol_1 = require("../../communication/Protocol");
const ProtocolGui_1 = require("../../communication/ProtocolGui");
const WebSession_1 = require("../WebSession");
class ShellInterfaceUser {
    async authenticate(username, password) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: Protocol_1.Protocol.UserAuthenticate,
            parameters: { username, password },
        }, false);
        WebSession_1.webSession.userName = username;
        WebSession_1.webSession.userId = response.activeProfile.userId;
        WebSession_1.webSession.loadProfile(response.activeProfile);
        return response.activeProfile;
    }
    async createUser(username, password, role, allowedHosts) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersCreateUser,
            parameters: { args: { username, password, role, allowedHosts } },
        });
    }
    async getDefaultProfile(userId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersGetDefaultProfile,
            parameters: { args: { userId } },
        });
        if (!Array.isArray(response)) {
            return response.result;
        }
    }
    async setDefaultProfile(userId, profileId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersSetDefaultProfile,
            parameters: { args: { userId, profileId } },
        });
    }
    async getGuiModuleList(userId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersGetGuiModuleList,
            parameters: { args: { userId } },
        });
        if (!Array.isArray(response)) {
            return Promise.resolve(response.result);
        }
        return Promise.resolve([]);
    }
    async getProfile(profileId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersGetProfile,
            parameters: { args: { profileId } },
        });
        if (!Array.isArray(response)) {
            return Promise.resolve(response.result);
        }
    }
    async addProfile(profile) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersAddProfile,
            parameters: { args: { userId: profile.userId, profile } },
        });
        return response.result;
    }
    async updateProfile(profile) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersUpdateProfile,
            parameters: { args: { profile } },
        });
        if (!Array.isArray(response)) {
            return Promise.resolve(response.result);
        }
    }
    async deleteProfile(profile) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersDeleteProfile,
            parameters: { args: { userId: profile.userId, profileId: profile.id } },
        });
    }
    async grantRole(username, role) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersGrantRole,
            parameters: { args: { username, role } },
        });
    }
    async listProfiles(userId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersListProfiles,
            parameters: { args: { userId } },
        });
        return response.result;
    }
    async listRolePrivileges(role) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersListRolePrivileges,
            parameters: { args: { role } },
        });
    }
    async listRoles() {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersListRoles,
            parameters: {},
        });
    }
    async listUserPrivileges(username) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersListUserPrivileges,
            parameters: { args: { username } },
        });
    }
    async listUserRoles(username) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersListUserRoles,
            parameters: { args: { username } },
        });
    }
    async listUsers() {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersListUsers,
            parameters: {},
        });
    }
    async setCurrentProfile(profileId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiUsersSetCurrentProfile,
            parameters: { args: { profileId } },
        });
    }
    async storePassword(url, password) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsSetCredential,
            parameters: { args: { url, password } },
        });
    }
    async clearPassword(url) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsDeleteCredential,
            parameters: { args: { url } },
        });
    }
    async listCredentials() {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiDbconnectionsListCredentials,
            parameters: {},
        });
    }
}
exports.ShellInterfaceUser = ShellInterfaceUser;
//# sourceMappingURL=ShellInterfaceUser.js.map