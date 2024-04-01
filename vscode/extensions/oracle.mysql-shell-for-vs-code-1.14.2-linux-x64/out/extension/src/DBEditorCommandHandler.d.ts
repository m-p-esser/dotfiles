import { DBConnectionViewProvider } from "./web-views/DBConnectionViewProvider";
import { ExtensionHost } from "./ExtensionHost";
import { ConnectionsTreeDataProvider } from "./tree-providers/ConnectionsTreeProvider/ConnectionsTreeProvider";
export declare class DBEditorCommandHandler {
    #private;
    private connectionsProvider;
    constructor(connectionsProvider: ConnectionsTreeDataProvider);
    setup(host: ExtensionHost): void;
    refreshConnectionTree(): Promise<void>;
    clear(): void;
    providerClosed(provider: DBConnectionViewProvider): void;
    generateNewProviderCaption(): string;
    providerStateChanged(provider: DBConnectionViewProvider, active: boolean): void;
    private createNewDbObject;
    private connectedToUrl;
    private editorRunQuery;
    private editorLoadScript;
    private editorSaveScript;
    private createNewEditor;
    private languageFromConnection;
    private proxyRequest;
}
