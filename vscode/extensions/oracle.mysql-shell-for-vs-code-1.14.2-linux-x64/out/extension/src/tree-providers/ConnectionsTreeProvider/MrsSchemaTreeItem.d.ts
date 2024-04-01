import { IMrsSchemaData } from "../../../../frontend/src/communication/ProtocolMrs";
import { ShellInterfaceSqlEditor } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
import { MrsTreeBaseItem } from "./MrsTreeBaseItem";
export declare class MrsSchemaTreeItem extends MrsTreeBaseItem {
    value: IMrsSchemaData;
    contextValue: string;
    constructor(label: string, value: IMrsSchemaData, backend: ShellInterfaceSqlEditor, connectionId: number);
}
