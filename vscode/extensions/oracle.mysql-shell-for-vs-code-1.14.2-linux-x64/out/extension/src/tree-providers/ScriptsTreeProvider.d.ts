import { TreeDataProvider, TreeItem, ProviderResult, Event } from "vscode";
export declare class ScriptsTreeDataProvider implements TreeDataProvider<TreeItem> {
    private scriptTypeId;
    private changeEvent;
    private tree;
    constructor(scriptTypeId: number);
    get onDidChangeTreeData(): Event<void>;
    refresh(): void;
    getTreeItem(element: TreeItem): TreeItem;
    getChildren(element?: TreeItem): ProviderResult<TreeItem[]>;
}
