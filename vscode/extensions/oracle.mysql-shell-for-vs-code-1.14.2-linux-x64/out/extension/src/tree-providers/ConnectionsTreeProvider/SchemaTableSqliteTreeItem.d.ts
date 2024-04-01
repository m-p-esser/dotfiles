import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { SchemaTableTreeItem } from "./SchemaTableTreeItem";
export declare class SchemaTableSqliteTreeItem extends SchemaTableTreeItem {
    contextValue: string;
    constructor(name: string, schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, hasChildren: boolean);
}
