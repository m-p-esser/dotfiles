import { TreeItem } from "vscode";
import { DBType } from "../../../../frontend/src/supplement/ShellInterface";
export declare class EditorConnectionTreeItem extends TreeItem {
    readonly entry: {
        details: {
            caption: string;
            id: number;
            dbType: DBType;
        };
    };
    constructor(caption: string, dbType: DBType, connectionId: number);
}
