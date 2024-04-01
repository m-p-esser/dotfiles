import { Command, TreeItem } from "vscode";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
export declare class ConnectionsTreeBaseItem extends TreeItem {
    name: string;
    schema: string;
    backend: ShellInterfaceSqlEditor;
    connectionId: number;
    constructor(name: string, schema: string, backend: ShellInterfaceSqlEditor, connectionId: number, iconName: string, hasChildren: boolean, command?: Command);
    copyNameToClipboard(): void;
    copyCreateScriptToClipboard(withDelimiter?: boolean, withDrop?: boolean): void;
    dropItem(): void;
    get qualifiedName(): string;
    get dbType(): string;
    protected get createScriptResultIndex(): number;
}
