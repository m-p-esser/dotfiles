"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsUserTreeItem = void 0;
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsUserTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsUser";
    constructor(label, value, backend, connectionId) {
        super(label, backend, connectionId, "ociProfile.svg", false);
        this.value = value;
    }
}
exports.MrsUserTreeItem = MrsUserTreeItem;
//# sourceMappingURL=MrsUserTreeItem.js.map