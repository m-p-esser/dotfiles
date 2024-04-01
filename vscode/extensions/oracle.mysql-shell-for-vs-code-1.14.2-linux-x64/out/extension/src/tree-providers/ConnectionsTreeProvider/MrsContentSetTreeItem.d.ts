import { IMrsContentSetData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsContentSetTreeItem extends MrsTreeBaseItem {
    value: IMrsContentSetData;
    contextValue: string;
    constructor(label: string, value: IMrsContentSetData, backend: ShellInterfaceSqlEditor, connectionId: number);
}
