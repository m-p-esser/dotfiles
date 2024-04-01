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
exports.EditorTreeItem = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const db_editor_1 = require("../../../../frontend/src/modules/db-editor");
class EditorTreeItem extends vscode_1.TreeItem {
    normalCaption;
    alternativeCaption;
    static #entityIconMap = new Map([
        [db_editor_1.EntityType.Notebook, "terminal"],
        [db_editor_1.EntityType.Script, "script"],
        [db_editor_1.EntityType.Folder, "folder"],
        [db_editor_1.EntityType.Status, "adminServerStatus"],
        [db_editor_1.EntityType.Connections, "clientConnections"],
        [db_editor_1.EntityType.Dashboard, "adminPerformanceDashboard"],
    ]);
    contextValue = "editorItem";
    constructor(normalCaption, alternativeCaption, language, editorType, command) {
        super(normalCaption, vscode_1.TreeItemCollapsibleState.None);
        this.normalCaption = normalCaption;
        this.alternativeCaption = alternativeCaption;
        this.command = command;
        if (editorType === db_editor_1.EntityType.Script || editorType === db_editor_1.EntityType.Notebook) {
            if (language === "msg") {
                this.iconPath = {
                    light: path.join(__dirname, "..", "images", "light", "notebook.svg"),
                    dark: path.join(__dirname, "..", "images", "dark", "notebook.svg"),
                };
            }
            else {
                let name;
                switch (language) {
                    case "sql": {
                        name = "scriptSqlite";
                        break;
                    }
                    case "mysql": {
                        name = "scriptMysql";
                        break;
                    }
                    case "javascript": {
                        name = "scriptJs";
                        break;
                    }
                    case "typescript": {
                        name = "scriptTs";
                        break;
                    }
                    case "python": {
                        name = "scriptPy";
                        break;
                    }
                    default: {
                        name = "default";
                        break;
                    }
                }
                this.iconPath = {
                    light: path.join(__dirname, "..", "images", "light", "file-icons", name + ".svg"),
                    dark: path.join(__dirname, "..", "images", "dark", "file-icons", name + ".svg"),
                };
            }
        }
        else {
            const icon = EditorTreeItem.#entityIconMap.get(editorType) ?? "default";
            this.iconPath = {
                light: path.join(__dirname, "..", "images", "light", icon + ".svg"),
                dark: path.join(__dirname, "..", "images", "dark", icon + ".svg"),
            };
        }
    }
    updateLabel(simpleView) {
        this.label = simpleView ? this.alternativeCaption : this.normalCaption;
    }
}
exports.EditorTreeItem = EditorTreeItem;
//# sourceMappingURL=EditorTreeItem.js.map