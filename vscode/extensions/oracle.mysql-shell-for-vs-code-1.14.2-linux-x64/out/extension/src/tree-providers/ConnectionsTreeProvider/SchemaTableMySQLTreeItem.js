"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTableMySQLTreeItem = void 0;
const SchemaTableTreeItem_1 = require("./SchemaTableTreeItem");
class SchemaTableMySQLTreeItem extends SchemaTableTreeItem_1.SchemaTableTreeItem {
    contextValue = "schemaTableItemMySQL";
    constructor(name, schema, backend, connectionId, hasChildren) {
        super(name, schema, backend, connectionId, "schemaTable.svg", hasChildren);
    }
}
exports.SchemaTableMySQLTreeItem = SchemaTableMySQLTreeItem;
//# sourceMappingURL=SchemaTableMySQLTreeItem.js.map