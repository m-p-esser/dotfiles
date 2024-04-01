"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTableTriggerTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaTableTriggerTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    table;
    contextValue = "schemaTableTriggerItem";
    constructor(name, schema, table, backend, connectionId) {
        super(name, schema, backend, connectionId, "schemaTableTrigger.svg", false);
        this.table = table;
    }
    get qualifiedName() {
        return `\`${this.schema}\`.\`${this.name}\``;
    }
    get dbType() {
        return "trigger";
    }
}
exports.SchemaTableTriggerTreeItem = SchemaTableTriggerTreeItem;
//# sourceMappingURL=SchemaTableTriggerTreeItem.js.map