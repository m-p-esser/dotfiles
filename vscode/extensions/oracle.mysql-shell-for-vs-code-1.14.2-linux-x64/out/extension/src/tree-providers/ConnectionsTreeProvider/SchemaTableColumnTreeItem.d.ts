import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
export declare class SchemaTableColumnTreeItem extends ConnectionsTreeBaseItem {
    table: string;
    contextValue: string;
    constructor(name: string, schema: string, table: string, backend: ShellInterfaceSqlEditor, connectionId: number);
    get qualifiedName(): string;
    get dbType(): string;
}
