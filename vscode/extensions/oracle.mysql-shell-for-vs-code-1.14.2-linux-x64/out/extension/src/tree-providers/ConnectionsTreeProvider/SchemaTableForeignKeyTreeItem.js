"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTableForeignKeyTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaTableForeignKeyTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    table;
    contextValue = "schemaTableForeignKeyItem";
    constructor(name, schema, table, backend, connectionId) {
        super(name, schema, backend, connectionId, "schemaTableForeignKey.svg", false);
        this.table = table;
    }
}
exports.SchemaTableForeignKeyTreeItem = SchemaTableForeignKeyTreeItem;
//# sourceMappingURL=SchemaTableForeignKeyTreeItem.js.map