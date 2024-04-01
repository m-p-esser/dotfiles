import { IMrsContentFileData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsContentFileTreeItem extends MrsTreeBaseItem {
    value: IMrsContentFileData;
    contextValue: string;
    constructor(label: string, value: IMrsContentFileData, backend: ShellInterfaceSqlEditor, connectionId: number);
}
