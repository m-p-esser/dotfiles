import { TreeItemCollapsibleState } from "vscode";
import { ICompartment } from "../../../../frontend/src/communication";
import { IMdsProfileData } from "../../../../frontend/src/communication/ProtocolMds";
import { OciBaseTreeItem } from "./OciBaseTreeItem";
export declare class OciCompartmentTreeItem extends OciBaseTreeItem {
    compartment: ICompartment;
    contextValue: string;
    constructor(profile: IMdsProfileData, compartment: ICompartment, collapsibleState?: TreeItemCollapsibleState);
}
