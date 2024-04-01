import { CustomTextEditorProvider, TextDocument, WebviewPanel } from "vscode";
import { ExtensionHost } from "../ExtensionHost";
export declare class NotebookEditorProvider implements CustomTextEditorProvider {
    #private;
    setup(host: ExtensionHost): void;
    resolveCustomTextEditor(document: TextDocument, webviewPanel: WebviewPanel): Thenable<void> | void;
    private showNotebookPage;
    private handleConnectionsUpdated;
    private handleConnectToUrl;
    private setupWebview;
    private isValidConnectionId;
    private handleDispose;
    private makeDocumentDirty;
    private saveNotebook;
    private triggerSave;
    private triggerLoad;
}
