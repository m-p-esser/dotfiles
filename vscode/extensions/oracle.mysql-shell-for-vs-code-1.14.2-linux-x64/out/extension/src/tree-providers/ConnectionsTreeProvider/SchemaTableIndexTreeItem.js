"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTableIndexTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaTableIndexTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    table;
    contextValue = "schemaTableIndexItem";
    constructor(name, schema, table, backend, connectionId) {
        super(name, schema, backend, connectionId, "schemaTableIndex.svg", false);
        this.table = table;
    }
    get qualifiedName() {
        return `\`${this.schema}\`.\`${this.table}\`.\`${this.name}\``;
    }
    get dbType() {
        return "index";
    }
}
exports.SchemaTableIndexTreeItem = SchemaTableIndexTreeItem;
//# sourceMappingURL=SchemaTableIndexTreeItem.js.map