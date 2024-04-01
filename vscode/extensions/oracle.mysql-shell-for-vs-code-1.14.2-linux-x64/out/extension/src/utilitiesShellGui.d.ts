import { ShellInterfaceSqlEditor } from "../../frontend/src/supplement/ShellInterface/ShellInterfaceSqlEditor";
export declare const openSqlEditorConnection: (sqlEditor: ShellInterfaceSqlEditor, connectionId: number, progress?: ((message: string) => void) | undefined) => Promise<void>;
export declare const openSqlEditorSessionAndConnection: (sqlEditor: ShellInterfaceSqlEditor, connectionId: number, sessionName: string) => Promise<void>;
