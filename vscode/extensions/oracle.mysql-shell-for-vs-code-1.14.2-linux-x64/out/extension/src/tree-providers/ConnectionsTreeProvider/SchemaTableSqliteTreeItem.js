"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTableSqliteTreeItem = void 0;
const SchemaTableTreeItem_1 = require("./SchemaTableTreeItem");
class SchemaTableSqliteTreeItem extends SchemaTableTreeItem_1.SchemaTableTreeItem {
    contextValue = "schemaTableItem";
    constructor(name, schema, backend, connectionId, hasChildren) {
        super(name, schema, backend, connectionId, "schemaTable.svg", hasChildren);
    }
}
exports.SchemaTableSqliteTreeItem = SchemaTableSqliteTreeItem;
//# sourceMappingURL=SchemaTableSqliteTreeItem.js.map