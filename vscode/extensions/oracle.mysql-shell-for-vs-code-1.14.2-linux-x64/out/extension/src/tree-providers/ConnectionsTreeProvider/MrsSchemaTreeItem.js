"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsSchemaTreeItem = void 0;
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsSchemaTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsSchema";
    constructor(label, value, backend, connectionId) {
        const iconName = value.enabled === 1
            ? (value.requiresAuth === 1 ? "mrsSchemaLocked.svg" : "mrsSchema.svg")
            : "mrsSchemaDisabled.svg";
        super(label, backend, connectionId, iconName, true);
        this.value = value;
    }
}
exports.MrsSchemaTreeItem = MrsSchemaTreeItem;
//# sourceMappingURL=MrsSchemaTreeItem.js.map