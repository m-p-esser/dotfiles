import { Command } from "vscode";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { SchemaTreeItem } from "./SchemaTreeItem";
export declare class SchemaSqliteTreeItem extends SchemaTreeItem {
    contextValue: string;
    constructor(name: string, schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, isCurrent: boolean, hasChildren: boolean, command?: Command);
    get qualifiedName(): string;
    get dbType(): string;
}
