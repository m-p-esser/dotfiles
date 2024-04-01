import { IBastionSession, IBastionSummary, ICompartment, IComputeInstance, ILoadBalancer, IMySQLDbSystem, IMySQLDbSystemShapeSummary, IComputeShape } from "../../communication";
import { DataCallback } from "../../communication/MessageScheduler";
import { IMdsProfileData, ShellAPIMds, IShellMdsSetCurrentCompartmentKwargs, IShellMdsSetCurrentBastionKwargs } from "../../communication/ProtocolMds";
export declare class ShellInterfaceMds {
    getMdsConfigProfiles(configFilePath?: string): Promise<IMdsProfileData[]>;
    setDefaultConfigProfile(profile: string): Promise<void>;
    getMdsCompartments(configProfile: string, compartmentId?: string): Promise<ICompartment[]>;
    getMdsMySQLDbSystems(configProfile: string, compartmentId: string): Promise<IMySQLDbSystem[]>;
    getMdsMySQLDbSystem(configProfile: string, dbSystemId: string): Promise<IMySQLDbSystem>;
    getMdsComputeInstances(configProfile: string, compartmentId: string): Promise<IComputeInstance[]>;
    getMdsBastions(configProfile: string, compartmentId: string, validForDbSystemId?: string): Promise<IBastionSummary[]>;
    getMdsBastion(configProfile: string, bastionId: string): Promise<IBastionSummary>;
    createBastion(configProfile: string, dbSystemId: string, awaitActiveState?: boolean): Promise<IBastionSummary>;
    createBastionSession(configProfile: string, targetId: string, sessionType: string, compartmentId: string, awaitCreation: boolean, callback: DataCallback<ShellAPIMds.MdsCreateBastionSession>): Promise<IBastionSession>;
    listLoadBalancers(configProfile: string, compartmentId: string): Promise<ILoadBalancer[]>;
    setCurrentCompartment(parameters?: IShellMdsSetCurrentCompartmentKwargs): Promise<void>;
    setCurrentBastion(parameters?: IShellMdsSetCurrentBastionKwargs): Promise<void>;
    listDbSystemShapes(isSupportedFor: string, configProfile: string, compartmentId: string): Promise<IMySQLDbSystemShapeSummary[]>;
    listComputeShapes(configProfile: string, compartmentId: string): Promise<IComputeShape[]>;
}
