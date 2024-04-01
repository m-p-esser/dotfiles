import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
export declare class SchemaTreeItem extends ConnectionsTreeBaseItem {
    contextValue: string;
    get qualifiedName(): string;
    get dbType(): string;
}
