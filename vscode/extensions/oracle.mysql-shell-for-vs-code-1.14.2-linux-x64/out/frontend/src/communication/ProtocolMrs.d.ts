import { IShellDictionary } from "./Protocol";
import { IDictionary } from "../app-logic/Types";
export declare enum ShellAPIMrs {
    MrsInfo = "mrs.info",
    MrsVersion = "mrs.version",
    MrsLs = "mrs.ls",
    MrsConfigure = "mrs.configure",
    MrsStatus = "mrs.status",
    MrsAddService = "mrs.add.service",
    MrsGetService = "mrs.get.service",
    MrsListServices = "mrs.list.services",
    MrsEnableService = "mrs.enable.service",
    MrsDisableService = "mrs.disable.service",
    MrsDeleteService = "mrs.delete.service",
    MrsSetServiceContextPath = "mrs.set.service.context_path",
    MrsSetServiceProtocol = "mrs.set.service.protocol",
    MrsSetServiceComments = "mrs.set.service.comments",
    MrsSetServiceOptions = "mrs.set.service.options",
    MrsUpdateService = "mrs.update.service",
    MrsGetServiceRequestPathAvailability = "mrs.get.service_request_path_availability",
    MrsGetCurrentServiceMetadata = "mrs.get.current_service_metadata",
    MrsSetCurrentService = "mrs.set.current_service",
    MrsGetSdkBaseClasses = "mrs.get.sdk_base_classes",
    MrsGetSdkServiceClasses = "mrs.get.sdk_service_classes",
    MrsDumpSdkServiceFiles = "mrs.dump.sdk_service_files",
    MrsGetRuntimeManagementCode = "mrs.get.runtime_management_code",
    MrsAddSchema = "mrs.add.schema",
    MrsGetSchema = "mrs.get.schema",
    MrsListSchemas = "mrs.list.schemas",
    MrsEnableSchema = "mrs.enable.schema",
    MrsDisableSchema = "mrs.disable.schema",
    MrsDeleteSchema = "mrs.delete.schema",
    MrsSetSchemaName = "mrs.set.schema.name",
    MrsSetSchemaRequestPath = "mrs.set.schema.request_path",
    MrsSetSchemaRequiresAuth = "mrs.set.schema.requires_auth",
    MrsSetSchemaItemsPerPage = "mrs.set.schema.items_per_page",
    MrsSetSchemaComments = "mrs.set.schema.comments",
    MrsUpdateSchema = "mrs.update.schema",
    MrsGetAuthenticationVendors = "mrs.get.authentication_vendors",
    MrsAddAuthenticationApp = "mrs.add.authentication_app",
    MrsGetAuthenticationApp = "mrs.get.authentication_app",
    MrsListAuthenticationApps = "mrs.list.authentication_apps",
    MrsDeleteAuthenticationApp = "mrs.delete.authentication_app",
    MrsUpdateAuthenticationApp = "mrs.update.authentication_app",
    MrsAddDbObject = "mrs.add.db_object",
    MrsGetDbObject = "mrs.get.db_object",
    MrsListDbObjects = "mrs.list.db_objects",
    MrsGetDbObjectParameters = "mrs.get.db_object_parameters",
    MrsSetDbObjectRequestPath = "mrs.set.dbObject.request_path",
    MrsSetDbObjectCrudOperations = "mrs.set.dbObject.crud_operations",
    MrsEnableDbObject = "mrs.enable.db_object",
    MrsDisableDbObject = "mrs.disable.db_object",
    MrsDeleteDbObject = "mrs.delete.db_object",
    MrsUpdateDbObject = "mrs.update.db_object",
    MrsGetTableColumnsWithReferences = "mrs.get.table_columns_with_references",
    MrsGetObjects = "mrs.get.objects",
    MrsGetObjectFieldsWithReferences = "mrs.get.object_fields_with_references",
    MrsAddContentSet = "mrs.add.content_set",
    MrsListContentSets = "mrs.list.content_sets",
    MrsGetContentSet = "mrs.get.content_set",
    MrsEnableContentSet = "mrs.enable.content_set",
    MrsDisableContentSet = "mrs.disable.content_set",
    MrsDeleteContentSet = "mrs.delete.content_set",
    MrsListContentFiles = "mrs.list.content_files",
    MrsDumpService = "mrs.dump.service",
    MrsDumpSchema = "mrs.dump.schema",
    MrsDumpObject = "mrs.dump.object",
    MrsLoadSchema = "mrs.load.schema",
    MrsLoadObject = "mrs.load.object",
    MrsListUsers = "mrs.list.users",
    MrsGetUser = "mrs.get.user",
    MrsAddUser = "mrs.add.user",
    MrsDeleteUser = "mrs.delete.user",
    MrsUpdateUser = "mrs.update.user",
    MrsListUserRoles = "mrs.list.user_roles",
    MrsAddUserRole = "mrs.add.user_role",
    MrsDeleteUserRoles = "mrs.delete.user_roles",
    MrsListRoles = "mrs.list.roles",
    MrsAddRole = "mrs.add.role",
    MrsListRouterIds = "mrs.list.router_ids",
    MrsListRouters = "mrs.list.routers",
    MrsDeleteRouter = "mrs.delete.router",
    MrsRunScript = "mrs.run.script"
}
export interface IShellMrsAddServiceKwargs {
    urlContextRoot?: string;
    urlHostName?: string;
    enabled?: boolean;
    urlProtocol?: unknown[];
    comments?: string;
    options: IShellDictionary | null;
    authPath?: string;
    authCompletedUrl?: string;
    authCompletedUrlValidation?: string;
    authCompletedPageContent?: string;
    authApps?: unknown[];
    moduleSessionId?: string;
}
export interface IShellMrsGetServiceKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    getDefault: boolean | null;
    autoSelectSingle: boolean | null;
    moduleSessionId?: string;
}
export interface IShellMrsListServicesKwargs {
    moduleSessionId?: string;
}
export interface IShellMrsEnableServiceKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsDisableServiceKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsDeleteServiceKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetServiceContextPathKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    value: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetServiceProtocolKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    value: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetServiceCommentsKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    value: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetServiceOptionsKwargs {
    urlContextRoot?: string;
    urlHostName?: string;
    value?: string;
    serviceId?: string;
    moduleSessionId?: string;
}
export interface IShellMrsUpdateServiceKwargsValue {
    urlContextRoot?: string;
    urlProtocol?: unknown[];
    urlHostName?: string;
    enabled?: boolean;
    comments?: string;
    options?: IShellDictionary;
    authPath?: string;
    authCompletedUrl?: string;
    authCompletedUrlValidation?: string;
    authCompletedPageContent?: string;
    authApps?: unknown[];
}
export interface IShellMrsUpdateServiceKwargs {
    serviceId: string | null;
    urlContextRoot: string | null;
    urlHostName: string | null;
    value: IShellMrsUpdateServiceKwargsValue | null;
    moduleSessionId?: string;
}
export interface IShellMrsGetServiceRequestPathAvailabilityKwargs {
    serviceId?: string;
    requestPath?: string;
    moduleSessionId?: string;
}
export interface IShellMrsGetCurrentServiceMetadataKwargs {
    moduleSessionId?: string;
}
export interface IShellMrsSetCurrentServiceKwargs {
    serviceId?: string;
    urlContextRoot?: string;
    urlHostName?: string;
    moduleSessionId?: string;
}
export interface IShellMrsGetSdkBaseClassesKwargs {
    sdkLanguage?: string;
    prepareForRuntime?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsGetSdkServiceClassesKwargs {
    serviceId?: string;
    serviceUrl?: string;
    sdkLanguage?: string;
    prepareForRuntime?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsDumpSdkServiceFilesKwargs {
    serviceId?: string;
    sdkLanguage?: string;
    directory?: string;
    moduleSessionId?: string;
}
export interface IShellMrsGetRuntimeManagementCodeKwargs {
    moduleSessionId?: string;
}
export interface IShellMrsAddSchemaKwargs {
    serviceId?: string;
    schemaName?: string;
    requestPath?: string;
    requiresAuth?: boolean;
    enabled?: boolean;
    itemsPerPage: number | null;
    comments?: string;
    options: IShellDictionary | null;
    moduleSessionId?: string;
}
export interface IShellMrsGetSchemaKwargs {
    serviceId: string | null;
    requestPath: string | null;
    schemaName: string | null;
    schemaId: string | null;
    autoSelectSingle: boolean | null;
    moduleSessionId?: string;
}
export interface IShellMrsListSchemasKwargs {
    includeEnableState?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsEnableSchemaKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsDisableSchemaKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsDeleteSchemaKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetSchemaNameKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    value: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetSchemaRequestPathKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    value: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetSchemaRequiresAuthKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    value: boolean | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetSchemaItemsPerPageKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    value: number | null;
    moduleSessionId?: string;
}
export interface IShellMrsSetSchemaCommentsKwargs {
    schemaId: string | null;
    serviceId: string | null;
    schemaName: string | null;
    value: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsUpdateSchemaKwargsValue {
    serviceId?: string;
    schemaName?: string;
    requestPath?: string;
    requiresAuth?: boolean;
    enabled?: boolean;
    itemsPerPage: number | null;
    comments?: string;
    options: IShellDictionary | null;
}
export interface IShellMrsUpdateSchemaKwargs {
    schemaId?: string;
    serviceId?: string;
    schemaName?: string;
    value: IShellMrsUpdateSchemaKwargsValue | null;
    moduleSessionId?: string;
}
export interface IShellMrsGetAuthenticationVendorsKwargs {
    enabled?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsAddAuthenticationAppKwargs {
    authVendorId?: string;
    description?: string;
    url?: string;
    urlDirectAuth?: string;
    accessToken?: string;
    appId?: string;
    limitToRegisteredUsers?: boolean;
    registeredUsers?: unknown[];
    defaultRoleId: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsListAuthenticationAppsKwargs {
    includeEnableState?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsDeleteAuthenticationAppKwargs {
    appId?: string;
    serviceId?: string;
    moduleSessionId?: string;
}
export interface IShellMrsUpdateAuthenticationAppKwargsValue {
    authVendorId?: string;
    name?: string;
    description?: string;
    url?: string;
    urlDirectAuth?: string;
    accessToken?: string;
    appId?: string;
    enabled?: boolean;
    limitToRegisteredUsers?: boolean;
    defaultRoleId: string | null;
}
export interface IShellMrsUpdateAuthenticationAppKwargs {
    appId?: string;
    value: IShellMrsUpdateAuthenticationAppKwargsValue | null;
    serviceId?: string;
    authAppName?: string;
    moduleSessionId?: string;
}
export interface IShellMrsAddDbObjectKwargs {
    dbObjectName?: string;
    dbObjectType?: string;
    schemaId?: string;
    schemaName?: string;
    autoAddSchema?: boolean;
    requestPath?: string;
    enabled?: boolean;
    crudOperations?: unknown[];
    crudOperationFormat?: string;
    requiresAuth?: boolean;
    itemsPerPage?: number;
    rowUserOwnershipEnforced?: boolean;
    rowUserOwnershipColumn?: string;
    comments?: string;
    mediaType?: string;
    autoDetectMediaType?: boolean;
    authStoredProcedure?: string;
    options: IShellDictionary | null;
    objects?: unknown[];
    moduleSessionId?: string;
}
export interface IShellMrsGetDbObjectKwargs {
    dbObjectId?: string;
    schemaId?: string;
    schemaName?: string;
    absoluteRequestPath?: string;
    moduleSessionId?: string;
}
export interface IShellMrsListDbObjectsKwargs {
    schemaId?: string;
    includeEnableState?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsGetDbObjectParametersKwargs {
    dbObjectId?: string;
    dbSchemaName?: string;
    dbObjectName?: string;
    moduleSessionId?: string;
}
export interface IShellMrsSetDbObjectRequestPathKwargs {
    moduleSessionId?: string;
}
export interface IShellMrsSetDbObjectCrudOperationsKwargs {
    moduleSessionId?: string;
}
export interface IShellMrsEnableDbObjectKwargs {
    dbObjectId: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsDisableDbObjectKwargs {
    dbObjectId: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsDeleteDbObjectKwargs {
    dbObjectId: string | null;
    moduleSessionId?: string;
}
export interface IShellMrsUpdateDbObjectKwargsValue {
    name?: string;
    dbSchemaId?: string;
    enabled?: boolean;
    crudOperations?: unknown[];
    crudOperationFormat?: string;
    requiresAuth?: boolean;
    itemsPerPage: number | null;
    requestPath?: string;
    autoDetectMediaType?: boolean;
    rowUserOwnershipEnforced?: boolean;
    rowUserOwnershipColumn?: string;
    comments?: string;
    mediaType?: string;
    authStoredProcedure?: string;
    options: IShellDictionary | null;
    objects?: unknown[];
}
export interface IShellMrsUpdateDbObjectKwargs {
    dbObjectId?: string;
    dbObjectIds?: unknown[];
    dbObjectName?: string;
    schemaId?: string;
    requestPath?: string;
    value?: IShellMrsUpdateDbObjectKwargsValue;
    moduleSessionId?: string;
}
export interface IShellMrsGetTableColumnsWithReferencesKwargs {
    schemaName?: string;
    dbObjectType?: string;
    moduleSessionId?: string;
}
export interface IShellMrsGetObjectsKwargs {
    moduleSessionId?: string;
}
export interface IShellMrsGetObjectFieldsWithReferencesKwargs {
    moduleSessionId?: string;
}
export interface IShellMrsAddContentSetKwargs {
    requestPath: string | null;
    requiresAuth: boolean | null;
    comments?: string;
    enabled?: boolean;
    options: IShellDictionary | null;
    replaceExisting?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsListContentSetsKwargs {
    includeEnableState?: boolean;
    requestPath?: string;
    moduleSessionId?: string;
}
export interface IShellMrsGetContentSetKwargs {
    contentSetId?: string;
    serviceId?: string;
    requestPath?: string;
    autoSelectSingle?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsEnableContentSetKwargs {
    serviceId?: string;
    contentSetId?: string;
    moduleSessionId?: string;
}
export interface IShellMrsDisableContentSetKwargs {
    serviceId?: string;
    contentSetId?: string;
    moduleSessionId?: string;
}
export interface IShellMrsDeleteContentSetKwargs {
    contentSetId?: string;
    serviceId?: string;
    requestPath?: string;
    moduleSessionId?: string;
}
export interface IShellMrsListContentFilesKwargs {
    includeEnableState?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsDumpServiceKwargs {
    serviceId?: string;
    serviceName?: string;
    moduleSessionId?: string;
}
export interface IShellMrsDumpSchemaKwargs {
    serviceId?: string;
    serviceName?: string;
    schemaId?: string;
    schemaName?: string;
    moduleSessionId?: string;
}
export interface IShellMrsDumpObjectKwargs {
    serviceId?: string;
    serviceName?: string;
    schemaId?: string;
    schemaName?: string;
    objectId?: string;
    objectName?: string;
    moduleSessionId?: string;
}
export interface IShellMrsLoadSchemaKwargs {
    serviceId?: string;
    serviceName?: string;
    reuseIds?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsLoadObjectKwargs {
    serviceId?: string;
    serviceName?: string;
    schemaId?: string;
    schemaName?: string;
    reuseIds?: boolean;
    moduleSessionId?: string;
}
export interface IShellMrsListUsersKwargs {
    serviceId?: string;
    authAppId?: string;
    moduleSessionId?: string;
}
export interface IShellMrsGetUserKwargs {
    userId?: string;
    moduleSessionId?: string;
}
export interface IShellMrsAddUserKwargs {
    authAppId?: string;
    name?: string;
    email?: string;
    vendorUserId?: string;
    loginPermitted?: boolean;
    mappedUserId?: string;
    appOptions: IShellDictionary | null;
    authString?: string;
    userRoles?: unknown[];
    moduleSessionId?: string;
}
export interface IShellMrsUpdateUserKwargsValue {
    authAppId?: string;
    name: string | null;
    email: string | null;
    vendorUserId: string | null;
    loginPermitted?: boolean;
    mappedUserId: string | null;
    appOptions: IShellDictionary | null;
    authString: string | null;
}
export interface IShellMrsUpdateUserKwargs {
    userId?: string;
    value?: IShellMrsUpdateUserKwargsValue;
    userRoles?: unknown[];
    moduleSessionId?: string;
}
export interface IShellMrsAddRoleKwargs {
    derivedFromRoleId?: string;
    specificToServiceId?: string;
    description?: string;
    moduleSessionId?: string;
}
export interface IShellMrsRunScriptKwargs {
    path?: string;
    currentServiceId?: string;
    currentService?: string;
    currentServiceHost?: string;
    currentSchemaId?: string;
    currentSchema?: string;
    moduleSessionId?: string;
}
export interface IProtocolMrsParameters {
    [ShellAPIMrs.MrsInfo]: {};
    [ShellAPIMrs.MrsVersion]: {};
    [ShellAPIMrs.MrsLs]: {
        args: {
            path?: string;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsConfigure]: {
        args: {
            moduleSessionId?: string;
            enableMrs?: boolean;
            options?: string;
            updateIfAvailable?: boolean;
            allowRecreationOnMajorUpgrade?: boolean;
        };
    };
    [ShellAPIMrs.MrsStatus]: {
        args: {
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsAddService]: {
        kwargs?: IShellMrsAddServiceKwargs;
    };
    [ShellAPIMrs.MrsGetService]: {
        kwargs?: IShellMrsGetServiceKwargs;
    };
    [ShellAPIMrs.MrsListServices]: {
        kwargs?: IShellMrsListServicesKwargs;
    };
    [ShellAPIMrs.MrsEnableService]: {
        kwargs?: IShellMrsEnableServiceKwargs;
    };
    [ShellAPIMrs.MrsDisableService]: {
        kwargs?: IShellMrsDisableServiceKwargs;
    };
    [ShellAPIMrs.MrsDeleteService]: {
        kwargs?: IShellMrsDeleteServiceKwargs;
    };
    [ShellAPIMrs.MrsSetServiceContextPath]: {
        kwargs?: IShellMrsSetServiceContextPathKwargs;
    };
    [ShellAPIMrs.MrsSetServiceProtocol]: {
        kwargs?: IShellMrsSetServiceProtocolKwargs;
    };
    [ShellAPIMrs.MrsSetServiceComments]: {
        kwargs?: IShellMrsSetServiceCommentsKwargs;
    };
    [ShellAPIMrs.MrsSetServiceOptions]: {
        kwargs?: IShellMrsSetServiceOptionsKwargs;
    };
    [ShellAPIMrs.MrsUpdateService]: {
        kwargs?: IShellMrsUpdateServiceKwargs;
    };
    [ShellAPIMrs.MrsGetServiceRequestPathAvailability]: {
        kwargs?: IShellMrsGetServiceRequestPathAvailabilityKwargs;
    };
    [ShellAPIMrs.MrsGetCurrentServiceMetadata]: {
        kwargs?: IShellMrsGetCurrentServiceMetadataKwargs;
    };
    [ShellAPIMrs.MrsSetCurrentService]: {
        kwargs?: IShellMrsSetCurrentServiceKwargs;
    };
    [ShellAPIMrs.MrsGetSdkBaseClasses]: {
        kwargs?: IShellMrsGetSdkBaseClassesKwargs;
    };
    [ShellAPIMrs.MrsGetSdkServiceClasses]: {
        kwargs?: IShellMrsGetSdkServiceClassesKwargs;
    };
    [ShellAPIMrs.MrsDumpSdkServiceFiles]: {
        kwargs?: IShellMrsDumpSdkServiceFilesKwargs;
    };
    [ShellAPIMrs.MrsGetRuntimeManagementCode]: {
        kwargs?: IShellMrsGetRuntimeManagementCodeKwargs;
    };
    [ShellAPIMrs.MrsAddSchema]: {
        kwargs?: IShellMrsAddSchemaKwargs;
    };
    [ShellAPIMrs.MrsGetSchema]: {
        kwargs?: IShellMrsGetSchemaKwargs;
    };
    [ShellAPIMrs.MrsListSchemas]: {
        args: {
            serviceId?: string;
        };
        kwargs?: IShellMrsListSchemasKwargs;
    };
    [ShellAPIMrs.MrsEnableSchema]: {
        kwargs?: IShellMrsEnableSchemaKwargs;
    };
    [ShellAPIMrs.MrsDisableSchema]: {
        kwargs?: IShellMrsDisableSchemaKwargs;
    };
    [ShellAPIMrs.MrsDeleteSchema]: {
        kwargs?: IShellMrsDeleteSchemaKwargs;
    };
    [ShellAPIMrs.MrsSetSchemaName]: {
        kwargs?: IShellMrsSetSchemaNameKwargs;
    };
    [ShellAPIMrs.MrsSetSchemaRequestPath]: {
        kwargs?: IShellMrsSetSchemaRequestPathKwargs;
    };
    [ShellAPIMrs.MrsSetSchemaRequiresAuth]: {
        kwargs?: IShellMrsSetSchemaRequiresAuthKwargs;
    };
    [ShellAPIMrs.MrsSetSchemaItemsPerPage]: {
        kwargs?: IShellMrsSetSchemaItemsPerPageKwargs;
    };
    [ShellAPIMrs.MrsSetSchemaComments]: {
        kwargs?: IShellMrsSetSchemaCommentsKwargs;
    };
    [ShellAPIMrs.MrsUpdateSchema]: {
        kwargs?: IShellMrsUpdateSchemaKwargs;
    };
    [ShellAPIMrs.MrsGetAuthenticationVendors]: {
        kwargs?: IShellMrsGetAuthenticationVendorsKwargs;
    };
    [ShellAPIMrs.MrsAddAuthenticationApp]: {
        args: {
            appName?: string;
            serviceId?: string;
        };
        kwargs?: IShellMrsAddAuthenticationAppKwargs;
    };
    [ShellAPIMrs.MrsGetAuthenticationApp]: {
        args: {
            appId?: string;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsListAuthenticationApps]: {
        args: {
            serviceId?: string;
        };
        kwargs?: IShellMrsListAuthenticationAppsKwargs;
    };
    [ShellAPIMrs.MrsDeleteAuthenticationApp]: {
        kwargs?: IShellMrsDeleteAuthenticationAppKwargs;
    };
    [ShellAPIMrs.MrsUpdateAuthenticationApp]: {
        kwargs?: IShellMrsUpdateAuthenticationAppKwargs;
    };
    [ShellAPIMrs.MrsAddDbObject]: {
        kwargs?: IShellMrsAddDbObjectKwargs;
    };
    [ShellAPIMrs.MrsGetDbObject]: {
        args: {
            requestPath?: string;
            dbObjectName?: string;
        };
        kwargs?: IShellMrsGetDbObjectKwargs;
    };
    [ShellAPIMrs.MrsListDbObjects]: {
        kwargs?: IShellMrsListDbObjectsKwargs;
    };
    [ShellAPIMrs.MrsGetDbObjectParameters]: {
        args: {
            requestPath?: string;
        };
        kwargs?: IShellMrsGetDbObjectParametersKwargs;
    };
    [ShellAPIMrs.MrsSetDbObjectRequestPath]: {
        args: {
            dbObjectId?: string;
            requestPath?: string;
        };
        kwargs?: IShellMrsSetDbObjectRequestPathKwargs;
    };
    [ShellAPIMrs.MrsSetDbObjectCrudOperations]: {
        args: {
            dbObjectId?: string;
            crudOperations?: unknown[];
            crudOperationFormat?: string;
        };
        kwargs?: IShellMrsSetDbObjectCrudOperationsKwargs;
    };
    [ShellAPIMrs.MrsEnableDbObject]: {
        args: {
            dbObjectName?: string;
            schemaId?: string;
        };
        kwargs?: IShellMrsEnableDbObjectKwargs;
    };
    [ShellAPIMrs.MrsDisableDbObject]: {
        args: {
            dbObjectName?: string;
            schemaId?: string;
        };
        kwargs?: IShellMrsDisableDbObjectKwargs;
    };
    [ShellAPIMrs.MrsDeleteDbObject]: {
        args: {
            dbObjectName?: string;
            schemaId?: string;
        };
        kwargs?: IShellMrsDeleteDbObjectKwargs;
    };
    [ShellAPIMrs.MrsUpdateDbObject]: {
        kwargs?: IShellMrsUpdateDbObjectKwargs;
    };
    [ShellAPIMrs.MrsGetTableColumnsWithReferences]: {
        args: {
            dbObjectId?: string;
            schemaId?: string;
            requestPath?: string;
            dbObjectName?: string;
        };
        kwargs?: IShellMrsGetTableColumnsWithReferencesKwargs;
    };
    [ShellAPIMrs.MrsGetObjects]: {
        args: {
            dbObjectId?: string;
        };
        kwargs?: IShellMrsGetObjectsKwargs;
    };
    [ShellAPIMrs.MrsGetObjectFieldsWithReferences]: {
        args: {
            objectId?: string;
        };
        kwargs?: IShellMrsGetObjectFieldsWithReferencesKwargs;
    };
    [ShellAPIMrs.MrsAddContentSet]: {
        args: {
            serviceId?: string;
            contentDir?: string;
        };
        kwargs?: IShellMrsAddContentSetKwargs;
    };
    [ShellAPIMrs.MrsListContentSets]: {
        args: {
            serviceId?: string;
        };
        kwargs?: IShellMrsListContentSetsKwargs;
    };
    [ShellAPIMrs.MrsGetContentSet]: {
        kwargs?: IShellMrsGetContentSetKwargs;
    };
    [ShellAPIMrs.MrsEnableContentSet]: {
        kwargs?: IShellMrsEnableContentSetKwargs;
    };
    [ShellAPIMrs.MrsDisableContentSet]: {
        kwargs?: IShellMrsDisableContentSetKwargs;
    };
    [ShellAPIMrs.MrsDeleteContentSet]: {
        kwargs?: IShellMrsDeleteContentSetKwargs;
    };
    [ShellAPIMrs.MrsListContentFiles]: {
        args: {
            contentSetId: string;
        };
        kwargs?: IShellMrsListContentFilesKwargs;
    };
    [ShellAPIMrs.MrsDumpService]: {
        args: {
            path: string;
        };
        kwargs?: IShellMrsDumpServiceKwargs;
    };
    [ShellAPIMrs.MrsDumpSchema]: {
        args: {
            path: string;
        };
        kwargs?: IShellMrsDumpSchemaKwargs;
    };
    [ShellAPIMrs.MrsDumpObject]: {
        args: {
            path: string;
        };
        kwargs?: IShellMrsDumpObjectKwargs;
    };
    [ShellAPIMrs.MrsLoadSchema]: {
        args: {
            path: string;
        };
        kwargs?: IShellMrsLoadSchemaKwargs;
    };
    [ShellAPIMrs.MrsLoadObject]: {
        args: {
            path: string;
        };
        kwargs?: IShellMrsLoadObjectKwargs;
    };
    [ShellAPIMrs.MrsListUsers]: {
        kwargs?: IShellMrsListUsersKwargs;
    };
    [ShellAPIMrs.MrsGetUser]: {
        kwargs?: IShellMrsGetUserKwargs;
    };
    [ShellAPIMrs.MrsAddUser]: {
        kwargs?: IShellMrsAddUserKwargs;
    };
    [ShellAPIMrs.MrsDeleteUser]: {
        args: {
            userId?: string;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsUpdateUser]: {
        kwargs?: IShellMrsUpdateUserKwargs;
    };
    [ShellAPIMrs.MrsListUserRoles]: {
        args: {
            userId?: string;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsAddUserRole]: {
        args: {
            userId?: string;
            roleId?: string;
            comments?: string;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsDeleteUserRoles]: {
        args: {
            userId?: string;
            roleId?: string;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsListRoles]: {
        args: {
            serviceId?: string;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsAddRole]: {
        args: {
            caption: string;
        };
        kwargs?: IShellMrsAddRoleKwargs;
    };
    [ShellAPIMrs.MrsListRouterIds]: {
        args: {
            seenWithin?: number;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsListRouters]: {
        args: {
            activeWhenSeenWithin?: number;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsDeleteRouter]: {
        args: {
            routerId?: number;
            moduleSessionId?: string;
        };
    };
    [ShellAPIMrs.MrsRunScript]: {
        args: {
            mrsScript?: string;
        };
        kwargs?: IShellMrsRunScriptKwargs;
    };
}
export interface IMrsDbObjectParameterData {
    id?: string;
    position: number;
    name: string;
    mode: string;
    datatype: string;
}
export interface IMrsDbObjectData extends IDictionary {
    changedAt?: string;
    comments: string;
    crudOperations: string[];
    crudOperationFormat: string;
    dbSchemaId: string;
    enabled: number;
    hostCtx?: string;
    id: string;
    itemsPerPage?: number;
    name: string;
    objectType: string;
    requestPath: string;
    requiresAuth: number;
    rowUserOwnershipColumn?: string;
    rowUserOwnershipEnforced: number;
    schemaRequestPath?: string;
    schemaName?: string;
    qualifiedName?: string;
    serviceId: string;
    mediaType?: string;
    autoDetectMediaType: number;
    authStoredProcedure?: string;
    options?: IShellDictionary;
    objects?: IMrsObject[];
}
export interface IMrsContentSetData {
    comments: string;
    enabled: number;
    hostCtx: string;
    id: string;
    requestPath: string;
    requiresAuth: number;
    serviceId: string;
    options: IShellDictionary;
}
export interface IMrsContentFileData {
    id: string;
    contentSetId: string;
    requestPath: string;
    requiresAuth: boolean;
    enabled: boolean;
    size: number;
    contentSetRequestPath: string;
    hostCtx: string;
    changedAt: string;
}
export interface IMrsAddContentSetData {
    contentSetId?: string;
    numberOfFilesUploaded?: number;
    info?: string;
}
export interface IMrsServiceData {
    enabled: number;
    hostCtx: string;
    id: string;
    isCurrent: number;
    urlContextRoot: string;
    urlHostName: string;
    urlProtocol: string;
    comments: string;
    options: IShellDictionary;
    authPath: string;
    authCompletedUrl: string;
    authCompletedUrlValidation: string;
    authCompletedPageContent: string;
    authApps?: IMrsAuthAppData[];
    enableSqlEndpoint?: number;
    customMetadataSchema?: string;
}
export interface IMrsAuthAppData {
    id?: string;
    authVendorId?: string;
    authVendor?: string;
    authVendorName?: string;
    serviceId?: string;
    name?: string;
    description?: string;
    url?: string;
    urlDirectAuth?: string;
    accessToken?: string;
    appId?: string;
    enabled: boolean;
    limitToRegisteredUsers: boolean;
    defaultRoleId: string | null;
}
export interface IMrsAuthVendorData {
    id?: string;
    name: string;
    validationUrl?: string;
    enabled: boolean;
    comments?: string;
}
export interface IMrsUserData {
    id?: string;
    authAppId?: string;
    name?: string;
    email?: string;
    vendorUserId?: string;
    loginPermitted?: boolean;
    mappedUserId?: string;
    appOptions?: IShellDictionary;
    authString?: string;
}
export interface IMrsSchemaData {
    comments: string;
    enabled: number;
    hostCtx: string;
    id: string;
    itemsPerPage: number;
    name: string;
    requestPath: string;
    requiresAuth: number;
    serviceId: string;
    options?: IShellDictionary;
}
export interface IMrsStatusData {
    serviceConfigured: boolean;
    serviceCount: number;
    serviceEnabled: boolean;
    serviceUpgradeable: boolean;
    majorUpgradeRequired: boolean;
    currentMetadataVersion?: string;
    requiredMetadataVersion?: string;
    requiredRouterVersion?: string;
}
export interface IMrsRoleData {
    id: string;
    derivedFromRoleId: string;
    specificToServiceId: string;
    caption: string;
    description: string;
}
export interface IMrsUserRoleData {
    userId: string | null;
    roleId: string | null;
    comments: string | null;
}
export interface IMrsRouterData {
    id: number;
    routerName: string;
    address: string;
    productName: string;
    version: string;
    lastCheckIn: string;
    attributes: IShellDictionary;
    options: IShellDictionary;
    active: boolean;
}
export interface IMrsCurrentServiceMetadata {
    id?: string;
    hostCtx?: string;
    metadataVersion?: string;
}
export interface IMrsTableColumn {
    name: string;
    datatype: string;
    notNull: boolean;
    isPrimary: boolean;
    isUnique: boolean;
    isGenerated: boolean;
    idGeneration?: string;
    comment?: string;
    in?: boolean;
    out?: boolean;
}
export interface IMrsColumnMapping {
    base: string;
    ref: string;
}
export interface IMrsTableReference {
    kind: string;
    constraint: string;
    toMany: boolean;
    referencedSchema: string;
    referencedTable: string;
    columnMapping: IMrsColumnMapping[];
}
export interface IMrsTableColumnWithReference {
    position: number;
    name: string;
    refColumnNames: string;
    dbColumn?: IMrsTableColumn;
    referenceMapping?: IMrsTableReference;
    tableSchema: string;
    tableName: string;
}
export interface IMrsObjectFieldSdkLanguageOptions {
    language: string;
    fieldName?: string;
}
export interface IMrsObjectFieldSdkOptions {
    datatypeName?: string;
    languageOptions?: IMrsObjectFieldSdkLanguageOptions[];
}
export interface IMrsObjectReferenceSdkLanguageOptions {
    language: string;
    interfaceName?: string;
}
export interface IMrsObjectReferenceSdkOptions {
    languageOptions?: IMrsObjectReferenceSdkLanguageOptions[];
}
export interface IMrsObjectReference {
    id: string;
    reduceToValueOfFieldId?: string;
    referenceMapping: IMrsTableReference;
    unnest: boolean;
    crudOperations: string;
    sdkOptions?: IMrsObjectReferenceSdkOptions;
    comments?: string;
}
export interface IMrsObjectFieldWithReference {
    id: string;
    objectId: string;
    representsReferenceId?: string;
    parentReferenceId?: string;
    name: string;
    position: number;
    dbColumn?: IMrsTableColumn;
    enabled: boolean;
    allowFiltering: boolean;
    allowSorting: boolean;
    noCheck: boolean;
    noUpdate: boolean;
    sdkOptions?: IMrsObjectFieldSdkOptions;
    comments?: string;
    objectReference?: IMrsObjectReference;
    lev?: number;
    caption?: string;
    storedDbColumn?: IMrsTableColumn;
}
export interface IMrsObjectSdkLanguageOptions {
    language: string;
    className?: string;
}
export interface IMrsObjectSdkOptions extends IShellDictionary {
    languageOptions?: IMrsObjectSdkLanguageOptions[];
}
export interface IMrsObject {
    id: string;
    dbObjectId: string;
    name: string;
    position: number;
    kind: string;
    sdkOptions?: IMrsObjectSdkOptions;
    comments?: string;
    fields?: IMrsObjectFieldWithReference[];
    storedFields?: IMrsObjectFieldWithReference[];
}
export declare enum MrsScriptResultType {
    Success = "success",
    Error = "error"
}
export interface IMrsScriptResult {
    statementIndex: number;
    type: MrsScriptResultType;
    message: string;
    operation: string;
    id?: string;
    result?: IDictionary;
}
export interface IProtocolMrsResults {
    [ShellAPIMrs.MrsAddService]: {
        result: IMrsServiceData;
    };
    [ShellAPIMrs.MrsGetService]: {
        result: IMrsServiceData;
    };
    [ShellAPIMrs.MrsListServices]: {
        result: IMrsServiceData[];
    };
    [ShellAPIMrs.MrsEnableService]: {};
    [ShellAPIMrs.MrsDisableService]: {};
    [ShellAPIMrs.MrsDeleteService]: {};
    [ShellAPIMrs.MrsSetCurrentService]: {};
    [ShellAPIMrs.MrsGetCurrentServiceMetadata]: {
        result: IMrsCurrentServiceMetadata;
    };
    [ShellAPIMrs.MrsSetServiceContextPath]: {};
    [ShellAPIMrs.MrsSetServiceProtocol]: {};
    [ShellAPIMrs.MrsSetServiceComments]: {};
    [ShellAPIMrs.MrsSetServiceOptions]: {};
    [ShellAPIMrs.MrsUpdateService]: {};
    [ShellAPIMrs.MrsGetServiceRequestPathAvailability]: {
        result: boolean;
    };
    [ShellAPIMrs.MrsAddSchema]: {
        result: string;
    };
    [ShellAPIMrs.MrsGetSchema]: {
        result: IMrsSchemaData;
    };
    [ShellAPIMrs.MrsListSchemas]: {
        result: IMrsSchemaData[];
    };
    [ShellAPIMrs.MrsEnableSchema]: {};
    [ShellAPIMrs.MrsDisableSchema]: {};
    [ShellAPIMrs.MrsDeleteSchema]: {};
    [ShellAPIMrs.MrsSetSchemaName]: {};
    [ShellAPIMrs.MrsSetSchemaRequestPath]: {};
    [ShellAPIMrs.MrsSetSchemaRequiresAuth]: {};
    [ShellAPIMrs.MrsSetSchemaItemsPerPage]: {};
    [ShellAPIMrs.MrsSetSchemaComments]: {};
    [ShellAPIMrs.MrsUpdateSchema]: {};
    [ShellAPIMrs.MrsAddContentSet]: {
        result: IMrsAddContentSetData;
    };
    [ShellAPIMrs.MrsListContentSets]: {
        result: IMrsContentSetData[];
    };
    [ShellAPIMrs.MrsGetContentSet]: {};
    [ShellAPIMrs.MrsEnableContentSet]: {};
    [ShellAPIMrs.MrsDisableContentSet]: {};
    [ShellAPIMrs.MrsDeleteContentSet]: {};
    [ShellAPIMrs.MrsAddDbObject]: {
        result: string;
    };
    [ShellAPIMrs.MrsGetDbObject]: {
        result: IMrsDbObjectData;
    };
    [ShellAPIMrs.MrsListDbObjects]: {
        result: IMrsDbObjectData[];
    };
    [ShellAPIMrs.MrsGetDbObjectParameters]: {
        result: IMrsDbObjectParameterData[];
    };
    [ShellAPIMrs.MrsSetDbObjectRequestPath]: {};
    [ShellAPIMrs.MrsSetDbObjectCrudOperations]: {};
    [ShellAPIMrs.MrsEnableDbObject]: {};
    [ShellAPIMrs.MrsDisableDbObject]: {};
    [ShellAPIMrs.MrsDeleteDbObject]: {};
    [ShellAPIMrs.MrsUpdateDbObject]: {};
    [ShellAPIMrs.MrsListContentFiles]: {
        result: IMrsContentFileData[];
    };
    [ShellAPIMrs.MrsGetAuthenticationVendors]: {
        result: IMrsAuthVendorData[];
    };
    [ShellAPIMrs.MrsAddAuthenticationApp]: {
        result: IMrsAuthAppData;
    };
    [ShellAPIMrs.MrsDeleteAuthenticationApp]: {};
    [ShellAPIMrs.MrsUpdateAuthenticationApp]: {};
    [ShellAPIMrs.MrsListAuthenticationApps]: {
        result: IMrsAuthAppData[];
    };
    [ShellAPIMrs.MrsGetAuthenticationApp]: {
        result: IMrsAuthAppData;
    };
    [ShellAPIMrs.MrsInfo]: {};
    [ShellAPIMrs.MrsVersion]: {};
    [ShellAPIMrs.MrsLs]: {};
    [ShellAPIMrs.MrsConfigure]: {};
    [ShellAPIMrs.MrsStatus]: {
        result: IMrsStatusData;
    };
    [ShellAPIMrs.MrsDumpService]: {};
    [ShellAPIMrs.MrsDumpSchema]: {};
    [ShellAPIMrs.MrsDumpObject]: {};
    [ShellAPIMrs.MrsLoadSchema]: {};
    [ShellAPIMrs.MrsLoadObject]: {};
    [ShellAPIMrs.MrsListUsers]: {
        result: IMrsUserData[];
    };
    [ShellAPIMrs.MrsDeleteUser]: {};
    [ShellAPIMrs.MrsAddUser]: {};
    [ShellAPIMrs.MrsUpdateUser]: {};
    [ShellAPIMrs.MrsGetUser]: {
        result: IMrsUserData;
    };
    [ShellAPIMrs.MrsListRoles]: {
        result: IMrsRoleData[];
    };
    [ShellAPIMrs.MrsListUserRoles]: {
        result: IMrsUserRoleData[];
    };
    [ShellAPIMrs.MrsAddUserRole]: {};
    [ShellAPIMrs.MrsDeleteUserRoles]: {};
    [ShellAPIMrs.MrsAddRole]: {};
    [ShellAPIMrs.MrsListRouterIds]: {
        result: number[];
    };
    [ShellAPIMrs.MrsListRouters]: {
        result: IMrsRouterData[];
    };
    [ShellAPIMrs.MrsDeleteRouter]: {};
    [ShellAPIMrs.MrsGetObjects]: {
        result: IMrsObject[];
    };
    [ShellAPIMrs.MrsGetSdkBaseClasses]: {
        result: string;
    };
    [ShellAPIMrs.MrsGetSdkServiceClasses]: {
        result: string;
    };
    [ShellAPIMrs.MrsGetRuntimeManagementCode]: {
        result: string;
    };
    [ShellAPIMrs.MrsGetTableColumnsWithReferences]: {
        result: IMrsTableColumnWithReference[];
    };
    [ShellAPIMrs.MrsGetObjectFieldsWithReferences]: {
        result: IMrsObjectFieldWithReference[];
    };
    [ShellAPIMrs.MrsDumpSdkServiceFiles]: {
        result: boolean;
    };
    [ShellAPIMrs.MrsRunScript]: {
        result: IMrsScriptResult[];
    };
}
