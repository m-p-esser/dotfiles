import { TreeItem } from "vscode";
import { IConnectionDetails } from "../../../../frontend/src/supplement/ShellInterface";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
export declare class ConnectionTreeItem extends TreeItem {
    details: IConnectionDetails;
    backend: ShellInterfaceSqlEditor;
    contextValue: string;
    constructor(details: IConnectionDetails, backend: ShellInterfaceSqlEditor);
}
