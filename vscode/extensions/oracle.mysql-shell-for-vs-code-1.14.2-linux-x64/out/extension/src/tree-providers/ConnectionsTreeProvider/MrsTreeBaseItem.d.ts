import { TreeItem } from "vscode";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
export declare class MrsTreeBaseItem extends TreeItem {
    backend: ShellInterfaceSqlEditor;
    connectionId: number;
    constructor(label: string, backend: ShellInterfaceSqlEditor, connectionId: number, iconName: string, hasChildren: boolean);
}
