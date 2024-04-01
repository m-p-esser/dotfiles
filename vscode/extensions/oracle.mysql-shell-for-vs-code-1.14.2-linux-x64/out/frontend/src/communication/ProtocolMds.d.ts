import { ICompartment, IComputeInstance, IMySQLDbSystemShapeSummary, IMySQLDbSystem, ILoadBalancer, IBastionSummary, IBastionSession, IComputeShape } from "./Oci";
import { IShellDictionary } from "./Protocol";
export declare enum ShellAPIMds {
    MdsGetRegions = "mds.get.regions",
    MdsListConfigProfiles = "mds.list.config_profiles",
    MdsSetDefaultConfigProfile = "mds.set.default_config_profile",
    MdsGetDefaultConfigProfile = "mds.get.default_config_profile",
    MdsSetCurrentCompartment = "mds.set.current_compartment",
    MdsGetCurrentCompartmentId = "mds.get.current_compartment_id",
    MdsSetCurrentBastion = "mds.set.current_bastion",
    MdsGetAvailabilityDomain = "mds.get.availability_domain",
    MdsListCompartments = "mds.list.compartments",
    MdsGetCompartment = "mds.get.compartment",
    MdsListComputeInstances = "mds.list.compute_instances",
    MdsGetComputeInstance = "mds.get.compute_instance",
    MdsListComputeShapes = "mds.list.compute_shapes",
    MdsDeleteComputeInstance = "mds.delete.compute_instance",
    MdsUtilHeatWaveLoadData = "mds.util.heat_wave_load_data",
    MdsUtilCreateEndpoint = "mds.util.create_endpoint",
    MdsGetDbSystemConfiguration = "mds.get.db_system_configuration",
    MdsListDbSystemShapes = "mds.list.db_system_shapes",
    MdsListDbSystems = "mds.list.db_systems",
    MdsGetDbSystem = "mds.get.db_system",
    MdsGetDbSystemId = "mds.get.db_system_id",
    MdsUpdateDbSystem = "mds.update.db_system",
    MdsCreateDbSystem = "mds.create.db_system",
    MdsDeleteDbSystem = "mds.delete.db_system",
    MdsStopDbSystem = "mds.stop.db_system",
    MdsStartDbSystem = "mds.start.db_system",
    MdsRestartDbSystem = "mds.restart.db_system",
    MdsStopHeatWaveCluster = "mds.stop.heat_wave_cluster",
    MdsStartHeatWaveCluster = "mds.start.heat_wave_cluster",
    MdsRestartHeatWaveCluster = "mds.restart.heat_wave_cluster",
    MdsCreateHeatWaveCluster = "mds.create.heat_wave_cluster",
    MdsUpdateHeatWaveCluster = "mds.update.heat_wave_cluster",
    MdsDeleteHeatWaveCluster = "mds.delete.heat_wave_cluster",
    MdsListLoadBalancers = "mds.list.load_balancers",
    MdsListBastions = "mds.list.bastions",
    MdsGetBastion = "mds.get.bastion",
    MdsCreateBastion = "mds.create.bastion",
    MdsDeleteBastion = "mds.delete.bastion",
    MdsListBastionSessions = "mds.list.bastion_sessions",
    MdsGetBastionSession = "mds.get.bastion_session",
    MdsCreateBastionSession = "mds.create.bastion_session",
    MdsDeleteBastionSession = "mds.delete.bastion_session"
}
export interface IShellMdsListConfigProfilesKwargs {
    configFilePath?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
}
export interface IShellMdsSetCurrentCompartmentKwargs {
    compartmentPath?: string;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    profileName?: string;
    cliRcFilePath?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsGetCurrentCompartmentIdKwargs {
    compartmentId?: string;
    config?: IShellDictionary;
    profileName?: string;
    cliRcFilePath?: string;
}
export interface IShellMdsSetCurrentBastionKwargs {
    bastionName?: string;
    bastionId?: string;
    compartmentId?: string;
    config?: object;
    configProfile?: string;
    profileName?: string;
    cliRcFilePath?: string;
    raiseExceptions?: boolean;
    interactive?: boolean;
}
export interface IShellMdsGetAvailabilityDomainKwargs {
    availabilityDomain?: string;
    randomSelection?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
    returnPythonObject?: boolean;
}
export interface IShellMdsListCompartmentsKwargs {
    compartmentId?: string;
    includeTenancy?: boolean;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
}
export interface IShellMdsGetCompartmentKwargs {
    parentCompartmentId?: string;
    config?: object;
    interactive?: boolean;
}
export interface IShellMdsListComputeInstancesKwargs {
    compartmentId?: string;
    config?: object;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
}
export interface IShellMdsGetComputeInstanceKwargs {
    instanceName?: string;
    instanceId?: string;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
    returnPythonObject?: boolean;
}
export interface IShellMdsListComputeShapesKwargs {
    limitShapesTo?: unknown[];
    availabilityDomain?: string;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
    returnPythonObject?: boolean;
}
export interface IShellMdsDeleteComputeInstanceKwargs {
    instanceName?: string;
    instanceId?: string;
    awaitDeletion?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    ignoreCurrent?: boolean;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsUtilHeatWaveLoadDataKwargs {
    schemas?: unknown[];
    mode?: string;
    output?: string;
    disableUnsupportedColumns?: boolean;
    optimizeLoadParallelism?: boolean;
    enableMemoryCheck?: boolean;
    sqlMode?: string;
    excludeList?: string;
    moduleSessionId?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsUtilCreateEndpointKwargs {
    instanceName?: string;
    dbSystemName?: string;
    dbSystemId?: string;
    privateKeyFilePath?: string;
    shape?: string;
    cpuCount?: number;
    memorySize?: number;
    mysqlUserName?: string;
    publicIp?: boolean;
    domainName?: string;
    portForwarding?: boolean;
    mrs?: boolean;
    sslCert?: boolean;
    jwtSecret?: string;
    compartmentId?: string;
    config?: object;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
}
export interface IShellMdsGetDbSystemConfigurationKwargs {
    configName?: string;
    configurationId?: string;
    shape?: string;
    availabilityDomain?: string;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
    returnPythonObject?: boolean;
}
export interface IShellMdsListDbSystemShapesKwargs {
    isSupportedFor?: string;
    availabilityDomain?: string;
    compartmentId?: string;
    config?: object;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
    returnPythonObject?: boolean;
}
export interface IShellMdsListDbSystemsKwargs {
    compartmentId?: string;
    config?: object;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
    returnPythonObject?: boolean;
}
export interface IShellMdsGetDbSystemKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
    returnFormatted?: boolean;
    returnPythonObject?: boolean;
}
export interface IShellMdsGetDbSystemIdKwargs {
    dbSystemName?: string;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: object;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsUpdateDbSystemKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    ignoreCurrent?: boolean;
    newName?: string;
    newDescription?: string;
    newFreeformTags?: string;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsCreateDbSystemKwargs {
    dbSystemName?: string;
    description?: string;
    availabilityDomain?: string;
    shape?: string;
    subnetId?: string;
    configurationId?: string;
    dataStorageSizeInGbs?: number;
    mysqlVersion?: string;
    adminUsername?: string;
    adminPassword?: string;
    privateKeyFilePath?: string;
    parUrl?: string;
    performCleanupAfterImport?: boolean;
    sourceMysqlUri?: string;
    sourceMysqlPassword?: string;
    sourceLocalDumpDir?: string;
    sourceBucket?: string;
    hostImageId?: string;
    definedTags?: IShellDictionary;
    freeformTags?: IShellDictionary;
    compartmentId?: string;
    config?: object;
    interactive?: boolean;
    returnObject?: boolean;
}
export interface IShellMdsDeleteDbSystemKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsStopDbSystemKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsStartDbSystemKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsRestartDbSystemKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsStopHeatWaveClusterKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsStartHeatWaveClusterKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsRestartHeatWaveClusterKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsCreateHeatWaveClusterKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    ignoreCurrent?: boolean;
    clusterSize?: number;
    shapeName?: string;
    awaitCompletion?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsUpdateHeatWaveClusterKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    ignoreCurrent?: boolean;
    clusterSize?: number;
    shapeName?: string;
    awaitCompletion?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsDeleteHeatWaveClusterKwargs {
    dbSystemName?: string;
    dbSystemId?: string;
    awaitCompletion?: boolean;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsListLoadBalancersKwargs {
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    returnType?: string;
    raiseExceptions?: boolean;
}
export interface IShellMdsListBastionsKwargs {
    compartmentId?: string;
    validForDbSystemId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    returnType?: string;
    raiseExceptions?: boolean;
}
export interface IShellMdsGetBastionKwargs {
    bastionName?: string;
    bastionId?: string;
    awaitState?: string;
    ignoreCurrent?: boolean;
    fallbackToAnyInCompartment?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    interactive?: boolean;
    returnType?: string;
    raiseExceptions?: boolean;
}
export interface IShellMdsCreateBastionKwargs {
    bastionName?: string;
    dbSystemId?: string;
    clientCidr?: string;
    maxSessionTtlInSeconds?: number;
    targetSubnetId?: string;
    awaitActiveState?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    ignoreCurrent?: boolean;
    interactive?: boolean;
    returnType?: string;
    raiseExceptions?: boolean;
}
export interface IShellMdsDeleteBastionKwargs {
    bastionName?: string;
    bastionId?: string;
    awaitDeletion?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    ignoreCurrent?: boolean;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IShellMdsListBastionSessionsKwargs {
    bastionId?: string;
    ignoreCurrent?: boolean;
    compartmentId?: string;
    config?: object;
    configProfile?: string;
    interactive?: boolean;
    returnType?: string;
    raiseExceptions?: boolean;
}
export interface IShellMdsGetBastionSessionKwargs {
    sessionName?: string;
    sessionId?: string;
    bastionId?: string;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    ignoreCurrent?: boolean;
    interactive?: boolean;
    returnType?: string;
    raiseExceptions?: boolean;
}
export interface IShellMdsCreateBastionSessionKwargs {
    bastionName?: string;
    bastionId?: string;
    fallbackToAnyInCompartment?: boolean;
    sessionType?: string;
    sessionName?: string;
    targetId?: string;
    targetIp?: string;
    targetPort?: string;
    targetUser?: string;
    ttlInSeconds?: number;
    publicKeyFile?: string;
    publicKeyContent?: string;
    awaitCreation?: boolean;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    ignoreCurrent?: boolean;
    interactive?: boolean;
    returnType?: string;
    raiseExceptions?: boolean;
}
export interface IShellMdsDeleteBastionSessionKwargs {
    sessionName?: string;
    sessionId?: string;
    bastionName?: string;
    bastionId?: string;
    compartmentId?: string;
    config?: IShellDictionary;
    configProfile?: string;
    ignoreCurrent?: boolean;
    interactive?: boolean;
    raiseExceptions?: boolean;
}
export interface IProtocolMdsParameters {
    [ShellAPIMds.MdsGetRegions]: {};
    [ShellAPIMds.MdsListConfigProfiles]: {
        kwargs?: IShellMdsListConfigProfilesKwargs;
    };
    [ShellAPIMds.MdsSetDefaultConfigProfile]: {
        args: {
            profileName?: string;
            configFilePath?: string;
            cliRcFilePath?: string;
        };
    };
    [ShellAPIMds.MdsGetDefaultConfigProfile]: {
        args: {
            cliRcFilePath?: string;
        };
    };
    [ShellAPIMds.MdsSetCurrentCompartment]: {
        kwargs?: IShellMdsSetCurrentCompartmentKwargs;
    };
    [ShellAPIMds.MdsGetCurrentCompartmentId]: {
        kwargs?: IShellMdsGetCurrentCompartmentIdKwargs;
    };
    [ShellAPIMds.MdsSetCurrentBastion]: {
        kwargs?: IShellMdsSetCurrentBastionKwargs;
    };
    [ShellAPIMds.MdsGetAvailabilityDomain]: {
        kwargs?: IShellMdsGetAvailabilityDomainKwargs;
    };
    [ShellAPIMds.MdsListCompartments]: {
        kwargs?: IShellMdsListCompartmentsKwargs;
    };
    [ShellAPIMds.MdsGetCompartment]: {
        args: {
            compartmentPath?: string;
        };
        kwargs?: IShellMdsGetCompartmentKwargs;
    };
    [ShellAPIMds.MdsListComputeInstances]: {
        kwargs?: IShellMdsListComputeInstancesKwargs;
    };
    [ShellAPIMds.MdsGetComputeInstance]: {
        kwargs?: IShellMdsGetComputeInstanceKwargs;
    };
    [ShellAPIMds.MdsListComputeShapes]: {
        kwargs?: IShellMdsListComputeShapesKwargs;
    };
    [ShellAPIMds.MdsDeleteComputeInstance]: {
        kwargs?: IShellMdsDeleteComputeInstanceKwargs;
    };
    [ShellAPIMds.MdsUtilHeatWaveLoadData]: {
        kwargs?: IShellMdsUtilHeatWaveLoadDataKwargs;
    };
    [ShellAPIMds.MdsUtilCreateEndpoint]: {
        kwargs?: IShellMdsUtilCreateEndpointKwargs;
    };
    [ShellAPIMds.MdsGetDbSystemConfiguration]: {
        kwargs?: IShellMdsGetDbSystemConfigurationKwargs;
    };
    [ShellAPIMds.MdsListDbSystemShapes]: {
        kwargs?: IShellMdsListDbSystemShapesKwargs;
    };
    [ShellAPIMds.MdsListDbSystems]: {
        kwargs?: IShellMdsListDbSystemsKwargs;
    };
    [ShellAPIMds.MdsGetDbSystem]: {
        kwargs?: IShellMdsGetDbSystemKwargs;
    };
    [ShellAPIMds.MdsGetDbSystemId]: {
        kwargs?: IShellMdsGetDbSystemIdKwargs;
    };
    [ShellAPIMds.MdsUpdateDbSystem]: {
        kwargs?: IShellMdsUpdateDbSystemKwargs;
    };
    [ShellAPIMds.MdsCreateDbSystem]: {
        kwargs?: IShellMdsCreateDbSystemKwargs;
    };
    [ShellAPIMds.MdsDeleteDbSystem]: {
        kwargs?: IShellMdsDeleteDbSystemKwargs;
    };
    [ShellAPIMds.MdsStopDbSystem]: {
        kwargs?: IShellMdsStopDbSystemKwargs;
    };
    [ShellAPIMds.MdsStartDbSystem]: {
        kwargs?: IShellMdsStartDbSystemKwargs;
    };
    [ShellAPIMds.MdsRestartDbSystem]: {
        kwargs?: IShellMdsRestartDbSystemKwargs;
    };
    [ShellAPIMds.MdsStopHeatWaveCluster]: {
        kwargs?: IShellMdsStopHeatWaveClusterKwargs;
    };
    [ShellAPIMds.MdsStartHeatWaveCluster]: {
        kwargs?: IShellMdsStartHeatWaveClusterKwargs;
    };
    [ShellAPIMds.MdsRestartHeatWaveCluster]: {
        kwargs?: IShellMdsRestartHeatWaveClusterKwargs;
    };
    [ShellAPIMds.MdsCreateHeatWaveCluster]: {
        kwargs?: IShellMdsCreateHeatWaveClusterKwargs;
    };
    [ShellAPIMds.MdsUpdateHeatWaveCluster]: {
        kwargs?: IShellMdsUpdateHeatWaveClusterKwargs;
    };
    [ShellAPIMds.MdsDeleteHeatWaveCluster]: {
        kwargs?: IShellMdsDeleteHeatWaveClusterKwargs;
    };
    [ShellAPIMds.MdsListLoadBalancers]: {
        kwargs?: IShellMdsListLoadBalancersKwargs;
    };
    [ShellAPIMds.MdsListBastions]: {
        kwargs?: IShellMdsListBastionsKwargs;
    };
    [ShellAPIMds.MdsGetBastion]: {
        kwargs?: IShellMdsGetBastionKwargs;
    };
    [ShellAPIMds.MdsCreateBastion]: {
        kwargs?: IShellMdsCreateBastionKwargs;
    };
    [ShellAPIMds.MdsDeleteBastion]: {
        kwargs?: IShellMdsDeleteBastionKwargs;
    };
    [ShellAPIMds.MdsListBastionSessions]: {
        kwargs?: IShellMdsListBastionSessionsKwargs;
    };
    [ShellAPIMds.MdsGetBastionSession]: {
        kwargs?: IShellMdsGetBastionSessionKwargs;
    };
    [ShellAPIMds.MdsCreateBastionSession]: {
        kwargs?: IShellMdsCreateBastionSessionKwargs;
    };
    [ShellAPIMds.MdsDeleteBastionSession]: {
        kwargs?: IShellMdsDeleteBastionSessionKwargs;
    };
}
export interface IMdsProfileData {
    fingerprint: string;
    keyFile: string;
    profile: string;
    region: string;
    tenancy: string;
    user: string;
    isCurrent: boolean;
}
export interface IProtocolMdsResults {
    [ShellAPIMds.MdsGetRegions]: {};
    [ShellAPIMds.MdsListConfigProfiles]: {
        result: IMdsProfileData[];
    };
    [ShellAPIMds.MdsSetDefaultConfigProfile]: {};
    [ShellAPIMds.MdsGetDefaultConfigProfile]: {};
    [ShellAPIMds.MdsSetCurrentCompartment]: {};
    [ShellAPIMds.MdsGetCurrentCompartmentId]: {};
    [ShellAPIMds.MdsSetCurrentBastion]: {};
    [ShellAPIMds.MdsGetAvailabilityDomain]: {};
    [ShellAPIMds.MdsListCompartments]: {
        result: ICompartment[];
    };
    [ShellAPIMds.MdsGetCompartment]: {};
    [ShellAPIMds.MdsListComputeInstances]: {
        result: IComputeInstance[];
    };
    [ShellAPIMds.MdsGetComputeInstance]: {};
    [ShellAPIMds.MdsListComputeShapes]: {
        result: IComputeShape[];
    };
    [ShellAPIMds.MdsDeleteComputeInstance]: {};
    [ShellAPIMds.MdsUtilHeatWaveLoadData]: {};
    [ShellAPIMds.MdsUtilCreateEndpoint]: {};
    [ShellAPIMds.MdsGetDbSystemConfiguration]: {};
    [ShellAPIMds.MdsListDbSystemShapes]: {
        result: IMySQLDbSystemShapeSummary[];
    };
    [ShellAPIMds.MdsListDbSystems]: {
        result: IMySQLDbSystem[];
    };
    [ShellAPIMds.MdsGetDbSystem]: {
        result: IMySQLDbSystem;
    };
    [ShellAPIMds.MdsGetDbSystemId]: {};
    [ShellAPIMds.MdsUpdateDbSystem]: {};
    [ShellAPIMds.MdsCreateDbSystem]: {};
    [ShellAPIMds.MdsDeleteDbSystem]: {};
    [ShellAPIMds.MdsStopDbSystem]: {};
    [ShellAPIMds.MdsStartDbSystem]: {};
    [ShellAPIMds.MdsRestartDbSystem]: {};
    [ShellAPIMds.MdsStopHeatWaveCluster]: {};
    [ShellAPIMds.MdsStartHeatWaveCluster]: {};
    [ShellAPIMds.MdsRestartHeatWaveCluster]: {};
    [ShellAPIMds.MdsCreateHeatWaveCluster]: {};
    [ShellAPIMds.MdsUpdateHeatWaveCluster]: {};
    [ShellAPIMds.MdsDeleteHeatWaveCluster]: {};
    [ShellAPIMds.MdsListLoadBalancers]: {
        result: ILoadBalancer[];
    };
    [ShellAPIMds.MdsListBastions]: {
        result: IBastionSummary[];
    };
    [ShellAPIMds.MdsGetBastion]: {
        result: IBastionSummary;
    };
    [ShellAPIMds.MdsCreateBastion]: {
        result: IBastionSummary;
    };
    [ShellAPIMds.MdsDeleteBastion]: {};
    [ShellAPIMds.MdsListBastionSessions]: {};
    [ShellAPIMds.MdsGetBastionSession]: {};
    [ShellAPIMds.MdsCreateBastionSession]: {
        result: IBastionSession;
    };
    [ShellAPIMds.MdsDeleteBastionSession]: {};
}
