import { Command } from "vscode";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { SchemaTreeItem } from "./SchemaTreeItem";
export declare class SchemaMySQLTreeItem extends SchemaTreeItem {
    contextValue: string;
    constructor(name: string, schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, isCurrent: boolean, hasChildren: boolean, command?: Command);
}
