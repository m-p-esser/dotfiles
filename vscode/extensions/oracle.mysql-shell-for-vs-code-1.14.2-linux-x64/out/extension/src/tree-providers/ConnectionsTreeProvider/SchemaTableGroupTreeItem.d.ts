import { SchemaItemGroupType } from "./SchemaIndex";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
export declare class TableGroupTreeItem extends ConnectionsTreeBaseItem {
    table: string;
    groupType: SchemaItemGroupType;
    contextValue: string;
    constructor(schema: string, table: string, backend: ShellInterfaceSqlEditor, connectionId: number, groupType: SchemaItemGroupType);
    private static getIconName;
}
