"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OciHWClusterTreeItem = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const OciBaseTreeItem_1 = require("./OciBaseTreeItem");
class OciHWClusterTreeItem extends OciBaseTreeItem_1.OciBaseTreeItem {
    compartment;
    dbSystem;
    contextValue = "mdsHWCluster";
    constructor(profile, compartment, dbSystem) {
        super(`HeatWave Cluster (${dbSystem.heatWaveCluster?.clusterSize ?? ""} ` +
            `node${((dbSystem.heatWaveCluster?.clusterSize ?? 0) > 1) ? "s" : ""})`, profile, vscode_1.TreeItemCollapsibleState.None);
        this.compartment = compartment;
        this.dbSystem = dbSystem;
        let iconName = "ociComputeNotActive.svg";
        if (dbSystem.heatWaveCluster && dbSystem.heatWaveCluster.lifecycleState === "ACTIVE") {
            iconName = "ociCompute.svg";
        }
        else if (dbSystem.heatWaveCluster && (dbSystem.heatWaveCluster.lifecycleState === "INACTIVE" ||
            dbSystem.heatWaveCluster.lifecycleState === "FAILED")) {
            iconName = "ociComputeStopped.svg";
        }
        this.iconPath = {
            light: path.join(__dirname, "..", "images", "light", iconName),
            dark: path.join(__dirname, "..", "images", "dark", iconName),
        };
    }
}
exports.OciHWClusterTreeItem = OciHWClusterTreeItem;
//# sourceMappingURL=OciHWClusterTreeItem.js.map