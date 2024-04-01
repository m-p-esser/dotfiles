import { TreeDataProvider, TreeItem, ProviderResult, Event } from "vscode";
export declare class OciTreeDataProvider implements TreeDataProvider<TreeItem> {
    private changeEvent;
    private shellSession;
    private compartmentCache;
    constructor();
    dispose(): void;
    get onDidChangeTreeData(): Event<TreeItem | undefined>;
    refresh(item?: TreeItem): void;
    getTreeItem(element: TreeItem): TreeItem;
    getChildren(element?: TreeItem): ProviderResult<TreeItem[]>;
    private listConfigProfiles;
    private addOciCompartmentTreeItem;
    private listCompartments;
    private listDatabases;
    private listComputeInstances;
    private listBastionHosts;
    private listLoadBalancers;
    private proxyRequest;
}
