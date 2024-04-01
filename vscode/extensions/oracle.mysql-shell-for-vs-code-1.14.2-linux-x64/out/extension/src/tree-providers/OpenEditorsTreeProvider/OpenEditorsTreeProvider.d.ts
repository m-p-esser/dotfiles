import { TreeDataProvider, TreeItem, ProviderResult, Event } from "vscode";
import { EntityType } from "../../../../frontend/src/modules/db-editor";
import { EditorLanguage } from "../../../../frontend/src/supplement";
import { IWebviewProvider } from "../../../../frontend/src/supplement/Requisitions";
import { DBType, IShellSessionDetails } from "../../../../frontend/src/supplement/ShellInterface";
import { EditorOverviewTreeItem } from "./EditorOverviewTreeItem";
import { EditorConnectionTreeItem } from "./EditorConnectionTreeItem";
import { EditorTreeItem } from "./EditorTreeItem";
import { ConnectionTreeItem } from "../ConnectionsTreeProvider/ConnectionTreeItem";
export interface IOpenEditorBaseEntry {
    type: string;
    caption: string;
    treeItem: TreeItem;
}
export interface IOpenEditorEntry extends IOpenEditorBaseEntry {
    type: "editor";
    id: string;
    language: EditorLanguage;
    editorType: EntityType;
    parent: IEditorConnectionEntry;
    treeItem: EditorTreeItem;
    alternativeCaption: string;
}
export interface IEditorConnectionOverviewEntry extends IOpenEditorBaseEntry {
    type: "connectionOverview";
    parent: IProviderEditorEntry | null;
    treeItem: EditorOverviewTreeItem;
}
export interface IEditorConnectionEntry extends IOpenEditorBaseEntry {
    type: "connection";
    connectionId: number;
    dbType: DBType;
    editors: IOpenEditorEntry[];
    parent: IProviderEditorEntry;
    treeItem: EditorConnectionTreeItem;
}
export interface IProviderEditorEntry extends IOpenEditorBaseEntry {
    type: "connectionProvider";
    provider: IWebviewProvider;
    connectionOverview?: IEditorConnectionOverviewEntry;
    connections: IEditorConnectionEntry[];
}
export interface IShellSessionEntry extends IOpenEditorBaseEntry {
    type: "shellSession";
    details: IShellSessionDetails;
    parent: IProviderSessionEntry;
}
export interface IProviderSessionEntry extends IOpenEditorBaseEntry {
    type: "sessionProvider";
    provider: IWebviewProvider;
    sessions: IShellSessionEntry[];
}
export declare class OpenEditorsTreeDataProvider implements TreeDataProvider<IOpenEditorBaseEntry> {
    #private;
    get onDidChangeTreeData(): Event<IOpenEditorBaseEntry | undefined>;
    set onSelect(callback: (item: IOpenEditorBaseEntry) => void);
    constructor();
    dispose(): void;
    clear(provider?: IWebviewProvider): boolean;
    isOpen(item: ConnectionTreeItem): boolean;
    currentConnectionId(provider: IWebviewProvider): number | null;
    createUniqueCaption: () => string;
    getTreeItem(element: IOpenEditorBaseEntry): TreeItem;
    getParent(element: IOpenEditorBaseEntry): ProviderResult<IOpenEditorBaseEntry>;
    getChildren(element?: IOpenEditorBaseEntry): ProviderResult<IOpenEditorBaseEntry[]>;
    private updateEditors;
    private createOverviewItems;
    private proxyRequest;
    private selectItem;
    private refreshSessions;
    private editorSaved;
    private updateEditorItemCaptions;
}
