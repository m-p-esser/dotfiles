"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTableTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaTableTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    contextValue = "schemaTableItem";
    constructor(name, schema, backend, connectionId, iconName, hasChildren) {
        super(name, schema, backend, connectionId, iconName, hasChildren);
    }
    get qualifiedName() {
        return `\`${this.schema}\`.\`${this.name}\``;
    }
    get dbType() {
        return "table";
    }
}
exports.SchemaTableTreeItem = SchemaTableTreeItem;
//# sourceMappingURL=SchemaTableTreeItem.js.map