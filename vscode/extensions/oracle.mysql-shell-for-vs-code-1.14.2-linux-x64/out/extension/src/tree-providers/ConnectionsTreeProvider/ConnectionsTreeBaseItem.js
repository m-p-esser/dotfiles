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
exports.ConnectionsTreeBaseItem = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const utilities_1 = require("../../utilities");
class ConnectionsTreeBaseItem extends vscode_1.TreeItem {
    name;
    schema;
    backend;
    connectionId;
    constructor(name, schema, backend, connectionId, iconName, hasChildren, command) {
        super(name, hasChildren ? vscode_1.TreeItemCollapsibleState.Collapsed : vscode_1.TreeItemCollapsibleState.None);
        this.name = name;
        this.schema = schema;
        this.backend = backend;
        this.connectionId = connectionId;
        this.iconPath = {
            light: path.join(__dirname, "..", "images", "light", iconName),
            dark: path.join(__dirname, "..", "images", "dark", iconName),
        };
        this.command = command;
    }
    copyNameToClipboard() {
        void vscode_1.env.clipboard.writeText(this.name).then(() => {
            (0, utilities_1.showMessageWithTimeout)("The name was copied to the system clipboard");
        });
    }
    copyCreateScriptToClipboard(withDelimiter = false, withDrop = false) {
        this.backend.execute(`show create ${this.dbType} ${this.qualifiedName}`).then((data) => {
            if (data) {
                if (data.rows && data.rows.length > 0) {
                    const firstRow = data.rows[0];
                    const index = this.createScriptResultIndex;
                    if (firstRow.length > index) {
                        let stmt = firstRow[index];
                        if (withDelimiter) {
                            if (withDrop) {
                                let name = Array.from(stmt.matchAll(/PROCEDURE `(.*?)`/gm), (m) => { return m[1]; });
                                if (name.length > 0) {
                                    stmt = `DROP PROCEDURE \`${name[0]}\`$$\n${stmt}`;
                                }
                                else {
                                    name = Array.from(stmt.matchAll(/FUNCTION `(.*?)`/gm), (m) => { return m[1]; });
                                    if (name.length) {
                                        stmt = `DROP FUNCTION \`${name[0]}\`$$\n${stmt}`;
                                    }
                                }
                            }
                            stmt = `DELIMITER $$\n${stmt}$$\nDELIMITER ;`;
                        }
                        void vscode_1.env.clipboard.writeText(stmt).then(() => {
                            (0, utilities_1.showMessageWithTimeout)("The create script was copied to the system clipboard");
                        });
                    }
                }
            }
        }).catch((event) => {
            void vscode_1.window.showErrorMessage("Error while getting create script: " + event.message);
        });
    }
    dropItem() {
        const message = `Do you want to drop the ${this.dbType} ${this.name}?`;
        const okText = `Drop ${this.name}`;
        void (0, utilities_1.showModalDialog)(message, okText, "This operation cannot be reverted!").then((accepted) => {
            if (accepted) {
                const query = `drop ${this.dbType} ${this.qualifiedName}`;
                this.backend.execute(query).then(() => {
                    void vscode_1.commands.executeCommand("msg.refreshConnections");
                    (0, utilities_1.showMessageWithTimeout)(`The object ${this.name} has been dropped successfully.`);
                }).catch((errorEvent) => {
                    void vscode_1.window.showErrorMessage(`Error dropping the object: ${errorEvent.message}`);
                });
            }
        });
    }
    get qualifiedName() {
        return "";
    }
    get dbType() {
        return "";
    }
    get createScriptResultIndex() {
        return 1;
    }
}
exports.ConnectionsTreeBaseItem = ConnectionsTreeBaseItem;
//# sourceMappingURL=ConnectionsTreeBaseItem.js.map