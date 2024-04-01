"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsContentSetTreeItem = void 0;
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsContentSetTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsContentSet";
    constructor(label, value, backend, connectionId) {
        super(label, backend, connectionId, value.enabled === 1
            ? "mrsContentSet.svg"
            : "mrsContentSetDisabled.svg", true);
        this.value = value;
    }
}
exports.MrsContentSetTreeItem = MrsContentSetTreeItem;
//# sourceMappingURL=MrsContentSetTreeItem.js.map