import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { IMdsProfileData } from "../../../../frontend/src/communication/ProtocolMds";
export declare class OciBaseTreeItem extends TreeItem {
    name: string;
    profile: IMdsProfileData;
    constructor(name: string, profile: IMdsProfileData, collapsibleState?: TreeItemCollapsibleState);
    protected get iconName(): string;
}
