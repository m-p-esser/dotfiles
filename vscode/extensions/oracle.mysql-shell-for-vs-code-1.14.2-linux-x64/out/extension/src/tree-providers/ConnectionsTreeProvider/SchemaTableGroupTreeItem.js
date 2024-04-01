"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableGroupTreeItem = void 0;
const SchemaIndex_1 = require("./SchemaIndex");
const ConnectionsTreeBaseItem_1 = require("./ConnectionsTreeBaseItem");
class TableGroupTreeItem extends ConnectionsTreeBaseItem_1.ConnectionsTreeBaseItem {
    table;
    groupType;
    contextValue = `schemaTable${String(this.label)}GroupItem`;
    constructor(schema, table, backend, connectionId, groupType) {
        super(groupType, schema, backend, connectionId, TableGroupTreeItem.getIconName(groupType), true);
        this.table = table;
        this.groupType = groupType;
    }
    static getIconName(label) {
        switch (label) {
            case SchemaIndex_1.SchemaItemGroupType.Columns: {
                return "schemaTableColumns.svg";
            }
            case SchemaIndex_1.SchemaItemGroupType.Indexes: {
                return "schemaTableIndexes.svg";
            }
            case SchemaIndex_1.SchemaItemGroupType.ForeignKeys: {
                return "schemaTableForeignKey.svg";
            }
            case SchemaIndex_1.SchemaItemGroupType.Triggers: {
                return "schemaTableTriggers.svg";
            }
            default: {
                return "";
            }
        }
    }
}
exports.TableGroupTreeItem = TableGroupTreeItem;
//# sourceMappingURL=SchemaTableGroupTreeItem.js.map