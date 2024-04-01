"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsContentFileTreeItem = void 0;
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsContentFileTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsContentFile";
    constructor(label, value, backend, connectionId) {
        super(label, backend, connectionId, value.enabled ? "mrsContentFile.svg" : "mrsContentFileDisabled.svg", false);
        this.value = value;
    }
}
exports.MrsContentFileTreeItem = MrsContentFileTreeItem;
//# sourceMappingURL=MrsContentFileTreeItem.js.map