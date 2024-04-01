"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaRoutineTreeItem = void 0;
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class SchemaRoutineTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    type;
    contextValue = "schemaRoutineItem";
    constructor(name, schema, type, backend, connectionId, hasChildren, command) {
        super(name, schema, backend, connectionId, type === "procedure" ? "schemaRoutine.svg" : "schemaFunction.svg", hasChildren, command);
        this.type = type;
    }
    get qualifiedName() {
        return `\`${this.schema}\`.\`${this.name}\``;
    }
    get dbType() {
        return this.type;
    }
    get createScriptResultIndex() {
        return 2;
    }
}
exports.SchemaRoutineTreeItem = SchemaRoutineTreeItem;
//# sourceMappingURL=SchemaRoutineTreeItem.js.map