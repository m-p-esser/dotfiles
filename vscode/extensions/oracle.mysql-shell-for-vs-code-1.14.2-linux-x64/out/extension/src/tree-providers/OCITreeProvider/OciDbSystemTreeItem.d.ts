import { TreeItemCollapsibleState } from "vscode";
import { ICompartment, IMySQLDbSystem } from "../../../../frontend/src/communication";
import { IMdsProfileData } from "../../../../frontend/src/communication/ProtocolMds";
import { OciBaseTreeItem } from "./OciBaseTreeItem";
export declare class OciDbSystemTreeItem extends OciBaseTreeItem {
    compartment: ICompartment;
    dbSystem: IMySQLDbSystem;
    contextValue: string;
    constructor(profile: IMdsProfileData, compartment: ICompartment, dbSystem: IMySQLDbSystem, treeState: TreeItemCollapsibleState);
}
