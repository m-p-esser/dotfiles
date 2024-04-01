import { ILoadBalancer, ICompartment } from "../../../../frontend/src/communication";
import { IMdsProfileData } from "../../../../frontend/src/communication/ProtocolMds";
import { OciBaseTreeItem } from "./OciBaseTreeItem";
export declare class OciLoadBalancerTreeItem extends OciBaseTreeItem {
    compartment: ICompartment;
    loadBalancer: ILoadBalancer;
    contextValue: string;
    constructor(profile: IMdsProfileData, compartment: ICompartment, loadBalancer: ILoadBalancer);
}
