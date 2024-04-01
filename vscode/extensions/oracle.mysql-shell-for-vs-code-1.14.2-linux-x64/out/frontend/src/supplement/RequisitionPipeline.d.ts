import { IRequestListEntry, IRequestTypeMap, RequisitionHub } from "./Requisitions";
export declare class RequisitionPipeline {
    private hub;
    private static readonly offeringTime;
    private static readonly announceInterval;
    private pendingRequests;
    private announceTimer?;
    private watchDog?;
    private announcePromise?;
    private nextJobId;
    constructor(hub: RequisitionHub);
    addJob: (job: Array<IRequestListEntry<keyof IRequestTypeMap>>) => Promise<boolean>;
    private announceRequest;
    private removeTopRequest;
    private cancelCurrentJob;
}
