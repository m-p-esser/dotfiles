"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OciTreeDataProvider = void 0;
const vscode_1 = require("vscode");
const Requisitions_1 = require("../../../../frontend/src/supplement/Requisitions");
const _1 = require(".");
const OciDbSystemHWTreeItem_1 = require("./OciDbSystemHWTreeItem");
const OciDbSystemStandaloneTreeItem_1 = require("./OciDbSystemStandaloneTreeItem");
const OciHWClusterTreeItem_1 = require("./OciHWClusterTreeItem");
const MessageScheduler_1 = require("../../../../frontend/src/communication/MessageScheduler");
const ShellInterfaceShellSession_1 = require("../../../../frontend/src/supplement/ShellInterface/ShellInterfaceShellSession");
class OciTreeDataProvider {
    changeEvent = new vscode_1.EventEmitter();
    shellSession = new ShellInterfaceShellSession_1.ShellInterfaceShellSession();
    compartmentCache = {};
    constructor() {
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
    }
    dispose() {
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
    }
    get onDidChangeTreeData() {
        return this.changeEvent.event;
    }
    refresh(item) {
        this.compartmentCache = {};
        void this.listConfigProfiles().then(() => {
            this.changeEvent.fire(item);
        });
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (MessageScheduler_1.MessageScheduler.get.isConnected) {
            if (!element) {
                return this.listConfigProfiles();
            }
            if (element instanceof _1.OciConfigProfileTreeItem) {
                return this.listCompartments(element.profile, true, element.profile.tenancy);
            }
            if (element instanceof _1.OciCompartmentTreeItem) {
                return new Promise((resolve, reject) => {
                    Promise.all([
                        this.listCompartments(element.profile, false, element.compartment.id),
                        this.listDatabases(element.profile, element.compartment),
                        this.listComputeInstances(element.profile, element.compartment),
                        this.listBastionHosts(element.profile, element.compartment),
                        this.listLoadBalancers(element.profile, element.compartment),
                    ]).then(([compartmentItems, databaseItems, computeInstanceItems, bastionHostItems, loadBalancerItems]) => {
                        resolve([
                            ...compartmentItems, ...databaseItems, ...computeInstanceItems,
                            ...bastionHostItems, ...loadBalancerItems,
                        ]);
                    }).catch((reason) => {
                        reject(reason);
                    });
                });
            }
            if (element instanceof OciDbSystemHWTreeItem_1.OciDbSystemHWTreeItem) {
                if (element.dbSystem.heatWaveCluster
                    && element.dbSystem.heatWaveCluster.lifecycleState !== "DELETED") {
                    return [new OciHWClusterTreeItem_1.OciHWClusterTreeItem(element.profile, element.compartment, element.dbSystem)];
                }
                else {
                    return [];
                }
            }
        }
    }
    async listConfigProfiles() {
        const profiles = await this.shellSession.mds.getMdsConfigProfiles();
        return profiles.map((profile) => {
            return new _1.OciConfigProfileTreeItem(profile);
        });
    }
    addOciCompartmentTreeItem(items, profile, compartment, startWithCurrent, parentId) {
        if (startWithCurrent && compartment.isCurrent) {
            items.unshift(new _1.OciCompartmentTreeItem(profile, compartment));
        }
        else if ((startWithCurrent && compartment.id === parentId) ||
            (!startWithCurrent && parentId && compartment.compartmentId === parentId) ||
            (!startWithCurrent && !parentId)) {
            items.push(new _1.OciCompartmentTreeItem(profile, compartment));
        }
    }
    async listCompartments(profile, startWithCurrent, compartmentId) {
        const items = [];
        if (this.compartmentCache[profile.profile]) {
            this.compartmentCache[profile.profile].forEach((subCompartment) => {
                this.addOciCompartmentTreeItem(items, profile, subCompartment, startWithCurrent, compartmentId);
            });
            return items;
        }
        try {
            const compartments = await this.shellSession.mds.getMdsCompartments(profile.profile);
            this.compartmentCache[profile.profile] = compartments;
            this.compartmentCache[profile.profile].forEach((subCompartment) => {
                this.addOciCompartmentTreeItem(items, profile, subCompartment, startWithCurrent, compartmentId);
            });
        }
        catch (reason) {
            const msg = reason?.data?.requestState?.msg;
            if (msg && msg.includes("NotAuthorizedOrNotFound")) {
                vscode_1.window.setStatusBarMessage("Not authorized to list the sub-compartment of this compartment.", 5000);
            }
        }
        return items;
    }
    async listDatabases(profile, compartment) {
        const items = [];
        try {
            const systems = await this.shellSession.mds.getMdsMySQLDbSystems(profile.profile, compartment.id);
            systems.forEach((dbSystem) => {
                if (dbSystem.isSupportedForHwCluster || dbSystem.isSupportedForAnalyticsCluster) {
                    items.push(new OciDbSystemHWTreeItem_1.OciDbSystemHWTreeItem(profile, compartment, dbSystem));
                }
                else {
                    items.push(new OciDbSystemStandaloneTreeItem_1.OciDbSystemStandaloneTreeItem(profile, compartment, dbSystem));
                }
            });
        }
        catch (reason) {
            const msg = reason?.data?.requestState?.msg;
            if (msg && msg.includes("NotAuthorizedOrNotFound")) {
                vscode_1.window.setStatusBarMessage("Not authorized to list the MySQL DB Systems in this compartment.", 5000);
            }
        }
        return items;
    }
    async listComputeInstances(profile, compartment) {
        const items = [];
        try {
            const instances = await this.shellSession.mds.getMdsComputeInstances(profile.profile, compartment.id);
            instances.forEach((compute) => {
                items.push(new _1.OciComputeInstanceTreeItem(profile, compartment, compute, this.shellSession));
            });
        }
        catch (reason) {
            const msg = reason?.data?.requestState?.msg;
            if (msg && msg.includes("NotAuthorizedOrNotFound")) {
                vscode_1.window.setStatusBarMessage("Not authorized to list the compute instances in this compartment.", 5000);
            }
        }
        return items;
    }
    async listBastionHosts(profile, compartment) {
        const items = [];
        try {
            const bastions = await this.shellSession.mds.getMdsBastions(profile.profile, compartment.id);
            bastions.forEach((bastion) => {
                items.push(new _1.OciBastionTreeItem(profile, compartment, bastion));
            });
        }
        catch (reason) {
            const msg = reason?.data?.requestState?.msg;
            if (msg && msg.includes("NotAuthorizedOrNotFound")) {
                vscode_1.window.setStatusBarMessage("Not authorized to list the bastions in this compartment.", 5000);
            }
        }
        return items;
    }
    async listLoadBalancers(profile, compartment) {
        const items = [];
        try {
            const loadBalancers = await this.shellSession.mds.listLoadBalancers(profile.profile, compartment.id);
            loadBalancers.forEach((loadBalancer) => {
                items.push(new _1.OciLoadBalancerTreeItem(profile, compartment, loadBalancer));
            });
        }
        catch (reason) {
            const msg = reason?.data?.requestState?.msg;
            if (msg && msg.includes("NotAuthorizedOrNotFound")) {
                vscode_1.window.setStatusBarMessage("Not authorized to list the load balancers in this compartment.", 5000);
            }
        }
        return items;
    }
    proxyRequest = (request) => {
        switch (request.original.requestType) {
            case "refreshOciTree": {
                this.refresh();
                return Promise.resolve(true);
            }
            default:
        }
        return Promise.resolve(false);
    };
}
exports.OciTreeDataProvider = OciTreeDataProvider;
//# sourceMappingURL=OciTreeProvider.js.map