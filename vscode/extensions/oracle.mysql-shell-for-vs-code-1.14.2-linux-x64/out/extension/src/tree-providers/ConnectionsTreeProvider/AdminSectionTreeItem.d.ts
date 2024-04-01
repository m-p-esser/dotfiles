import { Command } from "vscode";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
export declare class AdminSectionTreeItem extends ConnectionsTreeBaseItem {
    contextValue: string;
    constructor(name: string, backend: ShellInterfaceSqlEditor, connectionId: number, iconName: string, hasChildren: boolean, command?: Command);
}
