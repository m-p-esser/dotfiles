"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsDbObjectTreeItem = void 0;
const string_helpers_1 = require("../../../../frontend/src/utilities/string-helpers");
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsDbObjectTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsDbObject";
    constructor(label, value, backend, connectionId) {
        super(label, backend, connectionId, MrsDbObjectTreeItem.getIconName(value), false);
        this.value = value;
    }
    static getIconName = (value) => {
        let iconName = "mrsDbObject" + (0, string_helpers_1.convertToPascalCase)(value.objectType.toLowerCase());
        iconName += value.requiresAuth === 1 ? "Locked" : "";
        iconName += value.enabled !== 1 ? "Disabled" : "";
        return iconName + ".svg";
    };
}
exports.MrsDbObjectTreeItem = MrsDbObjectTreeItem;
//# sourceMappingURL=MrsDbObjectTreeItem.js.map