import { ICompartment, IMySQLDbSystem } from "../../../../frontend/src/communication";
import { IMdsProfileData } from "../../../../frontend/src/communication/ProtocolMds";
import { OciDbSystemTreeItem } from "./OciDbSystemTreeItem";
export declare class OciDbSystemHWTreeItem extends OciDbSystemTreeItem {
    compartment: ICompartment;
    dbSystem: IMySQLDbSystem;
    contextValue: string;
    constructor(profile: IMdsProfileData, compartment: ICompartment, dbSystem: IMySQLDbSystem);
}
