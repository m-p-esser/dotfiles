import { TreeDataProvider, TreeItem, ProviderResult, Event } from "vscode";
import { ShellTask } from "../../../../frontend/src/shell-tasks/ShellTask";
export declare class ShellTasksTreeDataProvider implements TreeDataProvider<TreeItem> {
    private tasks;
    private changeEvent;
    constructor(tasks: ShellTask[]);
    get onDidChangeTreeData(): Event<TreeItem | undefined>;
    dispose(): void;
    refresh(item?: TreeItem): void;
    getTreeItem(element: TreeItem): TreeItem;
    getChildren(element?: TreeItem): ProviderResult<TreeItem[]>;
    private statusCallback;
}
