import { Command, TreeItem } from "vscode";
import { EntityType } from "../../../../frontend/src/modules/db-editor";
import { EditorLanguage } from "../../../../frontend/src/supplement";
export declare class EditorTreeItem extends TreeItem {
    #private;
    private normalCaption;
    private alternativeCaption;
    contextValue: string;
    constructor(normalCaption: string, alternativeCaption: string, language: EditorLanguage, editorType: EntityType, command: Command);
    updateLabel(simpleView: boolean): void;
}
