import { ICompartment, IComputeInstance } from "../../../../frontend/src/communication";
import { IMdsProfileData } from "../../../../frontend/src/communication/ProtocolMds";
import { ShellInterfaceShellSession } from "../../../../frontend/src/supplement/ShellInterface/ShellInterfaceShellSession";
import { OciBaseTreeItem } from "./OciBaseTreeItem";
export declare class OciComputeInstanceTreeItem extends OciBaseTreeItem {
    compartment: ICompartment;
    compute: IComputeInstance;
    shellSession: ShellInterfaceShellSession;
    contextValue: string;
    constructor(profile: IMdsProfileData, compartment: ICompartment, compute: IComputeInstance, shellSession: ShellInterfaceShellSession);
    protected get iconName(): string;
}
