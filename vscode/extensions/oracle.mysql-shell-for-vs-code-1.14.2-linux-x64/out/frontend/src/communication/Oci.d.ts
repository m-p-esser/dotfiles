import { models as coreModels } from "../oci-typings/oci-core";
import * as common from "../oci-typings/oci-common/index";
import { models as bastionModels } from "../oci-typings/oci-bastion";
import { models as mySQLModels } from "../oci-typings/oci-mysql";
import { models as identityModels } from "../oci-typings/oci-identity";
import { models as loadBalancerModels } from "../oci-typings/oci-loadbalancer";
export declare type IAuthenticationDetails = common.AuthenticationDetailsProvider;
export declare type IComputeInstance = coreModels.Instance;
export declare type ICompartment = identityModels.Compartment & {
    isCurrent: boolean;
};
export declare type IComputeShape = coreModels.Shape;
export declare type IBastionSession = bastionModels.Session;
export declare type IBastionSummary = bastionModels.BastionSummary & {
    isCurrent: boolean;
    sessions: bastionModels.SessionSummary;
};
export declare type IBastion = bastionModels.Bastion;
export declare type IMySQLDbSystem = mySQLModels.DbSystem & {
    isSupportedForHwCluster?: boolean;
    isSupportedForAnalyticsCluster?: boolean;
};
export declare type IMySQLDbSystemShapeSummary = mySQLModels.ShapeSummary;
export declare type ILoadBalancer = loadBalancerModels.LoadBalancer;
export declare type IPortForwardingSessionTargetResourceDetails = bastionModels.PortForwardingSessionTargetResourceDetails;
