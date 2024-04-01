"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaViewMySQLTreeItem = void 0;
const SchemaViewTreeItem_1 = require("./SchemaViewTreeItem");
class SchemaViewMySQLTreeItem extends SchemaViewTreeItem_1.SchemaViewTreeItem {
    contextValue = "schemaViewItemMySQL";
    constructor(name, schema, backend, connectionId, hasChildren) {
        super(name, schema, backend, connectionId, "schemaView.svg", hasChildren);
    }
}
exports.SchemaViewMySQLTreeItem = SchemaViewMySQLTreeItem;
//# sourceMappingURL=SchemaViewMySQLTreeItem.js.map