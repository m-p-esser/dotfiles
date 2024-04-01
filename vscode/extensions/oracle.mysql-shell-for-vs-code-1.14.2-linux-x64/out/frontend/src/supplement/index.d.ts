import { IColumnInfo, IDictionary } from "../app-logic/Types";
import { DBType } from "./ShellInterface";
export declare const editorLanguages: readonly ["text", "typescript", "javascript", "mysql", "sql", "python", "json", "markdown", "msg", "xml", "ini"];
export declare type EditorLanguage = typeof editorLanguages[number];
export declare const isEditorLanguage: (value: unknown) => value is "json" | "markdown" | "text" | "typescript" | "javascript" | "mysql" | "sql" | "python" | "msg" | "xml" | "ini";
export declare const editorLanguageSuffixes: readonly ["txt", "ts", "js", "mysql", "sql", "py", "json", "md", "msg", "xml", "ini"];
export declare type EditorLanguageSuffix = typeof editorLanguageSuffixes[number];
export declare const isEditorLanguageSuffix: (value: unknown) => value is "json" | "mysql" | "sql" | "msg" | "xml" | "ini" | "txt" | "ts" | "js" | "py" | "md";
export interface ITextRange {
    readonly startLine: number;
    readonly startColumn: number;
    readonly endLine: number;
    readonly endColumn: number;
}
export interface IExecutionContext {
    id: string;
    code: string;
    codeLength: number;
    language: EditorLanguage;
    isSQLLike: boolean;
    linkId?: number;
    endLine: number;
    startLine: number;
    isInternal: boolean;
    fullRange: ITextRange | undefined;
}
export interface ISqlPageRequest {
    context: IExecutionContext;
    oldResultId: string;
    page: number;
    sql: string;
}
export interface IRunQueryRequest {
    data: IDictionary;
    query: string;
    parameters: Array<[string, string]>;
    linkId: number;
}
export interface IScriptRequest {
    scriptId: string;
    language: EditorLanguage;
    name?: string;
    content: string;
    forceSecondaryEngine?: boolean;
}
export interface INewEditorRequest {
    page: string;
    language: EditorLanguage;
    content?: string;
}
export { Stack } from "./Stack";
export declare type WorkerExecutorType<T> = (onResult?: ((taskId: number, value: T) => void), onError?: ((taskId: number, reason?: unknown) => void)) => void;
export interface IThenableCallback<T> {
    then: (onResult?: ((taskId: number, value: T) => void)) => IThenableCallback<T>;
    catch: (onError?: ((taskId: number, reason?: unknown) => void)) => void;
}
export declare type ValueType<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends undefined ? undefined : [T] extends [unknown] ? T : object;
export declare const generateColumnInfo: (dbType: DBType, rawColumns?: {
    name: string;
    type: string;
    length: number;
}[] | undefined, useName?: boolean | undefined) => IColumnInfo[];
export declare const convertRows: (columns: IColumnInfo[], rows?: unknown[] | undefined) => IDictionary[];
