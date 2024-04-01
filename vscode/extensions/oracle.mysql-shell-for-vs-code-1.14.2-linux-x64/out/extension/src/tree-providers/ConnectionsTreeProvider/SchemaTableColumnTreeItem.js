"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTableColumnTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaTableColumnTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    table;
    contextValue = "schemaTableColumnItem";
    constructor(name, schema, table, backend, connectionId) {
        super(name, schema, backend, connectionId, "schemaTableColumn.svg", false);
        this.table = table;
    }
    get qualifiedName() {
        return `\`${this.schema}\`.\`${this.table}\`.\`${this.name}\``;
    }
    get dbType() {
        return "column";
    }
}
exports.SchemaTableColumnTreeItem = SchemaTableColumnTreeItem;
//# sourceMappingURL=SchemaTableColumnTreeItem.js.map