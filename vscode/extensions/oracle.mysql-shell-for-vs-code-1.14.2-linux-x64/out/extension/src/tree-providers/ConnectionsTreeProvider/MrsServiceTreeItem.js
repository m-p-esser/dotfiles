"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsServiceTreeItem = void 0;
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsServiceTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsService";
    constructor(label, value, backend, connectionId) {
        const iconName = value.isCurrent ?
            !value.enabled ? "mrsServiceDefaultDisabled.svg" : "mrsServiceDefault.svg" :
            !value.enabled ? "mrsServiceDisabled.svg" : "mrsService.svg";
        super(label, backend, connectionId, iconName, true);
        this.value = value;
    }
}
exports.MrsServiceTreeItem = MrsServiceTreeItem;
//# sourceMappingURL=MrsServiceTreeItem.js.map