"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class AdminTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    contextValue = "admin";
    constructor(name, backend, connectionId, hasChildren) {
        super(name, "", backend, connectionId, "adminDashboard.svg", hasChildren);
    }
}
exports.AdminTreeItem = AdminTreeItem;
//# sourceMappingURL=AdminTreeItem.js.map