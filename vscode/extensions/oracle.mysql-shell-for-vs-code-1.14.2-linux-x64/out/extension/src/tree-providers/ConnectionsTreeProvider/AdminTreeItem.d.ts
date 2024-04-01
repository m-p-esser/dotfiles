import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { ConnectionsTreeBaseItem } from "./ConnectionsTreeBaseItem";
export declare class AdminTreeItem extends ConnectionsTreeBaseItem {
    contextValue: string;
    constructor(name: string, backend: ShellInterfaceSqlEditor, connectionId: number, hasChildren: boolean);
}
