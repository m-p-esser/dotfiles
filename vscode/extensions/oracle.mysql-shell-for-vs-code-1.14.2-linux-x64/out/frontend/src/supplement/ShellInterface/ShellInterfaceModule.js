"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellInterfaceModule = void 0;
const MessageScheduler_1 = require("../../communication/MessageScheduler");
const ProtocolGui_1 = require("../../communication/ProtocolGui");
const db_editor_1 = require("../../modules/db-editor");
const helpers_1 = require("../../utilities/helpers");
var StandardDataCategories;
(function (StandardDataCategories) {
    StandardDataCategories[StandardDataCategories["Text"] = 1] = "Text";
    StandardDataCategories[StandardDataCategories["Script"] = 2] = "Script";
    StandardDataCategories[StandardDataCategories["JSON"] = 3] = "JSON";
    StandardDataCategories[StandardDataCategories["MySQLScript"] = 4] = "MySQLScript";
    StandardDataCategories[StandardDataCategories["PythonScript"] = 5] = "PythonScript";
    StandardDataCategories[StandardDataCategories["JavaScriptScript"] = 6] = "JavaScriptScript";
    StandardDataCategories[StandardDataCategories["TypeScriptScript"] = 7] = "TypeScriptScript";
    StandardDataCategories[StandardDataCategories["SQLiteScript"] = 8] = "SQLiteScript";
})(StandardDataCategories || (StandardDataCategories = {}));
class ShellInterfaceModule {
    scriptCategoryToLanguage = new Map([
        [StandardDataCategories.MySQLScript, "mysql"],
        [StandardDataCategories.PythonScript, "python"],
        [StandardDataCategories.JavaScriptScript, "javascript"],
        [StandardDataCategories.TypeScriptScript, "typescript"],
        [StandardDataCategories.SQLiteScript, "sql"],
        [StandardDataCategories.JSON, "json"],
    ]);
    languageToScriptCategory = new Map([
        ["mysql", StandardDataCategories.MySQLScript],
        ["python", StandardDataCategories.PythonScript],
        ["javascript", StandardDataCategories.JavaScriptScript],
        ["typescript", StandardDataCategories.TypeScriptScript],
        ["sql", StandardDataCategories.SQLiteScript],
        ["json", StandardDataCategories.JSON],
    ]);
    async addData(caption, content, dataCategoryId, treeIdentifier, folderPath, profileId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesAddData,
            parameters: {
                args: {
                    caption,
                    content,
                    dataCategoryId,
                    treeIdentifier,
                    folderPath,
                    profileId,
                },
            },
        });
        return response.result;
    }
    async listData(folderId, dataCategoryId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesListData,
            parameters: {
                args: {
                    folderId,
                    dataCategoryId,
                },
            },
        });
        return response.result;
    }
    async getDataContent(dataId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesGetDataContent,
            parameters: {
                args: {
                    id: dataId,
                },
            },
        });
        return response.result;
    }
    async createProfileDataTree(treeIdentifier, profileId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesCreateProfileDataTree,
            parameters: {
                args: {
                    treeIdentifier,
                    profileId,
                },
            },
        });
    }
    async getProfileDataTree(treeIdentifier, profileId) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesGetProfileDataTree,
            parameters: {
                args: {
                    treeIdentifier,
                    profileId,
                },
            },
        });
        const result = [];
        response.forEach((list) => {
            result.push(...list.result);
        });
        return result;
    }
    async createUserGroupDataTree(treeIdentifier, userGroupId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesCreateUserGroupDataTree,
            parameters: {
                args: {
                    treeIdentifier,
                    userGroupId,
                },
            },
        });
    }
    async getUserGroupDataTree(treeIdentifier, userGroupId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesGetUserGroupDataTree,
            parameters: {
                args: {
                    treeIdentifier,
                    userGroupId,
                },
            },
        });
    }
    async getProfileDataTreeIdentifiers(profileId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesGetProfileTreeIdentifiers,
            parameters: {
                args: {
                    profileId,
                },
            },
        });
    }
    async shareDataToUserGroup(id, userGroupId, readOnly, treeIdentifier, folderPath) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesShareDataToUserGroup,
            parameters: {
                args: {
                    id,
                    userGroupId,
                    readOnly,
                    treeIdentifier,
                    folderPath,
                },
            },
        });
    }
    async addDataToProfile(id, profileId, readOnly, treeIdentifier, folderPath) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesAddDataToProfile,
            parameters: {
                args: {
                    id,
                    profileId,
                    readOnly,
                    treeIdentifier,
                    folderPath,
                },
            },
        });
    }
    async updateData(id, caption, content) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesUpdateData,
            parameters: {
                args: {
                    id,
                    caption,
                    content,
                },
            },
        });
    }
    async deleteData(id, folderId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesDeleteData,
            parameters: {
                args: {
                    id,
                    folderId,
                },
            },
        });
    }
    async listDataCategories(parentID) {
        const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesListDataCategories,
            parameters: {
                args: {
                    categoryId: parentID,
                },
            },
        });
        return response.result;
    }
    async addDataCategory(category, parent) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesAddDataCategory,
            parameters: {
                args: {
                    name: category,
                    parentCategoryId: parent,
                },
            },
        });
    }
    async removeDataCategory(categoryId) {
        await MessageScheduler_1.MessageScheduler.get.sendRequest({
            requestType: ProtocolGui_1.ShellAPIGui.GuiModulesRemoveDataCategory,
            parameters: {
                args: {
                    categoryId,
                },
            },
        });
    }
    scriptTypeFromLanguage(language) {
        return this.languageToScriptCategory.get(language);
    }
    async loadScriptsTree(profileId) {
        return this.loadScriptTreeEntries(StandardDataCategories.Script, profileId);
    }
    async loadScriptTreeEntries(categoryId, profileId) {
        const dataTree = await this.getProfileDataTree("scripts", profileId);
        const createTree = async (parentId, target) => {
            const result = dataTree.filter((entry, index, arr) => {
                if (entry.parentFolderId === parentId) {
                    arr.splice(index, 1);
                    return true;
                }
                return false;
            });
            for await (const entry of result) {
                const entries = await this.loadScriptStates(entry.id, categoryId);
                await createTree(entry.id, entries);
                target.push({
                    id: "",
                    folderId: parentId,
                    dbDataId: entry.id,
                    caption: entry.caption,
                    children: entries,
                    type: db_editor_1.EntityType.Folder,
                });
            }
        };
        const result = [];
        if (dataTree.length > 0 && dataTree[0].caption === "scripts") {
            const root = dataTree.shift();
            if (root) {
                const states = await this.loadScriptStates(root.id, categoryId);
                result.push(...states);
                await createTree(root.id, result);
            }
        }
        return result;
    }
    loadScriptStates = async (folderId, dataCategoryId) => {
        const listData = [];
        const dataEntries = await this.listData(folderId, dataCategoryId);
        listData.push(...dataEntries.map((entry) => {
            const language = this.scriptCategoryToLanguage.get(entry.dataCategoryId) ?? "mysql";
            return {
                id: (0, helpers_1.uuid)(),
                folderId,
                type: db_editor_1.EntityType.Script,
                caption: entry.caption,
                language,
                dbDataId: entry.id,
            };
        }));
        return listData;
    };
}
exports.ShellInterfaceModule = ShellInterfaceModule;
//# sourceMappingURL=ShellInterfaceModule.js.map