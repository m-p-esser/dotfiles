"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaMySQLTreeItem = void 0;
const SchemaTreeItem_1 = require("./SchemaTreeItem");
class SchemaMySQLTreeItem extends SchemaTreeItem_1.SchemaTreeItem {
    contextValue = "schemaItemMySQL";
    constructor(name, schema, backend, connectionId, isCurrent, hasChildren, command) {
        super(name, schema, backend, connectionId, isCurrent ? "schemaMySQLCurrent.svg" : "schemaMySQL.svg", hasChildren, command);
    }
}
exports.SchemaMySQLTreeItem = SchemaMySQLTreeItem;
//# sourceMappingURL=SchemaMySQLTreeItem.js.map