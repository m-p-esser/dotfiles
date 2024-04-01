import { IMrsDbObjectData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsDbObjectTreeItem extends MrsTreeBaseItem {
    value: IMrsDbObjectData;
    contextValue: string;
    constructor(label: string, value: IMrsDbObjectData, backend: ShellInterfaceSqlEditor, connectionId: number);
    private static getIconName;
}
