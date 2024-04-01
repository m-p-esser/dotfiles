import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
import { IConnectionEntry } from "./ConnectionsTreeProvider";
export declare class SchemaListTreeItem extends ConnectionsTreeBaseItem {
    name: string;
    entry: IConnectionEntry;
    contextValue: string;
    constructor(name: string, entry: IConnectionEntry, hasChildren: boolean);
}
