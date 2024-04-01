"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptTreeItem = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const db_editor_1 = require("../../../frontend/src/modules/db-editor");
class ScriptTreeItem extends vscode_1.TreeItem {
    entry;
    contextValue = "script";
    constructor(entry, command) {
        super(entry.caption, vscode_1.TreeItemCollapsibleState.None);
        this.entry = entry;
        if (entry.type === db_editor_1.EntityType.Script) {
            const language = entry.language;
            this.iconPath = {
                light: path.join(__dirname, "..", "images", "file-icons", language + ".svg"),
                dark: path.join(__dirname, "..", "images", "file-icons", language + ".svg"),
            };
        }
        else {
            this.iconPath = {
                light: path.join(__dirname, "..", "images", "file-icons", "folder.svg"),
                dark: path.join(__dirname, "..", "images", "file-icons", "folder.svg"),
            };
        }
        this.command = command;
    }
}
exports.ScriptTreeItem = ScriptTreeItem;
//# sourceMappingURL=ScriptTreeItem.js.map