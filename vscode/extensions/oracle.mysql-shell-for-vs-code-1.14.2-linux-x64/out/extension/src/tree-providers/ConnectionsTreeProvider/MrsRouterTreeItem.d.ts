import { IMrsRouterData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsRouterTreeItem extends MrsTreeBaseItem {
    value: IMrsRouterData;
    contextValue: string;
    constructor(label: string, value: IMrsRouterData, backend: ShellInterfaceSqlEditor, connectionId: number, requiresUpgrade: boolean);
    private static getIconName;
}
