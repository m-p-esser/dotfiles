import { IMrsServiceData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsServiceTreeItem extends MrsTreeBaseItem {
    value: IMrsServiceData;
    contextValue: string;
    constructor(label: string, value: IMrsServiceData, backend: ShellInterfaceSqlEditor, connectionId: number);
}
