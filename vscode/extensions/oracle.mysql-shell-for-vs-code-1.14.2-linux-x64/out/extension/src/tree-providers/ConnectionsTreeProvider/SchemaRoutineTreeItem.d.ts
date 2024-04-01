import { Command } from "vscode";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
export declare class SchemaRoutineTreeItem extends ConnectionsTreeBaseItem {
    private type;
    contextValue: string;
    constructor(name: string, schema: string, type: "function" | "procedure", backend: ShellInterfaceSqlEditor, connectionId: number, hasChildren: boolean, command?: Command);
    get qualifiedName(): string;
    get dbType(): "function" | "procedure";
    protected get createScriptResultIndex(): number;
}
