"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrsRouterTreeItem = void 0;
const MrsTreeBaseItem_1 = require("./MrsTreeBaseItem");
class MrsRouterTreeItem extends MrsTreeBaseItem_1.MrsTreeBaseItem {
    value;
    contextValue = "mrsRouter";
    constructor(label, value, backend, connectionId, requiresUpgrade) {
        super(label, backend, connectionId, MrsRouterTreeItem.getIconName(value, requiresUpgrade), false);
        this.value = value;
        this.description = value.version;
        this.tooltip = requiresUpgrade
            ? "This MySQL Router requires an upgrade."
            : `MySQL Router ${value.version} - ${value.address}`;
    }
    static getIconName = (value, requiresUpgrade) => {
        if (requiresUpgrade) {
            return "routerError.svg";
        }
        if (!value.active) {
            return "routerNotActive.svg";
        }
        return "router.svg";
    };
}
exports.MrsRouterTreeItem = MrsRouterTreeItem;
//# sourceMappingURL=MrsRouterTreeItem.js.map