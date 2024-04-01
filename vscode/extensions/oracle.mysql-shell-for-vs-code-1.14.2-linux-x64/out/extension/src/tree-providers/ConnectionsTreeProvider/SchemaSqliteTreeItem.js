"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaSqliteTreeItem = void 0;
const SchemaTreeItem_1 = require("./SchemaTreeItem");
class SchemaSqliteTreeItem extends SchemaTreeItem_1.SchemaTreeItem {
    contextValue = "schemaItem";
    constructor(name, schema, backend, connectionId, isCurrent, hasChildren, command) {
        super(name, schema, backend, connectionId, isCurrent ? "schemaSqliteCurrent.svg" : "schemaSqlite.svg", hasChildren, command);
    }
    get qualifiedName() {
        return `\`${this.name}\``;
    }
    get dbType() {
        return "schema";
    }
}
exports.SchemaSqliteTreeItem = SchemaSqliteTreeItem;
//# sourceMappingURL=SchemaSqliteTreeItem.js.map