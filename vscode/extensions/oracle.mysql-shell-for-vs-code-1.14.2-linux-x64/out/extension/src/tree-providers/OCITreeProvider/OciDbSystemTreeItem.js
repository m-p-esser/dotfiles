"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OciDbSystemTreeItem = void 0;
const OciBaseTreeItem_1 = require("./OciBaseTreeItem");
class OciDbSystemTreeItem extends OciBaseTreeItem_1.OciBaseTreeItem {
    compartment;
    dbSystem;
    contextValue = "mdsDbSystem";
    constructor(profile, compartment, dbSystem, treeState) {
        super(dbSystem.displayName, profile, treeState);
        this.compartment = compartment;
        this.dbSystem = dbSystem;
    }
}
exports.OciDbSystemTreeItem = OciDbSystemTreeItem;
//# sourceMappingURL=OciDbSystemTreeItem.js.map