"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaViewTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaViewTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    contextValue = "schemaViewItem";
    constructor(name, schema, backend, connectionId, iconName, hasChildren) {
        super(name, schema, backend, connectionId, iconName, hasChildren);
    }
    get qualifiedName() {
        return `\`${this.schema}\`.\`${this.name}\``;
    }
    get dbType() {
        return "view";
    }
}
exports.SchemaViewTreeItem = SchemaViewTreeItem;
//# sourceMappingURL=SchemaViewTreeItem.js.map