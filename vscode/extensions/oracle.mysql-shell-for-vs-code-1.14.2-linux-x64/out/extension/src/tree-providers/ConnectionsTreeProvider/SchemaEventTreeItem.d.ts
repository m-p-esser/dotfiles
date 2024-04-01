import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
export declare class SchemaEventTreeItem extends ConnectionsTreeBaseItem {
    contextValue: string;
    constructor(name: string, schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, hasChildren: boolean);
    get qualifiedName(): string;
    get dbType(): string;
}
