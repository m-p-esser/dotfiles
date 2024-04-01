import { IMrsAuthAppData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsAuthAppTreeItem extends MrsTreeBaseItem {
    value: IMrsAuthAppData;
    contextValue: string;
    constructor(label: string, value: IMrsAuthAppData, backend: ShellInterfaceSqlEditor, connectionId: number);
}
