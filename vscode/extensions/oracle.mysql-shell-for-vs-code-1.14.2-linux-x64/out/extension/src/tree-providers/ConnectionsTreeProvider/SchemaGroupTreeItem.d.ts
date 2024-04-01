import { SchemaItemGroupType } from "./SchemaIndex";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
export declare class SchemaGroupTreeItem extends ConnectionsTreeBaseItem {
    groupType: SchemaItemGroupType;
    contextValue: string;
    constructor(schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, groupType: SchemaItemGroupType);
    private static getIonName;
}
