"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OciComputeInstanceTreeItem = void 0;
const vscode_1 = require("vscode");
const OciBaseTreeItem_1 = require("./OciBaseTreeItem");
class OciComputeInstanceTreeItem extends OciBaseTreeItem_1.OciBaseTreeItem {
    compartment;
    compute;
    shellSession;
    contextValue = "mdsComputeInstance";
    constructor(profile, compartment, compute, shellSession) {
        super(compute.displayName ?? "<unknown>", profile, vscode_1.TreeItemCollapsibleState.None);
        this.compartment = compartment;
        this.compute = compute;
        this.shellSession = shellSession;
    }
    get iconName() {
        return "ociCompute.svg";
    }
}
exports.OciComputeInstanceTreeItem = OciComputeInstanceTreeItem;
//# sourceMappingURL=OciComputeInstanceTreeItem.js.map