import { Command, TreeItem } from "vscode";
import { IDBDataEntry } from "../../../frontend/src/modules/db-editor";
export declare class ScriptTreeItem extends TreeItem {
    entry: IDBDataEntry;
    contextValue: string;
    constructor(entry: IDBDataEntry, command?: Command);
}
