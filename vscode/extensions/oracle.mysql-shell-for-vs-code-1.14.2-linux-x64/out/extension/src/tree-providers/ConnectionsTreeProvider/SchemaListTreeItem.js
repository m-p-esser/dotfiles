"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaListTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaListTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    name;
    entry;
    contextValue = "admin";
    constructor(name, entry, hasChildren) {
        super(name, "", entry, "schemas.svg", hasChildren);
        this.name = name;
        this.entry = entry;
    }
}
exports.SchemaListTreeItem = SchemaListTreeItem;
//# sourceMappingURL=SchemaListTreeItem.js.map