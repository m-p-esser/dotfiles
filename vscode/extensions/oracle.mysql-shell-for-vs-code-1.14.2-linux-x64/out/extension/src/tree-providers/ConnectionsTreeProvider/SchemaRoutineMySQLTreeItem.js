"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaRoutineMySQLTreeItem = void 0;
const SchemaRoutineTreeItem_1 = require("./SchemaRoutineTreeItem");
class SchemaRoutineMySQLTreeItem extends SchemaRoutineTreeItem_1.SchemaRoutineTreeItem {
    contextValue = "schemaRoutineItemMySQL";
    get iconName() {
        return this.dbType === "procedure" ? "schemaRoutine.svg" : "schemaFunction.svg";
    }
}
exports.SchemaRoutineMySQLTreeItem = SchemaRoutineMySQLTreeItem;
//# sourceMappingURL=SchemaRoutineMySQLTreeItem.js.map