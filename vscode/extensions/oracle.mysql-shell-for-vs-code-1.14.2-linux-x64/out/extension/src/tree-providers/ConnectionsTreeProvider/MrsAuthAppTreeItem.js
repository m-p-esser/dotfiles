"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsAuthAppTreeItem = void 0;
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsAuthAppTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsAuthApp";
    constructor(label, value, backend, connectionId) {
        super(label, backend, connectionId, value.enabled ? "shield.svg" : "shieldDisabled.svg", true);
        this.value = value;
        this.tooltip = value.description ?? label;
    }
}
exports.MrsAuthAppTreeItem = MrsAuthAppTreeItem;
//# sourceMappingURL=MrsAuthAppTreeItem.js.map