"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaViewSqliteTreeItem = void 0;
const SchemaViewTreeItem_1 = require("./SchemaViewTreeItem");
class SchemaViewSqliteTreeItem extends SchemaViewTreeItem_1.SchemaViewTreeItem {
    contextValue = "schemaViewItem";
    constructor(name, schema, backend, connectionId, hasChildren) {
        super(name, schema, backend, connectionId, "schemaView.svg", hasChildren);
    }
}
exports.SchemaViewSqliteTreeItem = SchemaViewSqliteTreeItem;
//# sourceMappingURL=SchemaViewSqliteTreeItem.js.map