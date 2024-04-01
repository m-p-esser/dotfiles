"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSectionTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class AdminSectionTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    contextValue = "adminSection";
    constructor(name, backend, connectionId, iconName, hasChildren, command) {
        super(name, "", backend, connectionId, iconName, hasChildren, command);
    }
}
exports.AdminSectionTreeItem = AdminSectionTreeItem;
//# sourceMappingURL=AdminSectionTreeItem.js.map