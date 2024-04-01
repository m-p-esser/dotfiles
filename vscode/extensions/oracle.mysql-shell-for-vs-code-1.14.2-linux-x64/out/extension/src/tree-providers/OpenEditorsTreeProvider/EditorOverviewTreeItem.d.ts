import { Command, TreeItem } from "vscode";
export declare class EditorOverviewTreeItem extends TreeItem {
    contextValue: string;
    constructor(caption: string, tooltip: string, command: Command);
}
