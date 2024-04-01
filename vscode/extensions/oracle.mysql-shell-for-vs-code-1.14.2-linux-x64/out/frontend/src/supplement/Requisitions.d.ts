import { EditorLanguage, IExecutionContext, INewEditorRequest, IRunQueryRequest, IScriptRequest, ISqlPageRequest } from ".";
import { IDialogRequest, IDialogResponse, IDictionary, IServicePasswordRequest, IStatusbarInfo } from "../app-logic/Types";
import type { IEmbeddedMessage, IEmbeddedSourceType, IMySQLDbSystem } from "../communication";
import { IShellProfile, IShellPromptValues, IWebSessionData } from "../communication/ProtocolGui";
import type { IMrsAuthAppData, IMrsContentSetData, IMrsDbObjectData, IMrsSchemaData, IMrsServiceData, IMrsUserData } from "../communication/ProtocolMrs";
import { IThemeChangeData } from "../components/Theming/ThemeManager";
import { EntityType, IEditorStatusInfo, ISchemaTreeEntry } from "../modules/db-editor";
import { DBType, IConnectionDetails, IShellSessionDetails } from "./ShellInterface";
export declare const appParameters: Map<string, string> & IAppParameters;
interface IAppParameters {
    embedded?: boolean;
    inExtension?: boolean;
    inDevelopment?: boolean;
    testsRunning?: boolean;
    launchWithDebugger?: boolean;
    fontSize?: number;
    editorFontSize?: number;
}
export declare type SimpleCallback = (_: unknown) => Promise<boolean>;
export interface IOpenDialogFilters {
    [key: string]: string[];
}
export interface IOpenDialogOptions {
    id?: string;
    default?: string;
    openLabel?: string;
    canSelectFiles?: boolean;
    canSelectFolders?: boolean;
    canSelectMany?: boolean;
    filters?: IOpenDialogFilters;
    title?: string;
}
export interface IOpenFileDialogResult {
    resourceId: string;
    path: string[];
}
export interface IEditorExecutionOptions {
    startNewBlock: boolean;
    forceSecondaryEngine: boolean;
    asText: boolean;
}
export interface IDebuggerData {
    request?: INativeShellRequest;
    response?: INativeShellResponse;
}
export interface IEditorOpenChangeData {
    opened: true;
    connectionId: number;
    connectionCaption: string;
    dbType: DBType;
    editorId: string;
    editorCaption: string;
    language: EditorLanguage;
    editorType: EntityType;
}
export interface IEditorCloseChangeData {
    opened: false;
    connectionId: number;
    editorId?: string;
}
export interface IWebviewProvider {
    caption: string;
    close(): void;
    runCommand<K extends keyof IRequestTypeMap>(requestType: K, parameter: IRequisitionCallbackValues<K>, caption: string, settingName: string): Promise<boolean>;
}
export interface IProxyRequest {
    provider: IWebviewProvider;
    original: IRequestListEntry<keyof IRequestTypeMap>;
}
export declare type InitialEditor = "default" | "none" | "notebook" | "script";
export interface IMrsDbObjectEditRequest extends IDictionary {
    dbObject: IMrsDbObjectData;
    createObject: boolean;
}
export interface IMrsSchemaEditRequest extends IDictionary {
    schemaName?: string;
    schema?: IMrsSchemaData;
}
export interface IMrsContentSetEditRequest extends IDictionary {
    directory?: string;
    contentSet?: IMrsContentSetData;
}
export interface IMrsAuthAppEditRequest extends IDictionary {
    authApp?: IMrsAuthAppData;
    service?: IMrsServiceData;
}
export interface IMrsUserEditRequest extends IDictionary {
    authApp: IMrsAuthAppData;
    user?: IMrsUserData;
}
export interface IRequestTypeMap {
    "applicationDidStart": SimpleCallback;
    "applicationWillFinish": SimpleCallback;
    "socketStateChanged": (connected: boolean) => Promise<boolean>;
    "webSessionStarted": (data: IWebSessionData) => Promise<boolean>;
    "userAuthenticated": (activeProfile: IShellProfile) => Promise<boolean>;
    "updateStatusbar": (items: IStatusbarInfo[]) => Promise<boolean>;
    "profileLoaded": SimpleCallback;
    "changeProfile": (id: string | number) => Promise<boolean>;
    "statusBarButtonClick": (values: {
        type: string;
        event: MouseEvent | KeyboardEvent;
    }) => Promise<boolean>;
    "editorInfoUpdated": (info: IEditorStatusInfo) => Promise<boolean>;
    "themeChanged": (data: IThemeChangeData) => Promise<boolean>;
    "openConnectionTab": (data: {
        details: IConnectionDetails;
        force: boolean;
        initialEditor: InitialEditor;
    }) => Promise<boolean>;
    "selectFile": (result: IOpenFileDialogResult) => Promise<boolean>;
    "showOpenDialog": (options: IOpenDialogOptions) => Promise<boolean>;
    "sqlShowDataAtPage": (data: ISqlPageRequest) => Promise<boolean>;
    "editorExecuteSelectedOrAll": (options: IEditorExecutionOptions) => Promise<boolean>;
    "editorExecuteCurrent": (options: IEditorExecutionOptions) => Promise<boolean>;
    "editorFind": SimpleCallback;
    "editorFormat": SimpleCallback;
    "editorRunCommand": (details: {
        command: string;
        context: IExecutionContext;
    }) => Promise<boolean>;
    "editorToggleStopExecutionOnError": (active: boolean) => Promise<boolean>;
    "editorStopExecution": SimpleCallback;
    "editorToggleAutoCommit": SimpleCallback;
    "editorExecuteExplain": SimpleCallback;
    "editorCommit": SimpleCallback;
    "editorRollback": SimpleCallback;
    "editorShowConnections": SimpleCallback;
    "editorInsertUserScript": (data: {
        language: EditorLanguage;
        resourceId: number;
    }) => Promise<boolean>;
    "editorRunQuery": (details: IRunQueryRequest) => Promise<boolean>;
    "editorRunScript": (details: IScriptRequest) => Promise<boolean>;
    "editorEditScript": (details: IScriptRequest) => Promise<boolean>;
    "editorLoadScript": (details: IScriptRequest) => Promise<boolean>;
    "editorSaveScript": (details: IScriptRequest) => Promise<boolean>;
    "editorSaved": (details: {
        id: string;
        newName: string;
        saved: boolean;
    }) => Promise<boolean>;
    "editorRenameScript": (details: IScriptRequest) => Promise<boolean>;
    "editorValidationDone": (id: string) => Promise<boolean>;
    "editorSelectStatement": (details: {
        contextId: string;
        statementIndex: number;
    }) => Promise<boolean>;
    "editorSaveNotebook": (content?: string) => Promise<boolean>;
    "editorSaveNotebookInPlace": (content?: string) => Promise<boolean>;
    "editorLoadNotebook": (details?: {
        content: string;
        standalone: boolean;
    }) => Promise<boolean>;
    "editorClose": (details: {
        connectionId: number;
        editorId: string;
    }) => Promise<boolean>;
    "editorContextStateChanged": (id: string) => Promise<boolean>;
    "editorsChanged": (details: IEditorOpenChangeData | IEditorCloseChangeData) => Promise<boolean>;
    "editorSelect": (details: {
        connectionId: number;
        editorId: string;
    }) => Promise<boolean>;
    "editorChanged": SimpleCallback;
    "sqlSetCurrentSchema": (data: {
        id: string;
        connectionId: number;
        schema: string;
    }) => Promise<boolean>;
    "sqlTransactionChanged": SimpleCallback;
    "sqlTransactionEnded": SimpleCallback;
    "moduleToggle": (id: string) => Promise<boolean>;
    "sessionAdded": (session: IShellSessionDetails) => Promise<boolean>;
    "sessionRemoved": (session: IShellSessionDetails) => Promise<boolean>;
    "openSession": (session: IShellSessionDetails) => Promise<boolean>;
    "removeSession": (session: IShellSessionDetails) => Promise<boolean>;
    "newSession": (session: IShellSessionDetails) => Promise<boolean>;
    "addNewConnection": (details: {
        mdsData?: IMySQLDbSystem;
        profileName?: String;
    }) => Promise<boolean>;
    "removeConnection": (connectionId: number) => Promise<boolean>;
    "editConnection": (connectionId: number) => Promise<boolean>;
    "duplicateConnection": (connectionId: number) => Promise<boolean>;
    "connectionAdded": (details: IConnectionDetails) => Promise<boolean>;
    "connectionUpdated": (details: IConnectionDetails) => Promise<boolean>;
    "connectionRemoved": (details: IConnectionDetails) => Promise<boolean>;
    "explorerDoubleClick": (entry: ISchemaTreeEntry) => Promise<boolean>;
    "requestPassword": (request: IServicePasswordRequest) => Promise<boolean>;
    "acceptPassword": (data: {
        request: IServicePasswordRequest;
        password: string;
    }) => Promise<boolean>;
    "cancelPassword": (request: IServicePasswordRequest) => Promise<boolean>;
    "requestMrsAuthentication": (request: IServicePasswordRequest) => Promise<boolean>;
    "acceptMrsAuthentication": (data: {
        request: IServicePasswordRequest;
        password: string;
    }) => Promise<boolean>;
    "cancelMrsAuthentication": (request: IServicePasswordRequest) => Promise<boolean>;
    "refreshMrsServiceSdk": SimpleCallback;
    "showAbout": SimpleCallback;
    "showThemeEditor": SimpleCallback;
    "showPreferences": SimpleCallback;
    "showModule": (module: string) => Promise<boolean>;
    "showPage": (data: {
        module: string;
        page: string;
        noEditor?: boolean;
    }) => Promise<boolean>;
    "showPageSection": (details: {
        id: string;
        type: EntityType;
    }) => Promise<boolean>;
    "showDialog": (request: IDialogRequest) => Promise<boolean>;
    "dialogResponse": (response: IDialogResponse) => Promise<boolean>;
    "settingsChanged": (entry?: {
        key: string;
        value: unknown;
    }) => Promise<boolean>;
    "updateShellPrompt": (values: IShellPromptValues) => Promise<boolean>;
    "refreshOciTree": SimpleCallback;
    "refreshConnections": (data?: IDictionary) => Promise<boolean>;
    "connectionsUpdated": SimpleCallback;
    "selectConnectionTab": (details: {
        connectionId: number;
        page: string;
    }) => Promise<boolean>;
    "codeBlocksUpdate": (data: {
        linkId: number;
        code: string;
    }) => Promise<boolean>;
    "showError": (values: string[]) => Promise<boolean>;
    "showInfo": (values: string[]) => Promise<boolean>;
    "connectedToUrl": (url?: URL) => Promise<boolean>;
    "refreshSessions": (sessions: IShellSessionDetails[]) => Promise<boolean>;
    "closeInstance": SimpleCallback;
    "createNewEditor": (request: INewEditorRequest) => Promise<boolean>;
    "dbFileDropped": (fileName: string) => Promise<boolean>;
    "hostThemeChange": (data: {
        css: string;
        themeClass: string;
    }) => Promise<boolean>;
    "showMrsServiceDialog": (data?: IMrsServiceData) => Promise<boolean>;
    "showMrsSchemaDialog": (data: IMrsSchemaEditRequest) => Promise<boolean>;
    "showMrsDbObjectDialog": (data: IMrsDbObjectEditRequest) => Promise<boolean>;
    "showMrsContentSetDialog": (data: IMrsContentSetEditRequest) => Promise<boolean>;
    "showMrsAuthAppDialog": (data: IMrsAuthAppEditRequest) => Promise<boolean>;
    "showMrsUserDialog": (data: IMrsUserEditRequest) => Promise<boolean>;
    "job": (job: Array<IRequestListEntry<keyof IRequestTypeMap>>) => Promise<boolean>;
    "proxyRequest": (request: IProxyRequest) => Promise<boolean>;
    "message": (message: string) => Promise<boolean>;
    "debugger": (data: IDebuggerData) => Promise<boolean>;
}
interface IRemoteTarget {
    postMessage?: (data: IEmbeddedMessage, origin: string) => void;
    broadcastRequest?: <K extends keyof IRequestTypeMap>(sender: IWebviewProvider | undefined, requestType: K, parameter: IRequisitionCallbackValues<K>) => Promise<void>;
}
export declare type IRequisitionCallbackValues<K extends keyof IRequestTypeMap> = Parameters<IRequestTypeMap[K]>[0];
export interface IRequestListEntry<K extends keyof IRequestTypeMap> {
    requestType: K;
    parameter: IRequisitionCallbackValues<K>;
}
export declare class RequisitionHub {
    private registry;
    private remoteTarget?;
    private source;
    private requestPipeline;
    constructor(source?: IEmbeddedSourceType);
    static get instance(): RequisitionHub;
    setRemoteTarget(target?: IRemoteTarget): void;
    register: <K extends keyof IRequestTypeMap>(requestType: K, callback: IRequestTypeMap[K]) => void;
    unregister: <K extends keyof IRequestTypeMap>(requestType?: K | undefined, callback?: IRequestTypeMap[K] | undefined) => void;
    registrations: <K extends keyof IRequestTypeMap>(requestType: K) => number;
    execute: <K extends keyof IRequestTypeMap>(requestType: K, parameter: IRequisitionCallbackValues<K>) => Promise<boolean>;
    executeRemote: <K extends keyof IRequestTypeMap>(requestType: K, parameter: IRequisitionCallbackValues<K>) => boolean;
    broadcastRequest: <K extends keyof IRequestTypeMap>(provider: IWebviewProvider | undefined, requestType: K, parameter: IRequisitionCallbackValues<K>) => Promise<boolean>;
    handleRemoteMessage(message: IEmbeddedMessage): void;
    writeToClipboard(text: string): void;
}
export declare const requisitions: RequisitionHub;
export {};
