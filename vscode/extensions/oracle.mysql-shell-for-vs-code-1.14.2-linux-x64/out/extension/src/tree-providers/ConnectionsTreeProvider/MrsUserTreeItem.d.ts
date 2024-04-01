import { IMrsUserData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsUserTreeItem extends MrsTreeBaseItem {
    value: IMrsUserData;
    contextValue: string;
    constructor(label: string, value: IMrsUserData, backend: ShellInterfaceSqlEditor, connectionId: number);
}
