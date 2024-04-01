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
exports.OciCompartmentTreeItem = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const OciBaseTreeItem_1 = require("./OciBaseTreeItem");
class OciCompartmentTreeItem extends OciBaseTreeItem_1.OciBaseTreeItem {
    compartment;
    contextValue = "mdsCompartment";
    constructor(profile, compartment, collapsibleState = vscode_1.TreeItemCollapsibleState.Collapsed) {
        super(compartment.isCurrent ? `${compartment.name} (Default)` : compartment.name, profile, collapsibleState);
        this.compartment = compartment;
        const iconName = compartment.isCurrent ? "folderCurrent.svg" : "folder.svg";
        this.iconPath = {
            light: path.join(__dirname, "..", "images", "light", iconName),
            dark: path.join(__dirname, "..", "images", "dark", iconName),
        };
    }
}
exports.OciCompartmentTreeItem = OciCompartmentTreeItem;
//# sourceMappingURL=OciCompartmentTreeItem.js.map