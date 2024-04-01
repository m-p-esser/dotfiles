import { EditorLanguage } from "..";
import { IShellModuleDataEntry, IDBDataTreeEntry, IShellModuleDataCategoriesEntry } from "../../communication/ProtocolGui";
import { IDBDataEntry } from "../../modules/db-editor";
export declare class ShellInterfaceModule {
    private scriptCategoryToLanguage;
    private languageToScriptCategory;
    addData(caption: string, content: string, dataCategoryId: number, treeIdentifier: string, folderPath?: string, profileId?: number): Promise<number>;
    listData(folderId: number, dataCategoryId?: number): Promise<IShellModuleDataEntry[]>;
    getDataContent(dataId: number): Promise<string>;
    createProfileDataTree(treeIdentifier: string, profileId?: number): Promise<void>;
    getProfileDataTree(treeIdentifier: string, profileId?: number): Promise<IDBDataTreeEntry[]>;
    createUserGroupDataTree(treeIdentifier: string, userGroupId?: number): Promise<void>;
    getUserGroupDataTree(treeIdentifier: string, userGroupId?: number): Promise<void>;
    getProfileDataTreeIdentifiers(profileId: number): Promise<void>;
    shareDataToUserGroup(id: number, userGroupId: number, readOnly: number, treeIdentifier: string, folderPath?: string): Promise<void>;
    addDataToProfile(id: number, profileId: number, readOnly: number, treeIdentifier: string, folderPath?: string): Promise<void>;
    updateData(id: number, caption?: string, content?: string): Promise<void>;
    deleteData(id: number, folderId: number): Promise<void>;
    listDataCategories(parentID?: number): Promise<IShellModuleDataCategoriesEntry[]>;
    addDataCategory(category: string, parent?: number): Promise<void>;
    removeDataCategory(categoryId: number): Promise<void>;
    scriptTypeFromLanguage(language: EditorLanguage): number | undefined;
    loadScriptsTree(profileId?: number): Promise<IDBDataEntry[]>;
    private loadScriptTreeEntries;
    private loadScriptStates;
}
