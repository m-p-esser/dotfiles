"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaEventTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaEventTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    contextValue = "schemaEventItem";
    constructor(name, schema, backend, connectionId, hasChildren) {
        super(name, schema, backend, connectionId, "schemaEvent.svg", hasChildren);
    }
    get qualifiedName() {
        return `\`${this.schema}\`.\`${this.name}\``;
    }
    get dbType() {
        return "event";
    }
}
exports.SchemaEventTreeItem = SchemaEventTreeItem;
//# sourceMappingURL=SchemaEventTreeItem.js.map