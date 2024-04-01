import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { SchemaViewTreeItem } from "./SchemaViewTreeItem";
export declare class SchemaViewMySQLTreeItem extends SchemaViewTreeItem {
    contextValue: string;
    constructor(name: string, schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, hasChildren: boolean);
}
