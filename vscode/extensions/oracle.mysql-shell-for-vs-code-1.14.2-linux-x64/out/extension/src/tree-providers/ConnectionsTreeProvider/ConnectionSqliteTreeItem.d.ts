import { IConnectionDetails } from "../../../../frontend/src/supplement/ShellInterface";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { ConnectionTreeItem } from "./ConnectionTreeItem";
export declare class ConnectionSqliteTreeItem extends ConnectionTreeItem {
    contextValue: string;
    constructor(details: IConnectionDetails, backend: ShellInterfaceSqlEditor);
}
