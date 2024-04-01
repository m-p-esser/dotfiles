import { ComponentChild } from "preact";
import { EditorLanguage } from "../../supplement";
export declare enum EntityType {
    Notebook = 0,
    Script = 1,
    Folder = 2,
    Status = 3,
    Connections = 4,
    Dashboard = 5
}
export declare enum SchemaTreeType {
    Document = 0,
    Schema = 1,
    Table = 2,
    StoredFunction = 3,
    StoredProcedure = 4,
    Event = 5,
    Trigger = 6,
    Column = 7,
    View = 8,
    Index = 9,
    ForeignKey = 10,
    GroupNode = 11,
    UserVariable = 12,
    User = 13,
    Engine = 14,
    Plugin = 15,
    Character = 16
}
export interface ISchemaTreeEntry<T = unknown> {
    type: SchemaTreeType;
    expanded: boolean;
    expandedOnce: boolean;
    id: string;
    caption: string;
    qualifiedName: {
        schema: string;
        table?: string;
        name?: string;
    };
    details: T;
    children?: Array<ISchemaTreeEntry<T>>;
}
export interface IEntityBase {
    type: EntityType;
    id: string;
    caption: string;
}
export interface IDBDataEntry extends IEntityBase {
    dbDataId: number;
    folderId: number;
}
export interface IFolderEntity extends IDBDataEntry {
    children: IDBDataEntry[];
}
export interface IDBEditorScriptState extends IDBDataEntry {
    language: EditorLanguage;
}
export interface IEditorStatusInfo {
    insertSpaces?: boolean;
    indentSize?: number;
    tabSize?: number;
    line?: number;
    column?: number;
    language?: string;
    eol?: string;
}
export interface IToolbarItems {
    navigation: ComponentChild[];
    execution: ComponentChild[];
    editor: ComponentChild[];
    auxillary: ComponentChild[];
}
export declare type ColorScheme = "classic" | "delectable" | "trello" | "brewing" | "light" | "lively" | "grays";
export interface ISavedGraphData {
    activeColorScheme: ColorScheme;
    displayInterval: number;
    timestamp: number;
    currentValues: Map<string, number>;
    computedValues: {
        [key: string]: number;
    };
    series: Map<string, IXYDatum[]>;
}
