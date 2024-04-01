"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class MrsTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    contextValue = "mrs";
    constructor(name, schema, backend, connectionId, hasChildren, enabled, command) {
        super(name, schema, backend, connectionId, enabled ? "mrs.svg" : "mrsDisabled.svg", hasChildren, command);
    }
}
exports.MrsTreeItem = MrsTreeItem;
//# sourceMappingURL=MrsTreeItem.js.map