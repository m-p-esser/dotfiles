"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceMrs = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const ProtocolMrs_1 = require("../../communication/ProtocolMrs");
const WebSession_1 = require("../WebSession");
class ShellInterfaceMrs {
    moduleSessionLookupId = "";
    async configure(enableMrs, allowRecreationOnMajorUpgrade, updateIfAvailable, options) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsConfigure,
            parameters: {
                args: {
                    moduleSessionId: this.moduleSessionId,
                    enableMrs,
                    updateIfAvailable,
                    options,
                    allowRecreationOnMajorUpgrade,
                },
            },
        });
    }
    async status() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsStatus,
            parameters: {
                args: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async listServices() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListServices,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async addService(urlContextRoot, urlProtocol, urlHostName, comments, enabled, options, authPath, authCompletedUrl, authCompletedUrlValidation, authCompletedPageContent, authApps) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsAddService,
            parameters: {
                kwargs: {
                    urlContextRoot,
                    urlHostName,
                    enabled,
                    moduleSessionId: this.moduleSessionId,
                    urlProtocol,
                    authPath,
                    comments,
                    options,
                    authCompletedUrl,
                    authCompletedUrlValidation,
                    authCompletedPageContent,
                    authApps,
                },
            },
        }, true, ["options"]);
        return response.result;
    }
    async updateService(serviceId, urlContextRoot, urlHostName, value) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsUpdateService,
            parameters: {
                kwargs: {
                    serviceId,
                    urlContextRoot,
                    urlHostName,
                    value,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        }, true, ["options"]);
    }
    async deleteService(serviceId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDeleteService,
            parameters: {
                kwargs: {
                    serviceId,
                    urlContextRoot: null,
                    urlHostName: null,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async getService(serviceId, urlContextRoot, urlHostName, getDefault, autoSelectSingle) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetService,
            parameters: {
                kwargs: {
                    serviceId,
                    urlContextRoot,
                    urlHostName,
                    getDefault,
                    autoSelectSingle,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async setCurrentService(serviceId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsSetCurrentService,
            parameters: {
                kwargs: {
                    serviceId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async getCurrentServiceMetadata() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetCurrentServiceMetadata,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getAuthVendors() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetAuthenticationVendors,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async addAuthApp(serviceId, authApp, registerUsers) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsAddAuthenticationApp,
            parameters: {
                args: {
                    serviceId,
                    appName: authApp.name,
                },
                kwargs: {
                    authVendorId: authApp.authVendorId,
                    description: authApp.description,
                    url: authApp.url,
                    urlDirectAuth: authApp.urlDirectAuth,
                    accessToken: authApp.accessToken,
                    appId: authApp.appId,
                    limitToRegisteredUsers: authApp.limitToRegisteredUsers,
                    registeredUsers: registerUsers,
                    defaultRoleId: authApp.defaultRoleId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getAuthApps(serviceId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListAuthenticationApps,
            parameters: {
                args: {
                    serviceId,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getAuthApp(appId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetAuthenticationApp,
            parameters: {
                args: {
                    appId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async deleteAuthApp(appId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDeleteAuthenticationApp,
            parameters: {
                kwargs: {
                    appId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async updateAuthApp(appId, value) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsUpdateAuthenticationApp,
            parameters: {
                kwargs: {
                    appId,
                    value,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async listUsers(serviceId, authAppId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListUsers,
            parameters: {
                kwargs: {
                    serviceId,
                    authAppId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async deleteUser(userId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDeleteUser,
            parameters: {
                args: {
                    userId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async addUser(authAppId, name, email, vendorUserId, loginPermitted, mappedUserId, appOptions, authString, userRoles) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsAddUser,
            parameters: {
                kwargs: {
                    authAppId,
                    name,
                    email,
                    vendorUserId,
                    loginPermitted,
                    mappedUserId,
                    appOptions,
                    authString,
                    userRoles,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async updateUser(userId, value, userRoles) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsUpdateUser,
            parameters: {
                kwargs: {
                    userId,
                    value,
                    userRoles,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async listSchemas(serviceId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListSchemas,
            parameters: {
                args: {
                    serviceId,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getSchema(schemaId, serviceId, requestPath, schemaName, autoSelectSingle) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetSchema,
            parameters: {
                kwargs: {
                    schemaId: schemaId ?? null,
                    serviceId: serviceId ?? null,
                    requestPath: requestPath ?? null,
                    schemaName: schemaName ?? null,
                    autoSelectSingle: autoSelectSingle ?? null,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async deleteSchema(schemaId, serviceId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDeleteSchema,
            parameters: {
                kwargs: {
                    schemaId,
                    serviceId,
                    schemaName: null,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async addSchema(serviceId, schemaName, requestPath, requiresAuth, options, itemsPerPage, comments) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsAddSchema,
            parameters: {
                kwargs: {
                    serviceId,
                    schemaName,
                    requestPath,
                    requiresAuth,
                    enabled: true,
                    itemsPerPage,
                    comments,
                    options,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async updateSchema(schemaId, serviceId, schemaName, requestPath, requiresAuth, enabled, itemsPerPage, comments, options) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsUpdateSchema,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    schemaId,
                    value: {
                        serviceId,
                        schemaName,
                        requestPath,
                        requiresAuth,
                        enabled,
                        itemsPerPage,
                        comments,
                        options,
                    },
                },
            },
        });
    }
    async addDbObject(dbObjectName, dbObjectType, autoAddSchema, requestPath, enabled, crudOperations, crudOperationFormat, requiresAuth, rowUserOwnershipEnforced, autoDetectMediaType, options, itemsPerPage, rowUserOwnershipColumn, schemaId, schemaName, comments, mediaType, authStoredProcedure, objects) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsAddDbObject,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    dbObjectName,
                    dbObjectType,
                    schemaId,
                    schemaName,
                    autoAddSchema,
                    requestPath,
                    enabled,
                    crudOperations,
                    crudOperationFormat,
                    requiresAuth,
                    itemsPerPage: itemsPerPage === null ? undefined : itemsPerPage,
                    rowUserOwnershipEnforced,
                    rowUserOwnershipColumn,
                    comments,
                    mediaType,
                    autoDetectMediaType,
                    authStoredProcedure,
                    options,
                    objects,
                },
            },
        });
        return response.result;
    }
    async updateDbObject(dbObjectId, dbObjectName, requestPath, schemaId, value) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsUpdateDbObject,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    dbObjectId,
                    schemaId,
                    dbObjectName,
                    requestPath,
                    value,
                },
            },
        });
    }
    async listDbObjects(schemaId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListDbObjects,
            parameters: {
                kwargs: {
                    schemaId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async deleteDbObject(dbObjectId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDeleteDbObject,
            parameters: {
                args: {},
                kwargs: {
                    dbObjectId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async addContentSet(contentDir, requestPath, requiresAuth, options, serviceId, comments, enabled, replaceExisting, progress) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsAddContentSet,
            parameters: {
                args: {
                    serviceId,
                    contentDir,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    requestPath,
                    requiresAuth,
                    comments,
                    options,
                    enabled,
                    replaceExisting,
                },
            },
            onData: (data) => {
                if (progress && data.result.info) {
                    progress(data.result.info);
                }
            },
        });
        return response.result;
    }
    async getServiceRequestPathAvailability(serviceId, requestPath) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetServiceRequestPathAvailability,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    serviceId,
                    requestPath,
                },
            },
        });
        return response.result;
    }
    async listContentSets(serviceId, requestPath) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListContentSets,
            parameters: {
                args: {
                    serviceId,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    requestPath,
                },
            },
        });
        return response.result;
    }
    async listContentFiles(contentSetId, includeEnableState) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListContentFiles,
            parameters: {
                args: {
                    contentSetId,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    includeEnableState,
                },
            },
        });
        return response.result;
    }
    async deleteContentSet(contentSetId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDeleteContentSet,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    contentSetId,
                },
            },
        });
    }
    get moduleSessionId() {
        return WebSession_1.webSession.moduleSessionId(this.moduleSessionLookupId);
    }
    async dumpSchema(path, serviceId, serviceName, schemaId, schemaName) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDumpSchema,
            parameters: {
                args: {
                    path,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    serviceId,
                    serviceName,
                    schemaId,
                    schemaName,
                },
            },
        });
    }
    async dumpObject(path, serviceId, serviceName, schemaId, schemaName, objectId, objectName) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDumpObject,
            parameters: {
                args: {
                    path,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    serviceId,
                    serviceName,
                    schemaId,
                    schemaName,
                    objectId,
                    objectName,
                },
            },
        });
    }
    async loadSchema(path, serviceId, serviceName) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsLoadSchema,
            parameters: {
                args: {
                    path,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    serviceId,
                    serviceName,
                },
            },
        });
    }
    async loadObject(path, serviceId, serviceName, schemaId, schemaName) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsLoadObject,
            parameters: {
                args: {
                    path,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    serviceId,
                    serviceName,
                    schemaId,
                    schemaName,
                },
            },
        });
    }
    async listRoles(serviceId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListRoles,
            parameters: {
                args: {
                    serviceId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async listUserRoles(userId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListUserRoles,
            parameters: {
                args: {
                    userId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async listRouterIds(seenWithin) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListRouterIds,
            parameters: {
                args: {
                    seenWithin,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async listRouters(activeWhenSeenWithin) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsListRouters,
            parameters: {
                args: {
                    activeWhenSeenWithin,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async deleteRouter(routerId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDeleteRouter,
            parameters: {
                args: {
                    routerId,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
    }
    async getSdkBaseClasses(sdkLanguage, prepareForRuntime) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetSdkBaseClasses,
            parameters: {
                kwargs: {
                    sdkLanguage,
                    prepareForRuntime,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getSdkServiceClasses(serviceId, sdkLanguage, prepareForRuntime, serviceUrl) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetSdkServiceClasses,
            parameters: {
                kwargs: {
                    serviceId,
                    serviceUrl,
                    sdkLanguage,
                    prepareForRuntime,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getRuntimeManagementCode() {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetRuntimeManagementCode,
            parameters: {
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async dumpSdkServiceFiles(serviceId, sdkLanguage, directory) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsDumpSdkServiceFiles,
            parameters: {
                kwargs: {
                    serviceId,
                    sdkLanguage,
                    directory,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getTableColumnsWithReferences(requestPath, dbObjectName, dbObjectId, schemaId, schemaName, dbObjectType) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetTableColumnsWithReferences,
            parameters: {
                args: {
                    dbObjectId,
                    schemaId,
                    requestPath,
                    dbObjectName,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                    schemaName,
                    dbObjectType,
                },
            },
        });
        return response.result;
    }
    async getDbObjectParameters(dbObjectName, dbSchemaName, dbObjectId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetDbObjectParameters,
            parameters: {
                args: {},
                kwargs: {
                    dbObjectId,
                    dbSchemaName,
                    dbObjectName,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getDbObject(dbObjectId, schemaId, schemaName, absoluteRequestPath) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetDbObject,
            parameters: {
                args: {},
                kwargs: {
                    dbObjectId,
                    schemaId,
                    schemaName,
                    absoluteRequestPath,
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getObjects(dbObjectId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetObjects,
            parameters: {
                args: {
                    dbObjectId,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
    async getObjectFieldsWithReferences(objectId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolMrs_1.ShellAPIMrs.MrsGetObjectFieldsWithReferences,
            parameters: {
                args: {
                    objectId,
                },
                kwargs: {
                    moduleSessionId: this.moduleSessionId,
                },
            },
        });
        return response.result;
    }
}
exports.ShellInterfaceMrs = ShellInterfaceMrs;
//# sourceMappingURL=ShellInterfaceMrs.js.map