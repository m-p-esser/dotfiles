import { Command, TreeItem } from "vscode";
export declare class ShellConsoleSessionTreeItem extends TreeItem {
    contextValue: string;
    constructor(caption: string, command?: Command);
}
