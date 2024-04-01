import { Command } from "vscode";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
export declare class MrsTreeItem extends ConnectionsTreeBaseItem {
    contextValue: string;
    constructor(name: string, schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, hasChildren: boolean, enabled: boolean, command?: Command);
}
